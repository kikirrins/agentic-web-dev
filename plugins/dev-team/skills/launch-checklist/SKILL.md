---
name: launch-checklist
description: Verification list before publishing a site - metadata, favicon, 404 page, forms, analytics, domain and HTTPS. Use it as the last step before delivering or deploying.
allowed-tools: Read, Glob, Grep, Bash
---

# Launch checklist

## Procedure

Run each item and mark OK / MISSING / N/A with its evidence.

1. **Metadata**: unique `title` (under 60 characters), `meta description` (under 160),
   `lang`, `canonical` if there is a domain. `grep -n -E '<title|name="description"|canonical' *.html`.
2. **Social**: `og:title`, `og:description`, `og:image` (1200x630) for sharing on WhatsApp/Instagram.
3. **Favicon**: exists and is linked (`grep -n 'rel="icon"' *.html`; `ls favicon*`).
4. **404**: `404.html` exists and links to the home page (Netlify, Cloudflare Pages and GitHub Pages use it).
5. **Forms**: where do they send to? A static site needs a service (Formspree, Netlify
   Forms) or `mailto:`/WhatsApp; test a real submission and confirm it arrives. No data on the destination: ask.
6. **Analytics and privacy**: only if the person wants it; if there are cookies or tracking, a privacy
   notice. Otherwise, N/A.
7. **Content**: `grep -rn 'NO DATA\|lorem\|TODO' .` must come back empty; phone, address and hours
   confirmed by the person.
8. **Links and resources**: none broken (`code-review` item 5), no references to `localhost`.
9. **Domain and HTTPS**: the domain points to the hosting (`dig +short domain.com`), HTTPS active
   (`curl -sI https://domain.com | head -1`), `www` redirects to a single version.
10. **Final review**: `web-qa` report with no criticals or highs; `robots.txt`/`sitemap.xml` if applicable.

## Output format

```markdown
| # | Item | Status | Evidence |
|---|---|---|---|
| 3 | Favicon | MISSING | `ls favicon*` with no results |
| 5 | Form | MISSING | action="" - no destination; ask the student |

READY TO PUBLISH: NO - 2 missing. From the person: domain, form destination.
```

## Never

- Publish or buy hosting/domain: the person does that with your steps.
- Mark OK a form submission you did not test.
- Leave filler text, sample phone numbers or `localhost`.

## Why

The failures most noticeable at launch (no favicon, a dead form, a broken preview on WhatsApp) are
easy to verify and embarrassing to discover in public.
