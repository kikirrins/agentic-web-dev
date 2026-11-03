---
name: growth-analytics
description: Joins the storefront's traffic (GA4, Meta, Clarity) with Shopify's orders, carts, products and inventory by branch, by SKU - funnel by channel and device, products with many views and few sales, demand with low stock, products nobody sees - and turns it into at most 3 actions the owner approves. Use it with "de dónde vienen mis ventas", "por qué no venden", "qué producto empujo", "cómo va el embudo", "funcionan mis anuncios", or weekly inside the daily cycle.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch
---

# Growth analytics (traffic × Shopify)

> **Standalone mode:** if the `agentos_*` tools are not available, work only on disk inside the store project and tell the person relative paths.

Shopify knows **what** sold and what is left in each branch. GA4 knows **who came, from where, and what they looked at**. Neither one alone
tells the owner what to do. The join key is the **SKU** (`item_id` in GA4 = `sku` in Shopify; `storefront-analytics` sets it up) and, for
purchases, the **order ID** (`transaction_id` = Shopify order name/ID).

## Setup (once)

1. `storefront-analytics` done and verified (events with `item_id` = SKU, purchases from the checkout pixel).
2. GA4 Data API access, read-only. The owner, guided step by step:
   Google Cloud console → project → enable "Google Analytics Data API" → Service account → Keys → JSON. She saves the file **outside**
   the project folder (e.g. `~/llaves/ga4-tienda.json`) and adds the service account email as **Viewer** in GA4 → Admin → Property access.
   In `.env.local` she writes `GA4_PROPERTY_ID=` (digits from GA4 → Admin → Property details) and `GA4_KEY_FILE=` (path to the JSON).
   You never open, print or copy the key.
3. Copy `scripts/growth.mjs` to `ops/growth.mjs` and add `"ops:growth": "node --env-file-if-exists=.env.local ops/growth.mjs"`.
   Without credentials it runs on demo data (`--mock`) built from the snapshot's SKUs, marked `DATOS DE DEMOSTRACIÓN`.
4. Optional: Search Console (`ecommerce-seo`), Meta Ads results (Ads Manager export or the Meta MCP if installed) and Clarity
   (dashboard; its Data Export API returns only the last 1-3 days `[UNVERIFIED limits]`).

## Procedure

1. `pnpm ops:snapshot` (or the daily cycle) then `pnpm ops:growth [--days 30]` → `ops/data/growth-<date>.json` and `ops/reports/growth-<date>.md`.
2. Sanity checks before any conclusion:
   - **GA4 purchases vs Shopify orders.** A gap over 20% means a measurement problem (consent rejected, checkout pixel missing, orders
     from the physical store or draft orders that never touched the site). Explain which before analyzing.
   - Products with `sin_datos_ga4`: `item_id` is not the SKU, or the product had no traffic. Fix the tagging, do not guess.
   - Branch stock comes from the snapshot (`locations[]`). Online sales only use branches with `fulfillsOnlineOrders`.
3. Read the four signals per SKU (thresholds in the script; tune them in `ops/config.json` if the store is very small or very large):

| Signal | What it usually means | Typical action (a proposal, never executed by you) |
|---|---|---|
| Many views, few sales | Photo, price, size guide or shipping cost scares people off | Review the product page with Clarity recordings; A/B the photo or copy |
| Demand with low stock | Selling out what people want | Restock first (`restock-planning`), or transfer between branches |
| Low visibility, high stock | Nobody finds it | SEO and collection placement (`ecommerce-seo`), feature it on the home or in a post |
| Channel converts much less than the rest | Wrong audience or landing page | Change the landing page or the ad's audience; do not just raise budget |

4. Write the owner **5 lines max**: where sales come from (channel and device), the funnel step where most people drop, the one product
   to push, the one to restock or move between branches, and the one measurement problem if any. Then **max 3 actions** as proposals in
   `ops/proposals/<date>.json` (`type: "growth_action"`, `status: "pending"`, reason in one line, expected effect and how to measure it).
5. Weekly (Fridays) add the section "Crecimiento" to the weekly report: same table week over week.

## Rules

- Every number traces to `growth-<date>.json` or the snapshot. GA4 is sampled/modelled and consent-limited: say "aprox." for GA4 numbers;
  Shopify is the source of truth for money and units.
- Correlation is not cause: write "probable", and propose a test (one change, one week, one metric) instead of a verdict.
- No personal data: channels, products and counts only.
- Ads money is the owner's decision: you can recommend pausing or moving budget, never change campaigns.

## Why

A small store usually has two dashboards nobody cross-checks. Joining them by SKU turns "I have visits but no sales" into "the pink size M
gets 300 views and sells 2; people watch the video and leave at the size chart" — something the owner can fix this week.

Sources (checked 2026-11-03): https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema (dimensions `sessionDefaultChannelGroup`,
`landingPage`, `deviceCategory`, `itemId`, `itemName`; metrics `sessions`, `addToCarts`, `checkouts`, `ecommercePurchases`, `purchaseRevenue`,
`itemsViewed`, `itemsAddedToCart`, `itemsPurchased`, `itemRevenue`) ; https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport .
