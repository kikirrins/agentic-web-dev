---
name: ecommerce-daily-cycle
description: The store manager's daily cycle for a Shopify store with a Next.js storefront - snapshot of orders and inventory, analysis, proposals for the owner, approval and audited execution - plus how to schedule it every morning and what each order status means. Use it every day, with "¿cómo va la tienda hoy?", "revisa pedidos e inventario", or to set up the routine in a new store project.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# E-commerce daily cycle

> **Standalone mode:** if the `agentos_*` tools are not available, work only on disk inside the store project and tell the person relative paths.

One loop, every day: **snapshot -> analyze -> propose -> (owner approves) -> apply -> audit**. The agent does the first three alone; the
owner decides; a script executes only what was approved, with a dry-run first.

```
Shopify (Admin API, read) --> ops:snapshot --> ops/data/snapshot-<date>.json
                                   ops:analyze --> ops/data/analysis-<date>.json + ops/reports/<date>.md
                                   ops:propose --> ops/proposals/<date>.json (+ po-<date>.md)
owner: /ops panel -> Aprobar / Rechazar  (only changes "status")
                                   ops:apply (dry-run) -> ops:apply --apply -> ops/logs/audit.jsonl
```

## Project setup (once)

The store project needs the `ops/` scripts and `/ops` panel (reference implementation: the `agentic-shop` template; if missing, the
`tech-lead` builds it with `shopify-headless-storefront` + `shopify-admin-api-automation`). Required `package.json` scripts:
`ops:snapshot`, `ops:analyze`, `ops:propose`, `ops:apply`, `ops:daily`, `ops:seed`.

Credentials (the person creates them; names only, values live in `.env.local`):
- Storefront: Headless channel -> Create storefront -> `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` (server) and the public token if the browser needs it.
- Admin (back office, server only): an app in the Dev Dashboard installed on the store, with read scopes `read_products`, `read_inventory`,
  `read_orders` and, only if the owner wants the agent to execute approved actions, `write_inventory` and the fulfillment-order write scopes.
  `SHOPIFY_ADMIN_CLIENT_ID`, `SHOPIFY_ADMIN_CLIENT_SECRET` (client credentials grant; works for stores in your own organization).
- Without credentials everything runs in mock mode (`--mock`): synthetic data marked `"source": "mock"`.

## Procedure (daily)

1. `pnpm ops:daily` (or the three steps one by one). If it fails, read the error; credentials -> `env-loader-check`; never print the token.
2. Read `ops/reports/<date>.md` and `ops/proposals/<date>.json`. Check the numbers make sense (orders today vs yesterday, negative stock, null costs).
3. Write the owner a summary of **10 lines max**, in this order: ventas de hoy y de la semana (vs semana anterior) -> pedidos que requieren
   atención -> inventario en riesgo -> acciones propuestas que esperan su OK -> faltantes de datos.
4. Never approve. When the owner approves in `/ops` (or says "aprueba la acción X" here, for that run), run `pnpm ops:apply` (dry-run),
   show what would change, and only after the owner confirms run `pnpm ops:apply --apply`. Report `applied`/`failed` and the audit lines.
5. Fridays add the weekly report (`shopify-store-operations` template) and on the 1st the monthly one (`ecommerce-financial-analysis`).

## Order statuses (Admin API `displayFinancialStatus` / `displayFulfillmentStatus`, checked 2026-10-30)

| Financiero | Qué significa para la dueña |
|---|---|
| `PENDING` | Aún no se paga (OXXO, SPEI o pago manual). No enviar. |
| `AUTHORIZED` | Banco aprobó, falta capturar antes de que expire. |
| `PAID` | Pagado. Se puede surtir. |
| `PARTIALLY_PAID` | Captura parcial. |
| `PARTIALLY_REFUNDED` / `REFUNDED` | Se devolvió parte / todo el dinero. |
| `VOIDED` / `EXPIRED` | Autorización cancelada / vencida: pago fallido. |

| Envío | Qué significa |
|---|---|
| `UNFULFILLED` | Nada enviado. |
| `IN_PROGRESS` / `SCHEDULED` / `ON_HOLD` | En proceso / programado / en pausa. |
| `PARTIALLY_FULFILLED` | Se envió una parte. |
| `FULFILLED` | Todo enviado. |
| `FULFILLMENT_NOT_REQUIRED` | Nada que enviar (digital, servicio). |
| `REQUEST_DECLINED` | El servicio de envío rechazó artículos. |

"Requiere atención" rules (defaults in `ops/config.json`): `PAID` + `UNFULFILLED` for more than 48 h; `PENDING` for more than 72 h (draft a
payment reminder, the owner sends it); any refund in the last 7 days; `REQUEST_DECLINED`.

## Scheduling (the person sets it up; you write the instructions)

- macOS/Linux cron, every day 8:00: `0 8 * * * cd <project> && pnpm ops:daily >> ops/logs/daily.log 2>&1`
- To have the agent also write the summary: `claude -p "Con el store-manager: corre el ciclo diario de la tienda y deja el resumen en ops/reports" --allowedTools "Bash(pnpm ops:*),Read,Write"`
  (verify flags with `claude --help`; never give it `ops:apply --apply` unattended).
- Claude Desktop/Code scheduled routines are an alternative; the rule is the same: unattended runs read and propose, never apply.

## Never

- Run `ops:apply --apply` unattended or without the owner's approval of that run.
- Edit a proposal's `status` to `approved` yourself.
- Present mock data as real.

## Why

An owner of a small store does not have time to open the admin every morning. A fixed loop that reads everything, explains it in ten lines and
asks for one decision at a time keeps the store in order without handing the agent the keys to the money.

Sources (checked 2026-10-30): https://shopify.dev/docs/api/admin-graphql/latest/enums/OrderDisplayFinancialStatus ;
https://shopify.dev/docs/api/admin-graphql/latest/enums/OrderDisplayFulfillmentStatus ;
https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/getting-started ;
https://shopify.dev/docs/apps/build/dev-dashboard/development-stores.
