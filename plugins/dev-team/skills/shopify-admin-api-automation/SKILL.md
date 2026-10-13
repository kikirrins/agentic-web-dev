---
name: shopify-admin-api-automation
description: Automates a Shopify store with the Admin GraphQL API, webhooks and Shopify Flow - bulk product/inventory updates, metafield sync, order and fulfillment helpers, discounts/collections, low-stock alerts and reports - always dry-run first, with auth in .env.local, cost-aware requests and an audit log. Use it when the person wants Shopify tasks done by script or by Flow instead of by hand.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch
---

# Shopify Admin API automation

> **Standalone mode:** if the `agentos_*` tools are not available (AgentOS not installed), skip every `agentos_*` call and any "virtual file"/Archivos step: write the document on disk inside the project folder (`<project>/...`) and tell the person its relative path.

Current API version on 2026-10-13: **`2026-10`** (quarterly releases; 4 stable versions supported; `2027-01` is a release
candidate). Pin the version in one constant and re-check https://shopify.dev/docs/api/usage/versioning when starting work.
Endpoint: `POST https://<store>.myshopify.com/admin/api/2026-10/graphql.json`, header `X-Shopify-Access-Token`.

## Auth (the person creates credentials; the agent never sees secrets in chat)

1. Create an app in the **Dev Dashboard** with only the scopes needed (e.g. `read_products`, `write_products`,
   `read_inventory`, `write_inventory`, `read_orders`), release a version and install it on the store. The
   admin-created custom apps flow is legacy: Shopify says you can no longer create them.
2. **Client credentials grant** (server-side, no redirect): `POST https://<store>.myshopify.com/admin/oauth/access_token`,
   form body `grant_type=client_credentials&client_id=...&client_secret=...`; the token expires in about 24 h (`expires_in`), so
   cache and refresh it. It works **only when the app and the store are in the same Shopify organization** (your own dev
   stores). For a client's store outside your org, use custom distribution + authorization code grant `[UNVERIFIED: not walked through]`.
3. Secrets go in `.env.local` (names: `SHOPIFY_STORE`, `SHOPIFY_CLIENT_ID`, `SHOPIFY_CLIENT_SECRET`), git-ignored; scripts read
   them with `process.env` (`node --env-file=.env.local`). Run `env-loader-check`. Never print tokens or log request headers.

## Procedure

1. **Script layout** in `~/AgentOS/dev/<project>/automation/`: `lib/shopify.mjs` (token + `gql(query, vars)` with retry),
   one script per job, `logs/` (audit). Node built-in `fetch`, no extra dependencies.
2. **Cost and rate limits**: the Admin API uses calculated cost; every response has `extensions.cost`
   (`requestedQueryCost`, `actualQueryCost`, `throttleStatus.currentlyAvailable/restoreRate`). A single query may not exceed
   cost 1000 (`MAX_COST_EXCEEDED`); `THROTTLED` errors need backoff (start 1 s). `gql()` reads `throttleStatus` and sleeps when low;
   request only the fields needed, `first: 50`, paginate with `pageInfo { hasNextPage endCursor }`.
3. **Reads at scale -> bulk operations**: `bulkOperationRunQuery(query: """...""")` (omit `first`/`pageInfo`), poll
   `bulkOperation(id:)` (2026-01+; older versions `currentBulkOperation`) until `COMPLETED`, download `url` (JSONL,
   children carry `__parentId`), parse line by line. Up to 5 concurrent per shop in 2026-01+.
4. **Writes**: prefer `productSet` (create/update a product with variants; omitted list fields such as variants are deleted, so
   send the full list), `metafieldsSet` (max 25 per call; optional `compareDigest` guards concurrent edits), and
   `inventorySetQuantities`. Check each input type in the docs or by schema introspection before use: for example the
   2026-10 docs use both `compareQuantity` and `changeFromQuantity` `[UNVERIFIED: confirm which is current]`. Always select `userErrors { field message }` and treat any
   non-empty list as failure. Use `@idempotent(key: "<uuid>")` on mutations that accept it, and derive the key from the job id + row so a retry does not repeat.
5. **Dry-run first**: every script has `--apply`; without it, it prints a diff table (id, field, old -> new) to
   `logs/<job>-<timestamp>.json` and exits. The person reviews the diff file; **only with explicit approval for that job, run `--apply`**
   (on a dev store you may apply freely; on a real store, each run is a fresh approval).
6. **Audit log**: with `--apply`, append one JSON line per change (time, job, resource id, old, new, result, idempotency key).
   Deliver logs as virtual files. Rollback = a script that reads the log and writes the old values (dry-run first too).
7. **Webhooks**: delivery to HTTPS/Pub/Sub/EventBridge; verify the `X-Shopify-Hmac-Sha256` HMAC on the raw body, dedupe by
   `X-Shopify-Webhook-Id`, ack fast and process async; ordering and delivery are not guaranteed, so add a periodic reconciliation
   query filtered by `updated_at`. Subscribe via `shopify.app.toml` or the Admin API. Always: signature check, schema validation, idempotency.
8. **Shopify Flow** (free app on Basic/Grow/Advanced/Plus; the "Send HTTP request" action only on Grow/Advanced/Plus): the agent writes
   `flows/<name>.md` specs (trigger, conditions, actions, test plan, owner) and the person builds them in the admin. Recipes:
   low stock (inventory quantity changed -> condition < N -> email/tag), tag high-value customers, flag orders from
   risky regions for review, auto-tag new products for a collection. Flow trigger/action names `[UNVERIFIED]`: copy them from the admin picker.
9. **Common jobs**: bulk price change (percent, by collection), inventory import from CSV, metafield sync from a sheet, discount/collection
   automation, orders-to-fulfill report (`orders(query: "fulfillment_status:unfulfilled")`), daily low-stock list.
   Orders older than 60 days need `read_all_orders` and customer fields may need protected-customer-data approval `[UNVERIFIED]`.

## Output format

`automation/README.md` (jobs, env var names, how to run dry-run/apply), per-job spec (inputs, scopes, expected diff), logs, Flow specs.

## Never

- Run a mutation on a real store without explicit approval of that run; skip dry-run; ignore `userErrors`.
- Put tokens or secrets in code, logs, chat or git; use a broader scope than the job needs.
- Delete products/orders/customers in bulk; send emails or discount codes to customers (drafts for the person).
- Rely on webhooks alone for correctness.

## Why

The Admin API changes real prices, stock and orders in seconds. A diff the person reads first, an audit log and idempotent writes turn
risky bulk edits into reversible ones.

Sources (checked 2026-10-13): https://shopify.dev/docs/api/usage/versioning ; https://shopify.dev/docs/api/admin-graphql/latest (cost, auth header) ;
https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/client-credentials-grant ;
https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens ; https://shopify.dev/docs/api/usage/bulk-operations/queries ;
https://shopify.dev/docs/api/usage/idempotent-requests ; https://shopify.dev/docs/api/admin-graphql/latest/mutations/productSet ,
.../metafieldsSet , .../inventorySetQuantities , .../queries/orders ; https://shopify.dev/docs/apps/build/webhooks ;
https://help.shopify.com/en/manual/shopify-flow ; https://shopify.dev/docs/api/usage/rate-limits (leaky bucket, 1 s backoff).
