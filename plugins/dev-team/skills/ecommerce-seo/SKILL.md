---
name: ecommerce-seo
description: Organic positioning for an online store on Shopify (Hydrogen/Oxygen or Next.js storefront) - technical SEO (meta per route, canonical, sitemap, robots, Product/Offer and LocalBusiness JSON-LD), product and collection content, Google Search Console, free listings in Google Shopping via Merchant Center, Google Business Profile per branch, and a monthly SEO review with real data. Use it with "quiero salir en Google", "posicionar mi tienda", "SEO", "Search Console", "Google Shopping", or when growth-analytics flags products nobody sees.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch
---

# E-commerce SEO

> **Standalone mode:** if the `agentos_*` tools are not available, work only on disk inside the store project and tell the person relative paths.

For a small store, organic traffic comes from four places. Work them in this order, because each one is cheaper than the next:
**1. Google Business Profile per branch** (people search "velas cerca de mí") → **2. free listings in Google Shopping** (Merchant Center) →
**3. product and collection pages that rank** → **4. content** (guides, gift ideas). For a general Next.js site use `seo-and-metadata`; this
skill is the store version.

## 1. Technical base (the agent does it; check with evidence)

Detect the stack (Hydrogen 2026-10+ library, legacy Hydrogen, or Next.js) and use its own meta mechanism — legacy Hydrogen: `getSeoMeta`
in each route's `meta` export; React Router: `meta` export; Next.js: Metadata API. Then:

- **Per route**: unique `<title>` (≤ 60 chars, "Product · Brand"), meta description (120–155 chars, with what it is + material/use + city if relevant),
  canonical **without** variant or tracking params, Open Graph image = product's first image.
- **Product page JSON-LD** `Product` with `name`, `image`, `description`, `sku`, `brand`, and `offers` (`price`, `priceCurrency: MXN`,
  `availability` from real stock: `InStock` / `OutOfStock`, `url`). One `Offer` per variant or an `AggregateOffer`. Reviews only if real.
- **Collections** as landing pages: an `h1` with the search intent ("Velas aromáticas de soya"), 80–150 words of real text, `BreadcrumbList`.
- **Home**: `Organization` + `WebSite`; each branch as `Store`/`LocalBusiness` with address and hours **only if the owner gave them**.
- **sitemap.xml** (home, collections, active products, pages) and **robots.txt** (block `/ops`, `/cart`, `/account`, search with params, `/api`).
  On Hydrogen/Oxygen these are routes (`sitemap[.]xml`, `robots[.]txt`); on Oxygen check them on the deployed URL, not only locally.
- **Speed and mobile**: `audit-performance` (LCP image with priority and dimensions, no layout shift). Lighthouse SEO ≥ 90 on home, a collection and a product.
- **Out of stock**: keep the page (it ranks), show "agotado" + "avísame", do not 404. Discontinued for good: 301 to the closest collection.
- `/ops` is never indexed and never in the sitemap.

## 2. The owner's accounts (she does them; you give one step at a time)

1. **Google Search Console**: add the domain (DNS verification at her domain provider) → submit `sitemap.xml`.
2. **Merchant Center** through Shopify's **Google & YouTube** app: the product feed syncs from Shopify; fix the disapprovals it lists (GTIN/brand,
   shipping and returns policy pages, prices that match the site).
3. **Google Business Profile**: one profile **per physical branch**, same name/address/phone as the site, hours, photos, and the link to the site
   (with `?utm_source=gbp&utm_medium=organic&utm_campaign=<branch>` so GA4 shows which branch profile sends visits).
4. Optional: Search Console API read access for the agent (same service account as `growth-analytics`, added as user in Search Console).

## 3. Content that ranks (proposals; the owner approves texts)

- **Keyword list** from real sources only: Search Console queries (once there is data), Google autocomplete and "People also ask", her customers'
  own words (WhatsApp, reviews). 1 main term per page. No volumes invented: if there is no tool with volumes, say so.
- **Product texts**: what it is, for whom, material, size/fit, care, shipping time; 120–250 words; unique per product (no manufacturer copy-paste).
  Alt text per image describing the photo.
- **One guide per month** tied to a collection ("Cómo elegir el aroma para cada cuarto", "Regalos para el Día de las Madres en Monterrey") linking to products.
- Spanish URLs, short, no accents: `/products/vela-lavanda`, `/collections/velas`.

## 4. Monthly SEO review (the store-manager runs it)

With Search Console (or GA4 `Organic Search` if Search Console is not connected): clicks, impressions, CTR and average position by page and
query, 28 days vs previous 28. Output `ops/reports/seo-<YYYY-MM>.md`: top 10 queries, pages with many impressions and low CTR (rewrite title/description),
products with stock and no organic traffic (from `growth-analytics` → `poca_visibilidad`), Merchant Center disapprovals, and **max 3 actions**.

## Never

- Promise rankings or dates ("primera página en un mes"). SEO takes months; say so.
- Invent reviews, ratings, addresses, hours or search volumes; mark structured data that cannot be filled as missing.
- Keyword-stuff, buy links, or create pages per city where there is no branch.
- Change prices, products or published texts without the owner's OK.

Sources (checked 2026-11-03): https://developers.google.com/search/docs/appearance/structured-data/product ;
https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview ; https://support.google.com/merchants ;
https://shopify.dev/docs/storefronts/hydrogen . Exact Hydrogen 2026-10 SEO helpers are `[UNVERIFIED]`: read the current docs for the installed version.
