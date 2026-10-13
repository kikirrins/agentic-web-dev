---
name: seo-and-metadata
description: Gets a Next.js site ready for search engines and for sharing - per-page metadata, Open Graph, sitemap, robots, structured data (local business and product) and a content checklist. Use it before launch or when asked for the site to "show up on Google".
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# SEO and metadata

> **Standalone mode:** if the `agentos_*` tools are not available (AgentOS not installed), skip every `agentos_*` call and any "virtual file"/Archivos step: write the document on disk inside the project folder (`<project>/...`) and tell the person its relative path.

## Procedure

1. **Base metadata** in `src/app/layout.tsx` and per page with the Metadata API:
   ```ts
   export const metadata: Metadata = {
     metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
     title: { default: 'Name — what you do in 5 words', template: '%s · Name' },
     description: 'A sentence of 120-155 characters with what you offer and where.',
     openGraph: { type: 'website', locale: 'es_MX', siteName: 'Name' },
   }
   ```
   Dynamic pages (product): `generateMetadata({ params })` with the product's real title and description.
2. **Sitemap and robots**: `src/app/sitemap.ts` (home, pages, active products from the database) and
   `src/app/robots.ts` (allow everything, point to the sitemap; block `/admin` and `/api`).
3. **Sharing image**: `src/app/opengraph-image.tsx` with `ImageResponse` (1200×630) or an `opengraph-image.png`.
4. **Structured data** (JSON-LD in a `<script type="application/ld+json">`): `LocalBusiness` with name,
   address, hours and phone **only if the person provided them**; `Product` with `offers` in a store.
5. **Content**: a single `h1` with the search intent, headings in order, texts with words that people
   use (service name + city), descriptive `alt`, short URLs in Spanish without accents (`/tienda/vela-lavanda`).
6. **Technical**: `lang="es-MX"`, canonical per page, `next/image` with dimensions, no broken links,
   `pnpm build` without warnings. Check with Lighthouse (SEO ≥ 90) and share the URL in a preview validator.
7. **Google Business Profile** and Search Console: steps the person executes; you deliver the list.

## Output format

`docs/SEO.md`: title and description of each page, URLs, structured data used, measured Lighthouse
SEO score and the person's pending items (verify the domain in Search Console, business profile). Also write it with `agentos_file_write` as `dev/<project>/docs/SEO.md`.

## Never

- Promise Google rankings or invent reviews, ratings or addresses in structured data.
- Duplicate the same title/description on every page, or stuff with keywords.
- Index test environments (use `noindex` outside production).

## Why

Search engines and previews read the same metadata that you write: done well, every shared link
and every search result looks like a serious brand.
