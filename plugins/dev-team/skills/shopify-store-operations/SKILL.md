---
name: shopify-store-operations
description: Day-to-day management routines for a live Shopify store - orders to fulfill, low stock, abandoned checkouts, reviews, pricing/promo calendar, collection merchandising and reports - plus a weekly store report template and the hand-off to marketing. Use it when the person asks "how is the store", wants a routine, a report, or help running the store week to week.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Shopify store operations

> **Standalone mode:** if the `agentos_*` tools are not available (AgentOS not installed), skip every `agentos_*` call and any "virtual file"/Archivos step: write the document on disk inside the project folder (`<project>/...`) and tell the person its relative path.

The store runs on routines. The agent prepares lists, reports and drafts; **the person fulfills orders, answers customers,
changes prices and sends emails**. Data comes from the admin exports the person uploads, or read-only scripts from
`shopify-admin-api-automation` (queries only; no mutations here).

## Procedure

1. **Daily (10 min)**: orders paid and unfulfilled (oldest first); orders with payment pending (OXXO/SPEI orders stay pending
   until paid); refunds/returns open; low-stock products (list under the threshold the person set); customer messages waiting.
2. **Weekly (45 min)**: sales vs last week (orders, units, revenue in MXN, average order value); top 5 and bottom 5 products;
   stock-outs and what sold out fastest; abandoned checkouts (count, recoverable value; recovery email = draft for the person);
   returns reasons; collection merchandising (move best sellers up, hide out-of-stock, refresh the homepage featured collection);
   reviews to answer; promo calendar for the next 2 weeks.
3. **Monthly**: price and margin review (compare `Cost per item` vs price), slow movers (no sale in 60 days -> markdown/bundle proposal),
   app audit (each app: used? cost? verify on listing), policy and shipping-rate check, IVA/CFDI requests handed to the accountant.
4. **Pricing and promos**: propose changes as a table (product, current, proposed, reason, margin); the person approves; apply by hand
   or via `shopify-admin-api-automation` (dry-run, then approval). Discount codes and sale dates are drafts. Never invent prices.
5. **Merchandising**: write `merchandising-notes.md` with rules (new arrivals first, size availability, seasonal order) the person confirms.
6. **Weekly report**: fill the template below from real numbers; missing number -> `[NO DATA: ...]`, never an estimate. Write it as a virtual file
   `dev/<project>/reports/<YYYY-MM-DD>-store-weekly.md`.
7. **Hand to marketing**: put audience, best sellers, stock depth, margin room and planned promos in a "Marketing brief" section and tell the
   person (via the COO) to ask `marketing-team`; related skills there by name: `content-calendar`, `content-script`, `image-prompt`, `publish-package`,
   `market-research`, `metrics-sqlite`, `html-report`. Do not run ads or write campaigns yourself.

## Output format (weekly report template, Spanish, MXN, dates like `15 oct 2026`)

```
# Reporte semanal de tienda - semana del <fecha> al <fecha>
Resumen (3 líneas): ventas, lo mejor, lo que preocupa
| Métrica | Esta semana | Semana anterior | Cambio |
| Pedidos | | | |  | Unidades | | | |  | Ventas (MXN, con IVA) | | | |  | Ticket promedio | | | |
Top 5 productos: ... | Sin movimiento: ... | Agotados / stock bajo (< umbral): ...
Pedidos por surtir: N (el más antiguo: <fecha>) | Pago pendiente (OXXO/SPEI): N | Devoluciones: N
Checkouts abandonados: N, valor recuperable $X  -> borrador de correo: <archivo>
Acciones propuestas (la persona aprueba): 1) ... 2) ... 3) ...
Brief para marketing: ...
Faltantes: [NO DATA: ...]
```

## Never

- Fulfill, refund, cancel, edit prices/stock, email customers or publish promos yourself.
- Estimate a figure that is not in the data; mix currencies; report revenue without saying whether it includes IVA.
- Store customer personal data (emails, addresses) in reports; aggregate instead.
- Quote app or plan fees from memory (`https://www.shopify.com/mx/precios` for plans; app listings for apps).

## Why

Stores lose money quietly: late shipping, silent stock-outs, stale promos. A short fixed routine and one weekly page of real numbers catches those
before customers do, and keeps the owner deciding rather than digging through the admin.

Sources: operating routines are written from scratch for this team (not Shopify doc content). Order status filters used by the read-only queries:
https://shopify.dev/docs/api/admin-graphql/latest/queries/orders (`fulfillment_status:unfulfilled`, `financial_status:pending`). Admin report names and
abandoned-checkout screens `[UNVERIFIED]`: locate them in the admin (Analytics, Orders > Abandoned checkouts).
