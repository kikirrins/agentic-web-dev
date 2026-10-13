---
name: shopify-choose-approach
description: Decision guide for how to build an online store - Shopify Liquid theme, Hydrogen/Oxygen headless, Next.js + Shopify Storefront API, or own Next.js + Stripe store. Use it BEFORE building any store, whenever the person says "tienda en línea", "Shopify", "ecommerce" or asks which option fits; it ends in a written recommendation the person approves.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch
---

# Choose the store approach

> **Standalone mode:** if the `agentos_*` tools are not available (AgentOS not installed), skip every `agentos_*` call and any "virtual file"/Archivos step: write the document on disk inside the project folder (`<project>/...`) and tell the person its relative path.

Four real options. Pick by facts about the business, not by what is fashionable. This skill extends
`bootstrap-ecommerce`, which already says "hundreds of products or inventory -> consider Shopify".

## The four options

| Option | What it is | Pick it when |
|---|---|---|
| A. Shopify + Liquid theme | Shopify hosts and renders the store; you customize a theme (`shopify-liquid-theme`) | Default for a small shop that wants to sell soon with the least maintenance |
| B. Shopify + Next.js (Storefront API) | Our stack for the frontend, Shopify for catalog, cart and checkout (`shopify-headless-storefront`) | The brand site is already Next.js, or the design cannot live in a theme, and someone maintains code |
| C. Hydrogen + Oxygen | Shopify's recommended headless stack: Hydrogen (React Router app) hosted on Oxygen | Headless is needed and the person wants Shopify-managed hosting and deploys |
| D. Own Next.js + Stripe | Catalog in our database (`bootstrap-ecommerce`) | Up to ~50 products, simple variants, full control, no inventory/shipping tooling needed |

## Procedure

1. **Ask** (never assume): number of products and variants; inventory in more than one place; who
   updates products day to day; who will maintain code; existing site/brand; sales channels (Instagram,
   Facebook, marketplaces, POS); budget for monthly fees and apps; timeline.
2. **Mexico check** for each option: payments (Shopify Payments is available in Mexico with cards and
   OXXO; Stripe/Mercado Pago for D), IVA shown in prices, shipping carriers, and invoicing (CFDI).
   Shopify does NOT issue CFDI natively: it needs a third-party app or the accountant's process
   (see `shopify-store-setup`). Say this out loud; owners often assume it is included.
3. **Score** the options with the table below and write the reasons.
4. **Recommend one**, name the runner-up and what would change the recommendation.
5. **Default for a small fashion brand** (tens to low hundreds of products, size/color variants, Instagram
   traffic, a non-technical owner): **A, Shopify with a Liquid theme**. Inventory, shipping, discounts, taxes
   and checkout are solved; the brand site can still be our Next.js landing that links to the store
   (or option B later if the design demands it). Hydrogen (C) is not the default: it costs more to
   build and maintain than a theme and Shopify itself says to consider headless only when themes and apps
   cannot support the business.
6. Hand over to `tech-lead`/the right agent: A or Shopify automation -> `shopify-developer`;
   B -> `shopify-developer` for Shopify side + `frontend-engineer`; D -> `bootstrap-ecommerce`.

## Output format

Write `docs/store-approach.md` (also with `agentos_file_write` under `dev/<project>/docs/`):

```
# Store approach - <brand>
Facts: products N, variants, locations, maintainer, channels   (or [NO DATA: ...])
| Criterion | A Liquid | B Next+SF API | C Hydrogen | D Own+Stripe |
| Time to sell | ... |  Monthly cost | ... | Maintenance | ... | SEO control | ... | Apps/ecosystem | ... | MX payments/taxes/shipping | ... |
Recommendation: <option> because <3 reasons>. Runner-up: <option>. Changes my mind if: <fact>.
Costs: verify current pricing at shopify.com/mx/precios (do not quote from memory).
Open questions for the person: ...
```

## Never

- Recommend headless (B/C) to a non-technical owner without stating the maintenance cost.
- Quote Shopify plan prices or app fees from memory; use the pricing page or say `[NO DATA]`.
- Start building before the person approves the approach.

## Why

Choosing wrong is the most expensive mistake: a custom store rebuilt as Shopify (or the reverse) wastes
weeks. A one-page decision with reasons lets the owner approve it in two minutes.

Sources (checked 2026-10-13): https://shopify.dev/docs/storefronts/headless (headless "costs more to build and
run than a theme"; Hydrogen, bring-your-own-stack, Headless vs Hydrogen channels);
https://shopify.dev/docs/storefronts/headless/hydrogen/fundamentals (Hydrogen = React Router app, Oxygen =
hosting, Oxygen on paid plans only, not dev stores);
https://help.shopify.com/en/manual/payments/shopify-payments/supported-countries (Mexico listed);
https://help.shopify.com/en/manual/payments/shopify-payments/local-payment-methods/oxxo (OXXO: MXN 10-10,000,
not for subscriptions/POS); https://help.shopify.com/en/manual/taxes/tax-collection-and-reporting (Mexico is
under Manual Tax; "tax is your responsibility"). `[UNVERIFIED]`: Shopify native CFDI support is not documented
in the pages read; treat as absent. Third-party CFDI apps exist (Shopify App Store: Factoro, CFDI Express, FiscalPOP;
prices on listings change, verify).
