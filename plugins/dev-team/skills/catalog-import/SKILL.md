---
name: catalog-import
description: Initial load of a Shopify store from the owner's spreadsheet - products, variants, prices, unit cost, images and inventory split by branch (sucursal, a Shopify location) - with a dry-run first and the owner's OK before writing. Use it with "carga mis productos", "sube mi inventario", "tengo mi catálogo en Excel", "inventario por sucursal", or when a new store is empty.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch
---

# Catalog import (products + inventory by branch)

> **Standalone mode:** if the `agentos_*` tools are not available, work only on disk inside the store project and tell the person relative paths.

The store starts empty. The owner already has her catalog somewhere (Excel, Google Sheets, a notebook). This skill turns it into
one CSV with a fixed shape, shows exactly what would be created, and only then writes to Shopify. **Dry-run first, always.**

```
owner's spreadsheet --> ops/data/catalogo.csv (fixed columns, one row per variant, one column per branch)
                    --> pnpm ops:import            (dry-run: plan + problems, nothing written)
                    --> owner says "cárgalo"
                    --> pnpm ops:import --apply    (productSet per product; stock per location)
                    --> pnpm ops:snapshot          (proof: counts per branch match the CSV)
```

## 1. Branches are Shopify locations

Each sucursal is a **location** in Shopify (Settings → Locations). Inventory lives per variant **per location**; the store total is the sum.
- List them first (`locations(first: 50) { nodes { id name isActive fulfillsOnlineOrders } }`, scope `read_locations`).
- A branch in the CSV that does not exist: tell the owner. Either she creates it in the admin (Settings → Locations → Add location; the agent
  guides her) or, if the Admin app has `write_locations`, propose a `locationAdd` (name + address with at least `countryCode`) and wait for her OK.
- `fulfillsOnlineOrders`: ask her which branches ship online orders. A branch that only sells in person keeps stock but does not sell online.
- The number of locations depends on the Shopify plan `[UNVERIFIED: check the current plan limits in the Shopify Help Center]`.

## 2. The CSV (template: `catalogo-plantilla.csv`)

One row per **variant**. Rows with the same `handle` are the same product. Columns:

| Column | Required | Notes |
|---|---|---|
| `handle` | yes | URL of the product, lowercase, no accents: `vela-lavanda`. Same handle = same product. |
| `title` | yes (first row of the product) | Name the customer sees. |
| `description` | no | Plain text; the script wraps it in `<p>`. |
| `vendor`, `product_type`, `tags` | no | `tags` separated by `;`. |
| `option1_name`, `option1_value` | no | E.g. `Talla` / `M`. Empty = product without variants. |
| `option2_name`, `option2_value` | no | E.g. `Color` / `Rosa`. |
| `sku` | yes | Unique per variant. The agent uses it to cross sales, stock and views. |
| `price` | yes | MXN, IVA included if that is how she sells. |
| `compare_at_price` | no | "Antes" price for sales. |
| `cost` | strongly advised | Unit cost: without it there is no margin. |
| `image_url` | no | Public URL (first row of the product). |
| `inv:<Branch name>` | one per branch | Units **available** at that branch today. Exact location name. |

Example header: `handle,title,description,vendor,product_type,tags,option1_name,option1_value,option2_name,option2_value,sku,price,compare_at_price,cost,image_url,inv:Centro,inv:San Pedro`

Converting her spreadsheet: read it (CSV/XLSX export; if XLSX, ask her to "Guardar como CSV" or read it with a script), map her columns to
these, and **show her the mapping and the first 5 rows** before writing `ops/data/catalogo.csv`. Never invent prices, costs or stock:
an empty cell stays empty and goes to the problems list.

## 3. Run it

The script `scripts/import-catalog.mjs` (copy to `ops/import-catalog.mjs`; it uses `ops/lib/admin.mjs` from the agentic-shop template) and the
`package.json` script `"ops:import": "node --env-file-if-exists=.env.local ops/import-catalog.mjs"`.

- `pnpm ops:import` → dry-run: products and variants to create, units per branch, totals, and problems (missing SKU or price, duplicated SKU,
  branch not found, negative or non-numeric stock, variant without cost). Nothing is written.
- `pnpm ops:import --apply` → only after the owner says so. One `productSet` per product (create or update by `handle`, status `DRAFT` by
  default so nothing shows on the site until she reviews it; `--active` publishes as `ACTIVE`), variants with `inventoryItem.cost`
  and `inventoryQuantities` per location (`name: "available"`). Writes `ops/logs/import-<date>.jsonl`.
- Scopes for the Admin app: `write_products` (and `read_products`), `write_inventory`, `read_locations`; `write_locations` only if the agent
  creates branches. The owner adds them in the Dev Dashboard; the app must be reinstalled/updated for new scopes to apply.
- Products that already existed: `productSet` updates them; check the stock afterwards in the snapshot. Stock corrections after the first
  load are **not** a re-import: they are `inventory_adjust` proposals in the daily cycle (`ops:apply`).

## 4. Prove it

`pnpm ops:snapshot` and compare: products, variants and units **per branch** must match the CSV totals. Report a 3-line summary
(products, variants, units per branch) and the problems that stayed open. Then remind her: the products are in `DRAFT`; she reviews
photos and prices in the admin or on the site and approves publishing them.

## Never

- Write to Shopify without the dry-run shown and the owner's "cárgalo" for that run.
- Fill missing prices, costs or stock with guesses.
- Use the import to "fix" stock every week: that is the daily cycle's job, with audit.
- Put customer data in the CSV.

## Why

The first load is the moment a store gets its data right or wrong for months. A fixed CSV with one column per branch is something the owner
can read and check in her own spreadsheet program; the dry-run turns "did it work?" into a list she can verify line by line.

Sources (checked 2026-11-03): https://shopify.dev/docs/api/admin-graphql/latest/mutations/productSet ;
https://shopify.dev/docs/api/admin-graphql/latest/mutations/inventorySetQuantities ;
https://shopify.dev/docs/api/admin-graphql/latest/mutations/locationAdd .
`ProductSetIdentifiers.handle`, `ProductSetInput.files` and the exact `inventoryQuantities` semantics on update are `[UNVERIFIED]`:
re-check them on shopify.dev before the first `--apply`.
