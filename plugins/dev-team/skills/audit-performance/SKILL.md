---
name: audit-performance
description: Measures the performance of a static site - image weight, fonts, CLS/LCP and number of requests - without external services. Use it before publishing or when the site feels slow.
allowed-tools: Read, Glob, Grep, Bash
---

# Audit performance

## Procedure

1. **Total weight and by type**: `du -sh .`; `find . -type f \( -name '*.jpg' -o -name '*.png' -o -name '*.webp' \) -exec du -k {} + | sort -rn | head`.
   Reference: each content image under 200 KB, the hero under 300 KB, total initial page under 1.5 MB.
2. **Dimensions**: compare the real size (`sips -g pixelWidth -g pixelHeight img/x.jpg` on macOS or
   `identify`) with the maximum width at which it is displayed; a 4000px image displayed at 800px is a failure.
   Formats: prefer WebP/AVIF for photos and SVG for logos.
3. **Image loading**: `grep -n '<img' *.html`; all with `width`/`height` (avoids CLS),
   `loading="lazy"` except the one in the first screenful (that one carries `fetchpriority="high"`).
4. **Fonts**: at most 2 families and 3-4 weights; `font-display: swap`; `preconnect` to Google Fonts or
   better, self-host in WOFF2. `grep -n 'font' css/*.css *.html`.
5. **CSS/JS**: `wc -c css/*.css js/*.js`; no whole libraries for a single function; `script` with `defer`.
6. **Requests**: count external `href`/`src` with `grep -oE '(href|src)="http[^"]+"' *.html`.
7. **Real metrics (if there is a browser)**: `npx lighthouse http://localhost:8000 --only-categories=performance --quiet --chrome-flags="--headless"`
   or the DevTools Performance panel. Targets: LCP under 2.5 s, CLS under 0.1, INP under
   200 ms. Run 3 times and report the worst. Without a browser: report only 1-6 and mark the metrics "not measured".
8. Test with a slow network (the "Fast 3G" throttling in DevTools) for the first screenful.

## Output format

```markdown
| Finding | Measured | Target | File / command | Severity |
|---|---|---|---|---|
| Uncompressed hero | 2.4 MB | under 300 KB | img/hero.jpg (`du -k`) | high |
| Images without width/height | 5 of 7 | 0 | index.html:60-110 | medium |

Lighthouse metrics: not measured (no Chrome). Estimated initial weight: 3.1 MB.
```

## Never

- Invent a score or "estimate" LCP without measuring it.
- Optimize blindly: measure first, then recommend, and measure again.
- Recommend converting to Next.js "for performance" on a static site.

## Why

On mobile with limited data, heavy images are almost always the problem; measuring them takes a
minute and avoids fixing what was not broken.
