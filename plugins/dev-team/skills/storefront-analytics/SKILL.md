---
name: storefront-analytics
description: Installs and verifies the telemetry of a Shopify headless storefront (Hydrogen on Oxygen, or Next.js) - Shopify analytics, GA4, Meta Pixel + Conversions API, Microsoft Clarity, consent banner and CSP - so every visit, product view, add-to-cart and purchase is measured and can be joined to Shopify orders. Use it with "pon Google Analytics", "instala el pixel", "quiero saber cómo navegan", "telemetría", "mapa de calor", or before running ads.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch
---

# Storefront analytics

> **Standalone mode:** if the `agentos_*` tools are not available, work only on disk inside the store project and tell the person relative paths.

Goal: one funnel the owner can trust, **visit → product view → add to cart → checkout → order**, where the last step is the **same order ID**
in GA4, Meta and Shopify. Everything else is decoration.

## The map (who measures what)

| Where | What happens | Who measures it |
|---|---|---|
| Storefront (her site: Hydrogen or Next.js) | visits, product/collection views, search, cart | Shopify analytics (built into Hydrogen) + GA4 + Meta Pixel + Clarity, all behind consent |
| Shopify checkout (Shopify's domain) | checkout started, payment, **purchase** | Shopify's Customer events: the **Google & YouTube** and **Facebook & Instagram** app pixels, or a custom pixel |
| Shopify admin (server) | the real order, refunds, stock | Admin API (the store-manager's snapshot) and, for Meta, the Conversions API of the Facebook & Instagram app |

The purchase is **not** measured on her site: the customer is on Shopify's checkout. Do not fire `purchase` from the storefront.

## 0. Detect the stack first

- `package.json` has `@shopify/hydrogen` at **2026-10 or newer** (library: `ShopifyScripts`, `window.Shopify.analytics`) → section 2A.
- Legacy Hydrogen (2026-04 or older: `Analytics.Provider`, `app/root.tsx`, `entry.server.tsx` with `createContentSecurityPolicy`) → section 2B.
- Next.js + Storefront API (agentic-shop template) → section 2C.
Say which one it is in one line before touching anything. Read the current shopify.dev page for that version; it changed in Oct 2026.

## 1. Accounts (the owner creates them; you guide one step at a time)

1. **GA4**: analytics.google.com → property (zona horaria México, moneda MXN) → web data stream with her domain → `G-XXXXXXX` (Measurement ID; public, not a secret).
2. **Google & YouTube app** in her Shopify admin → connect the same GA4 property and Google Merchant Center (free listings). This sends checkout and purchase events.
3. **Meta**: Business Manager → Events Manager → dataset/pixel → Pixel ID (public). **Facebook & Instagram app** in Shopify → connect the same
   pixel with data sharing "Maximum" (enables the Conversions API from Shopify's server).
4. **Microsoft Clarity** (free): clarity.microsoft.com → project → Project ID (public). Heatmaps and session recordings; masks form fields by default.
5. **Customer privacy**: Shopify admin → Settings → Customer privacy → cookie banner on, regions as needed. In Mexico the owner also needs a
   privacy notice (aviso de privacidad, LFPDPPP) linked in the footer: draft it and tell her to validate it with her lawyer.

IDs go to env vars: `PUBLIC_GA4_ID`, `PUBLIC_META_PIXEL_ID`, `PUBLIC_CLARITY_ID` (Next.js: `NEXT_PUBLIC_*`). Locally in `.env` / `.env.local`;
on Oxygen in Shopify admin → Hydrogen → the storefront → Storefront settings → Environments and variables (the owner pastes them; mark
secrets as secret). Never hard-code IDs in components and never ask for tokens in chat.

## 2A. Hydrogen 2026-10+ (library)

- Analytics live on `window.Shopify.analytics`. Render `ShopifyScripts` (React: `@shopify/hydrogen/react`) in the head with `consent={{ mode: 'default-banner' }}`
  unless she already has her own banner. Product events need `id, title, price, vendor, variantId, variantTitle, quantity`; cart events come from
  `useCartAnalytics()` / `trackCartAnalytics(cart)` — never publish `product_added_to_cart` yourself.
- One destination per tool with `analytics.addDestination({ name, setup })`, registered **once per page** (re-adding replays up to 500 events → duplicates).
  Inside `setup()` only subscribe; load the vendor script and set cookies **after consent** (setup itself is not consent-gated).
- Event mapping:

| Shopify event | GA4 (`gtag('event', …)`) | Meta (`fbq('track', …)`) |
|---|---|---|
| `page_viewed` | `page_view` | `PageView` |
| `product_viewed` | `view_item` (items: item_id = **SKU**, item_name, item_variant, price, currency MXN) | `ViewContent` (content_ids = SKU) |
| `collection_viewed` | `view_item_list` | — |
| `search_viewed` | `search` (search_term) | `Search` |
| `product_added_to_cart` | `add_to_cart` | `AddToCart` |
| `cart_viewed` | `view_cart` | — |
| checkout / purchase | **from the app pixels in checkout**, not here | same |

- Use the **SKU** as `item_id` everywhere: it is the key the store-manager uses to join GA4 with Shopify inventory and sales.
- Shopify's own destination: verify a `produce_batch` request to `monorail-edge.shopifysvc.com` in the Network tab (Lighthouse traffic is skipped on purpose).

## 2B. Legacy Hydrogen (2026-04 and earlier)

`Analytics.Provider` in `root.tsx` with `shop={getShopAnalytics(...)}` and `consent`; `Analytics.ProductView` / `CollectionView` / `SearchView` /
`CartView` per route; a custom component with `useAnalytics()` → `register('ga4')`, `subscribe(event, cb)`, `ready()`. CSP in
`entry.server.tsx` (`createContentSecurityPolicy`): add the domains below. If the site will live long, propose the migration skill
`migrate-to-hydrogen-2026-10` (Shopify/hydrogen repo) as a separate task; do not migrate in the middle of a telemetry job.

## 2C. Next.js storefront

`@next/third-parties/google` (`GoogleAnalytics`) or `next/script` with `afterInteractive`, gated by a consent state; events from the cart and
product components with the same mapping and SKU as `item_id`.

## 3. CSP (Content-Security-Policy) domains

`script-src`: `cdn.shopify.com`, `*.googletagmanager.com`, `connect.facebook.net`, `www.clarity.ms`, `scripts.clarity.ms`.
`connect-src`: `*.google-analytics.com`, `*.analytics.google.com`, `*.googletagmanager.com`, `www.facebook.com`, `*.clarity.ms`, `monorail-edge.shopifysvc.com`.
`img-src`: `*.google-analytics.com`, `*.googletagmanager.com`, `www.facebook.com`, `*.clarity.ms`.
If the CSP blocks `cdn.shopify.com`, the Customer Privacy script never loads and **no** destination receives events.
(GTM domains from Shopify's GTM cookbook; Meta and Clarity domains `[UNVERIFIED]`: confirm in the browser console, a CSP violation names the exact host.)

## 4. Verify (with evidence, before saying "listo")

1. Browser with consent **rejected**: no requests to Google, Meta or Clarity. Accepted: requests appear.
2. GA4 → Admin → DebugView (or Realtime): `page_view`, `view_item`, `add_to_cart` with `item_id` = SKU.
3. Meta Events Manager → Test events: `PageView`, `ViewContent`, `AddToCart`; after a test purchase, `Purchase` with "Browser and Server" and deduplicated.
4. Clarity dashboard shows the session (can take ~2 h).
5. Test purchase (Bogus Gateway on the dev store): the order number in Shopify = `transaction_id` in GA4 (Realtime or next-day reports).
Write `docs/telemetria.md`: IDs (public), where each is configured, what was verified, screenshots, and what is pending.

## Datadog and other APM tools

Datadog RUM / Sentry are for engineering teams (errors, performance, paid per session). For a small store, Clarity answers "how do they
navigate" and Shopify + GA4 answer "how much they buy". Propose Datadog only if there is a developer who will watch it.

## Never

- Load any tracker before consent, or send personal data (email, phone, name) to GA4 or Clarity.
- Fire `purchase` from the storefront (double counting with the checkout pixels).
- Put a secret (Admin token, Conversions API token) in a `PUBLIC_*` variable or in the browser.

Sources (checked 2026-11-03): https://shopify.dev/docs/storefronts/hydrogen/analytics ;
https://shopify.dev/changelog/blog/hydrogen-2026-10-is-now-available ;
https://shopify.dev/docs/storefronts/headless/legacy/hydrogen/analytics/tracking ;
https://shopify.dev/docs/storefronts/headless/hydrogen/cookbook/gtm ;
https://shopify.dev/docs/api/web-pixels-api/standard-events/checkout_completed .
