---
name: shopify-store-setup
description: Creates and configures a Shopify store end to end with the person - dev store vs real store, products/variants/collections via CSV import, inventory and locations, shipping for Mexico, payments, taxes/IVA, policies, navigation, domain, es-MX language, apps, checkout branding and launch checklist. Use it when the person wants to open a Shopify store or fill/configure one.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Shopify store setup

> **Standalone mode:** if the `agentos_*` tools are not available (AgentOS not installed), skip every `agentos_*` call and any "virtual file"/Archivos step: write the document on disk inside the project folder (`<project>/...`) and tell the person its relative path.

The agent prepares; **the person does everything that involves accounts, billing, identity or payments**
(creating the account, choosing a plan, activating Shopify Payments, bank account, RFC, ID, domain purchase).
You never enter or ask for card, bank, RFC or ID data in chat.

## Procedure

1. **Dev store or real store?** Dev stores are for building and testing only: they cannot process real
   transactions, are always password protected, cannot be converted to production or transferred to a client
   (create via Dev Dashboard > Stores > Create store > Dev). Real store: the person creates it and adds you as
   staff/collaborator with only the permissions needed. If the store is the client's, build the theme on a dev
   store and move it by theme export/`shopify theme push --unpublished` to the real store.
2. **Brief** with the person: brand, products, price list, photos, policies. Missing -> `[NO DATA: ...]`.
3. **Prepare content as virtual files** (`dev/<project>/store/`): `products.csv`, `collections.md`,
   `policies.md` (returns, shipping, privacy, terms: drafts for the person/lawyer to approve, never invented),
   `navigation.md`, `setup-steps.md` (numbered clicks for the person, in Spanish).
4. **products.csv** (import in Products > Import). Headers must match Shopify's template:
   `Title, URL handle, Description, Vendor, Product category, Type, Tags, Published on online store, Status, SKU,
   Option1 name, Option1 value, Price, Compare-at price, Cost per item, Charge tax, Inventory tracker,
   Inventory quantity, Continue selling when out of stock, Weight value (grams), Weight unit for display,
   Requires shipping, Product image URL, Image position, Image alt text, SEO title, SEO description`.
   Rules: UTF-8, comma-separated, LF line endings; first row of a product carries all product fields, extra variant rows
   carry only `URL handle` + variant fields; one row per image (max 250); `Option1 name` = `Default Title`
   for single-variant products (up to 3 options); image URLs must be public; set `Status` to `draft` for the first
   import. Import with "overwrite products with matching handles" only when updating: blank cells overwrite
   existing values. `Inventory quantity` works only for a single-location store; with several locations use
   the inventory CSV. CSV cannot delete products. Run `python3 -c "import csv..."` to check column count per row.
5. **Collections**: manual (hand-picked) for campaigns, automated (rules by tag/type/vendor) for categories.
   Write the rules in `collections.md`; tags in the CSV must match.
6. **Inventory and locations**: one location per physical stock place; decide tracking per product.
7. **Shipping (Mexico)**: shipping profiles/zones, flat vs weight rates, free-shipping threshold, carrier
   apps. Rates, carriers and thresholds come from the person: `[NO DATA: shipping rates]`. Do not invent.
8. **Payments**: Shopify Payments is available in Mexico (needs an individual or company RFC, ID, and a
   Mexican SPEI-eligible bank account; payouts in MXN). OXXO needs identity verification, MXN, amounts 10-10,000.
   The person completes activation. Test with Shopify's test gateway/bogus orders, never real cards.
9. **Taxes/IVA**: Mexico falls under Manual Tax in Shopify's docs; decide with the accountant whether prices
   include IVA (store setting "include taxes in prices"). **Shopify does not issue CFDI natively
   `[UNVERIFIED: no native CFDI found in docs]`**: plan a CFDI app from the App Store (verify features, stamping cost,
   CFDI 4.0 support) or the accountant's process. Return policy and "facturación" instructions go in
   the footer/policies.
10. **Language and markets**: add Spanish, translate with the Translate & Adapt app or theme locales
    (`locales/es.json`); currency MXN. Exact es vs es-MX locale options `[UNVERIFIED]`: check the language settings in admin.
11. **Domain, apps, checkout**: connect the custom domain (the person buys/DNS); install only apps the person
    approves (each has a monthly fee: verify on the listing); checkout branding via admin
    Settings > Checkout (colors, logo) and checkout UI extensions only if needed.
12. **Launch checklist** -> `docs/shopify-launch-checklist.md`: password page removed by the person, test
    order end to end, policies linked, IVA/CFDI path, shipping rates tested for 3 postal codes, domain + SSL,
    analytics, Meta/Google channel decisions (hand to marketing), 301 redirects if moving a store, backup export of
    products CSV. Then `launch-checklist` and `seo-and-metadata` for the public site.

## Output format

`store/setup-steps.md` as a checkbox list with owner per step (Person / Agent), the CSV files, and a final
table: step - status - what is missing (`[NO DATA]`).

## Never

- Import CSV to a live store without the person approving a dry look at the file.
- Invent products, prices, sizes, policies, shipping rates or tax rules.
- Request or store payment, bank, RFC or ID data; activate payments; publish the store.
- Promise CFDI, IVA filing or accounting compliance.

## Why

Setup mistakes (wrong tax setting, bad CSV overwrite, untested shipping) surface as lost sales or
legal exposure after launch. Dry runs, drafts and the person's sign-off keep them reversible.

Sources (checked 2026-10-13): https://shopify.dev/docs/api/development-stores ;
https://help.shopify.com/en/manual/products/import-export/using-csv (header list, variant rules, overwrite) ;
https://help.shopify.com/en/manual/payments/shopify-payments/supported-countries/mexico/requirements ;
https://help.shopify.com/en/manual/payments/shopify-payments/local-payment-methods/oxxo ;
https://help.shopify.com/en/manual/taxes/tax-collection-and-reporting ;
https://help.shopify.com/en/manual/markets-new/languages/translate-store (page did not cover steps: `[UNVERIFIED]`). Shipping
zones, domain and policy-generator steps are `[UNVERIFIED]` (not fetched): follow admin prompts. Pricing: verify at https://www.shopify.com/mx/precios.
