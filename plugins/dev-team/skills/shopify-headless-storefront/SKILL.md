---
name: shopify-headless-storefront
description: Builds a headless storefront on Shopify - Next.js (our stack) with the Storefront API, or Hydrogen on Oxygen - covering tokens, product/collection/cart queries, checkout redirect, caching, SEO and images. Use it when shopify-choose-approach selected option B or C, or when a Next.js brand site must show/sell Shopify products.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch
---

# Shopify headless storefront

Shopify stays the backend (catalog, inventory, cart, checkout, taxes, payments); we build only the frontend.
Checkout is **always Shopify's hosted checkout**: the cart returns a `checkoutUrl` and the buyer is redirected to it.
Never build your own payment form for a Shopify store.

## Procedure

1. **Confirm the approach** (`shopify-choose-approach`): B = Next.js here; C = Hydrogen (below). Headless needs a developer to
   maintain it, so say that in the README.
2. **Tokens**: the Storefront API endpoint is `https://<store>.myshopify.com/api/2026-10/graphql.json` (confirm the version at
   https://shopify.dev/docs/api/usage/versioning). Three modes: tokenless (products, collections, search, cart; query complexity max 1,000),
   **public token** (header `X-Shopify-Storefront-Access-Token`, safe in browsers), **private token** (header
   `Shopify-Storefront-Private-Token`, server only; needed for metaobjects/metafields, menus, customers, product tags).
   Get them by adding the **Headless channel** in the Shopify admin (the person does this). Store as
   `.env.local`: `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_PRIVATE_TOKEN`, `NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLIC_TOKEN`.
3. **Client** in `src/lib/shopify.ts`: one `storefront(query, variables)` function using `fetch` on the server (Server Components /
   route handlers), version constant, `userErrors` handling, and the `Shopify-Storefront-Buyer-IP` header (case-sensitive) forwarded from the
   request on server-side calls triggered by buyers (avoids throttling). Typed with generated types only if the person agrees to a codegen dependency.
4. **Queries (minimal, verify field names in the Storefront reference)**:
   - products: `products(first: 12) { nodes { id title handle featuredImage { url altText width height } priceRange { minVariantPrice { amount currencyCode } } } }`
   - one product: `product(handle: $handle) { id title descriptionHtml variants(first: 50) { nodes { id title availableForSale price { amount currencyCode } } } }`
   - cart: `cartCreate(input: { lines: [{ merchandiseId: $variantId, quantity: 1 }] }) { cart { id checkoutUrl } userErrors { message } warnings { message } }`,
     then `cartLinesAdd` / `cartLinesUpdate`. Keep only the cart `id` in a cookie; the checkout button is a link to `checkoutUrl`.
5. **Localization**: use `@inContext(country: MX, language: ES)` on queries so prices and translations come in MXN/Spanish
   (needs the market and language configured in admin: `shopify-store-setup`).
6. **Caching**: product and collection pages are cacheable (ISR / `use cache` with tags; see `vercel:next-cache-components` guidance if loaded);
   never cache cart or personalized responses; revalidate on a Shopify `products/update` webhook (verify HMAC, see
   `shopify-admin-api-automation`).
7. **SEO and images**: `seo-and-metadata` (Product JSON-LD with price/availability from the API, canonical on `/products/<handle>`,
   sitemap from collections); keep Shopify's standard URL shape `/products/:handle` (Hydrogen docs recommend it, with a 3xx
   redirect if different) and support cart permalinks. Images: use Shopify CDN URLs with `next/image` and `width`/`height` from the API;
   check `remotePatterns` for `cdn.shopify.com`.
8. **UI**: follow `modern-ui` and the designer's tokens; accessible cart drawer; states for loading, empty, out of stock.
9. **Hydrogen/Oxygen (option C)**: `npm create @shopify/hydrogen@latest -- --quickstart`, `shopify hydrogen dev` (uses mock.shop data
   until linked), `shopify hydrogen link`, `shopify hydrogen env pull`, `shopify hydrogen deploy` (select Preview). Hydrogen is a
   React Router app; Oxygen is Shopify's edge hosting, free on paid plans, **not on dev stores**, and a worker-based runtime
   (no full Node APIs, 10 MB worker limit). Prefer Hydrogen over Next.js when the owner wants Shopify-managed hosting/deploys, built-in
   cart/analytics/SEO components and Shopify's `Hydrogen channel`; prefer Next.js when the site is already ours or content/marketing
   pages dominate. Deployment of Next.js: `deploy-vercel` (the person executes).
10. **Verify**: run `pnpm lint && pnpm build`; test a real flow against a dev store: browse, add to cart, reach `checkoutUrl` with a test order.

## Output format

`docs/HEADLESS-README.md` (env var names, queries used, cache/revalidation rules, how to add a field, what the person must configure in admin).

## Never

- Put the private token in client code or `NEXT_PUBLIC_*`; hardcode prices; compute totals in the browser.
- Build a custom checkout or take card data; scrape the store instead of using the API.
- Proxy in front of an Oxygen deployment (Shopify warns it breaks bot mitigation and SEO).

## Why

Headless doubles the surface to maintain (frontend, API versions, caching). Keeping checkout, prices and stock on Shopify's side removes
the dangerous part (money) and leaves us only the part we are good at (the experience).

Sources (checked 2026-10-13): https://shopify.dev/docs/api/storefront (endpoint, tokens, buyer IP, @inContext) ;
https://shopify.dev/docs/api/storefront/latest/mutations/cartCreate (cart, checkoutUrl, userErrors, warnings) ;
https://shopify.dev/docs/storefronts/headless ; https://shopify.dev/docs/storefronts/headless/hydrogen/getting-started ;
https://shopify.dev/docs/storefronts/headless/hydrogen/fundamentals. `[UNVERIFIED]`: exact Storefront query field lists above are from
the standard schema, not fetched this session: confirm each in the reference before shipping.
