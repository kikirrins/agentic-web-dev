---
name: ecommerce-dashboard
description: Builds or extends the owner's /ops panel in a Next.js + Shopify store - KPI cards, net sales chart, orders needing attention, inventory alerts and the approve/reject list of proposals - reading the ops analysis files server-side, password protected, with no chart library required. Use it with "hazme un dashboard", "quiero ver las ventas en una página", or to add a chart or table to /ops.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# E-commerce dashboard (`/ops`)

The panel is where the owner sees the store and decides. It shows; it never executes. Approve/Reject only changes a proposal's `status`.

## What data Shopify gives for a dashboard

| Bloque | Fuente | Campos |
|---|---|---|
| Ventas por día, ventas netas, pedidos | snapshot `orders` o ShopifyQL `FROM sales` | `total`, `subtotal`, `discounts`, `refunded`, `createdAt` / `total_sales`, `net_sales`, `orders` |
| Ticket promedio, nuevas vs recurrentes | snapshot `orders` | `customerOrdersCount` (agregado) |
| Pedidos por estado y "requiere atención" | snapshot `orders` | `financialStatus`, `fulfillmentStatus`, `createdAt` |
| Inventario, alertas, cobertura | snapshot `products.variants` | `available`, `locations`, velocidad de `analysis` |
| Margen | snapshot + `InventoryItem.unitCost` | solo variantes con costo |
| Top productos | analysis o ShopifyQL `GROUP BY TOP 10 product_title` | |
| Tráfico y conversión | ShopifyQL sessions `[UNVERIFIED]` / Shopify Analytics | si no hay, "[NO DATA]" |

The public Storefront API is for shoppers (catalog, `availableForSale`, cart); it does not return orders or costs. Back-office data always comes
from the Admin API on the server.

## Procedure

1. Read the latest `ops/data/analysis-<date>.json` and `ops/proposals/<date>.json` in a Server Component (`fs` on the server, never fetched from the browser).
2. Layout (mobile first, the owner checks it on the phone):
   - Banda "Datos de demostración" if `source` is `mock`.
   - KPI cards: hoy / 7 d / 30 d (ventas netas, pedidos, ticket promedio, margen %), each with change vs previous period.
   - Net sales by day: inline SVG line or bars (no library); accessible `<title>` and a data table fallback.
   - "Requiere atención": orders table (pedido, fecha, estado financiero, estado de envío, motivo).
   - Inventario: alerts table (agotado / riesgo / stock muerto) with days of cover and suggested quantity.
   - Acciones propuestas: list with reason and Aprobar / Rechazar (server action updating `status`), plus the note "Aprobar no ejecuta: la ejecución corre con ops:apply".
3. Protection: `OPS_PASSWORD` in `.env.local`, cookie session, constant-time compare; `/ops` never indexed (`robots: noindex`).
4. Follow the designer's tokens (`modern-ui`); numbers in tabular figures, MXN with `Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })`.
5. Verify: `pnpm build`; open `/ops` without the password (redirects) and with it; screenshot at 375 and 1280 with `visual-verification`.

## Prompts (copy and adapt)

- "Con el tech-lead: agrega a /ops una gráfica de ventas netas por día de los últimos 30 días contra los 30 anteriores, en SVG sin librerías, con tabla de respaldo accesible."
- "En /ops agrega una tarjeta de margen bruto del mes con el número de variantes sin costo, y un enlace a la lista para que yo las complete en Shopify."
- "Haz que /ops se vea bien en mi celular: KPIs arriba, luego acciones por aprobar, luego pedidos e inventario."

## Never

- Call the Admin API or expose tokens from client components; put back-office data behind a public route.
- Add a button that executes mutations; approve on the owner's behalf.
- Show customer personal data.

## Why

A dashboard that only reads files the agent already produced is fast, cheap and safe: the owner sees the same numbers the agent used, and every
change still goes through approval, dry-run and audit.

Sources (checked 2026-10-30): https://shopify.dev/docs/apps/build/shopifyql/graphql-admin-api/build-a-sales-dashboard ;
https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/getting-started.
