---
name: ecommerce-financial-analysis
description: Financial analysis of a Shopify store - gross, discounts, refunds and net sales, average order value, gross margin with unit cost, new vs returning customers, top products, order-status mix, period comparisons - from the ops snapshot or ShopifyQL, with ready-to-use prompts and a weekly/monthly report. Use it with "análisis de ventas", "cuánto vendí", "margen", "reporte financiero de la tienda", or before building a dashboard.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch
---

# E-commerce financial analysis

Turn orders into decisions. Two data paths, both read-only:

- **Snapshot** (`ops/data/snapshot-<date>.json`, from the Admin API `orders`, `products`, `InventoryItem`): works on any plan and on dev stores; you compute everything.
- **ShopifyQL** (Admin GraphQL `shopifyqlQuery`, API 2025-10+): Shopify's own analytics tables. Needs the `read_reports` scope and
  Level 2 protected customer data access (approval can take time). Use it when available; otherwise the snapshot.

```graphql
query { shopifyqlQuery(query: "FROM sales SHOW total_sales, orders TIMESERIES day SINCE -30d COMPARE TO previous_period WITH TOTALS ORDER BY day ASC") {
  tableData { columns { name dataType displayName } rows } parseErrors } }
```
Check `parseErrors` before reading `tableData`. Verified columns: `total_sales`, `orders`, `net_sales`, `day`, `product_title`; any other column
(`gross_sales`, `discounts`, `returns`, ...) is `[UNVERIFIED]` until checked in https://shopify.dev/docs/api/shopifyql.

## KPI definitions (state them in every report)

| KPI | Cálculo (snapshot) | Nota |
|---|---|---|
| Ventas brutas | suma de `subtotal` + descuentos de pedidos no anulados | antes de descuentos |
| Descuentos | suma de `discounts` | |
| Reembolsos | suma de `refunded` | por fecha del pedido (simple) |
| Ventas netas | brutas - descuentos - reembolsos | di si incluye IVA (precios en MX suelen incluirlo) |
| Pedidos | conteo sin `VOIDED`/`EXPIRED` | |
| Ticket promedio (AOV) | ventas netas / pedidos | |
| Margen bruto | ventas netas de líneas con costo - unidades x `unitCost` | excluye variantes sin costo y dice cuántas |
| % margen | margen bruto / ventas netas con costo | |
| Clientas nuevas vs recurrentes | por `customerOrdersCount` (1 = nueva) | agregado, sin nombres |
| Pedidos por estado | conteo por `financialStatus` y `fulfillmentStatus` | ver `ecommerce-daily-cycle` |
| Top productos | por unidades y por ventas netas | top 5 y 5 sin movimiento |
| Tasa de reembolso | reembolsos / ventas brutas | |

Not available from orders alone: conversion rate, sessions and traffic (ShopifyQL `sessions` tables or Shopify Analytics `[UNVERIFIED]`),
ad spend (Meta/Google, separate source), shipping costs paid to carriers, payment fees (check the payouts report). Say "[NO DATA]" rather than estimate.

## Procedure

1. Pick the period (hoy, 7 d, 30 d, mes calendario) and the comparison (periodo anterior). Same timezone as the store.
2. Compute from the snapshot (`pnpm ops:analyze` already does today/7d/30d); for other periods write a small read-only script in `ops/` (no new deps).
3. Sanity checks: totals match the sum of orders; no mixed currencies; refunds not double counted; mock data flagged.
4. Write `ops/reports/finanzas-<period>.md`: 3-line summary (qué pasó, por qué, qué hacer), KPI table with change vs previous period, top/bottom
   products, margin section with the count of variants without cost, and **max 3 recommended actions** (each one a proposal the owner approves).
5. For charts or a panel, hand the numbers to `ecommerce-dashboard`.

## Prompts (copy and adapt)

- "Con el store-manager: dame el análisis financiero de los últimos 30 días contra los 30 anteriores: ventas brutas, descuentos, reembolsos, ventas netas, pedidos, ticket promedio y margen. Dime qué cambió y por qué, con números del snapshot."
- "¿Qué productos me dejan más margen y cuáles casi no se venden? Tabla con unidades, ventas netas, costo y % de margen; marca los que no tienen costo."
- "¿Cuánto vino de clientas nuevas y cuánto de recurrentes este mes? ¿El ticket promedio cambia entre ellas?"
- "¿Cuánto me están costando los descuentos? Compara ventas con y sin código de descuento y dime si el descuento trajo pedidos extra o solo bajó el margen." `[descuento por pedido en snapshot; códigos: ver discountCodes en Order, UNVERIFIED]`
- "Haz el cierre del mes en una página: KPIs, top 5, sin movimiento, dinero inmovilizado en inventario y 3 acciones para el mes que entra."

## Never

- Estimate a number not in the data; present mock data as real; mix "con IVA" and "sin IVA" in one table.
- Put customer names, emails or addresses in reports.
- Give tax advice: IVA/ISR and CFDI questions go to the owner's accountant.

## Why

Small stores usually look only at total sales. Net sales, margin and the new-vs-returning split are what tell the owner if the business is healthy,
and the snapshot makes every number auditable.

Sources (checked 2026-10-30): https://shopify.dev/docs/apps/build/shopifyql/graphql-admin-api/build-a-sales-dashboard (shopifyqlQuery shape, read_reports,
Level 2 access, columns) ; https://shopify.dev/docs/api/admin-graphql/latest/queries/orders ; https://shopify.dev/docs/api/admin-graphql/latest/objects/InventoryItem.
