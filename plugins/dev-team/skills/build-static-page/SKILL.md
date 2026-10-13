---
name: build-static-page
description: Turns a brief and design tokens into a working HTML/CSS/JS page - section structure, semantic HTML, CSS with tokens and mobile-first. Use it when a page needs to be built or restructured.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Build static page

> **Standalone mode:** if the `agentos_*` tools are not available (AgentOS not installed), skip every `agentos_*` call and any "virtual file"/Archivos step: write the document on disk inside the project folder (`<project>/...`) and tell the person its relative path.

## Procedure

1. **Inputs**: brief, `visual-direction.md`, `tokens.css`, real content. Whatever is missing is marked
   `[NO DATA: ...]` and reported; it is not invented.
2. **Section structure** according to the goal. For a local business: header with name and main
   action, value proposition, services, gallery/proof, about us, location and hours, contact/booking,
   footer. Remove whatever has no real content.
3. **Files**: `index.html`, `css/tokens.css`, `css/styles.css`, `js/main.js` (only if needed),
   `img/`. No build.
4. **Semantic HTML**: `header > nav`, `main`, one `section` per block with its heading, a single `h1`,
   `footer`; `lang="es-MX"`, `meta viewport`, `title` and `description`.
5. **CSS with tokens**: minimal reset, `box-sizing: border-box`, base styles for `body` and headings,
   then components with classes (simple BEM: `.card__title`). Mobile-first: base styles for 375px;
   extend with `@media (min-width: 48rem)` and `(min-width: 72rem)`. Use `grid`/`flex` and `clamp()`.
6. **Images**: `width` and `height`, useful `alt` (or `alt=""` if decorative), `loading="lazy"` except the
   first one.
7. **Verify**: `python3 -m http.server 8000`, open at 375 and 1280px, check the console has no errors.

## Output format

The site folder plus `SITE-README.md` (also written with `agentos_file_write` under `dev/<project>/` and the folder delivered with `agentos_task_deliver` `path`) with: files created, how to view it (the agent serves it and gives the URL; never a disk path for the person), `[NO DATA]` pending items,
verifications done (width, result).

Section example:

```html
<section id="services" aria-labelledby="services-title">
  <h2 id="services-title">Servicios</h2>
  <ul class="services">
    <li class="service"><h3>Corte y peinado</h3><p>[NO DATA: description and price]</p></li>
  </ul>
</section>
```

(The visible text of the page is in the person's language, here Spanish; ids, classes and file names stay in English.)

## Never

- A clickable `div` instead of `button`/`a`, inline styles, `!important`, loose color values.
- Lay out for desktop only and "adapt later".
- Text that is an image, or invented phone numbers/prices/reviews.

## Why

A semantic page built on tokens gets fixed, translated and redesigned by changing variables; one made
with loose values breaks when touched.
