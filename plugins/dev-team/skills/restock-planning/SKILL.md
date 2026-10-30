---
name: restock-planning
description: Inventory health and restock recommendations for a Shopify store - sales velocity, days of cover, stock-outs, dead stock, reorder quantity and a purchase-order draft for the supplier that the owner approves. Use it with "qué resurto", "qué se está acabando", "inventario", "orden de compra", or when the daily cycle flags inventory risk.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Restock planning

Inventory is money sitting on a shelf. Too little loses sales; too much freezes cash. This skill turns the snapshot into one table and one
purchase-order draft. **It never changes stock in Shopify**: stock goes up only when merchandise arrives and the owner approves an `inventory_adjust`.

## Data (from `ops/data/snapshot-<date>.json`)

Per variant: `available` (sum of locations), `unitCost` (InventoryItem cost, may be null), `price`, and units sold per day from `orders.lineItems`
(exclude `VOIDED`/`EXPIRED` orders; subtract refunded units if the data has them).

## Formulas (defaults in `ops/config.json`, the owner can change them)

| Concepto | Fórmula | Default |
|---|---|---|
| Velocidad diaria | unidades vendidas en los últimos 14 días / 14 | ventana 14 d |
| Días de cobertura | disponible / velocidad (sin ventas = infinito) | |
| Punto de reorden | velocidad x tiempo de entrega del proveedor | lead time 7 d |
| Cantidad sugerida | ceil(velocidad x (lead time + cobertura objetivo)) - disponible, mínimo 0 | cobertura 21 d |
| Agotado | disponible <= 0 | |
| Riesgo | días de cobertura < lead time | 7 d |
| Stock muerto | sin ventas en 30 días y disponible > 20 | |
| Dinero inmovilizado | disponible x unitCost (solo con costo) | |

Fashion caveat: sizes behave differently; plan per variant (size/color), not per product. New products (< 14 days) have little history: say so
and use a conservative quantity the owner confirms.

## Procedure

1. Run `pnpm ops:analyze` (or read today's analysis). Check: variants with null `unitCost`, negative stock, products in `DRAFT`.
2. Build the table, sorted by risk: producto/variante, disponible, velocidad, días de cobertura, sugerido, costo estimado de la compra, razón (1 line).
3. Dead stock: propose a decision, never execute it: bundle, markdown (price change is a separate approval), or hide from the homepage collection.
4. Purchase-order draft `ops/proposals/po-<date>.md`: supplier `[NO DATA]` unless the owner gave it, SKU, quantity, unit cost, subtotal, and
   a note "borrador: la dueña confirma con su proveedor". Each line is a `restock_po` action with `status: "pending"` in the proposals file.
5. When the merchandise arrives: the owner says how many units arrived; you prepare one `inventory_adjust` action (delta, reason `received`,
   location) and the owner approves it; `ops:apply` dry-run, then `--apply`.

## Output format

Spanish, MXN. Table plus 3 lines: what to buy this week and the total cost, what is at risk, what is dead stock. Every number traces to the snapshot;
if `"source": "mock"`, the first line says "Datos de demostración".

## Never

- Change inventory, prices or product status in Shopify without an approved action.
- Contact suppliers or place orders; invent supplier names, lead times or costs.
- Hide that a variant has no cost (margin and cash figures exclude it and say how many).

## Why

A simple velocity x cover rule beats gut feeling for a small catalog, is easy to explain in class, and keeps the decision (and the money) with the owner.

Sources (checked 2026-10-30): inventory quantities and `InventoryItem.unitCost` in the Admin GraphQL API
https://shopify.dev/docs/api/admin-graphql/latest/objects/InventoryItem ; https://shopify.dev/docs/api/admin-graphql/latest/mutations/inventoryAdjustQuantities.
Formulas are standard retail practice written for this team.
