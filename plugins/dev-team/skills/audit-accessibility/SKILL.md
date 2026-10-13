---
name: audit-accessibility
description: Verifiable WCAG 2.1 AA checklist for a website - contrast, focus, alt, labels, heading hierarchy, keyboard. Use it when reviewing a page before delivering it or when an accessibility problem is suspected.
allowed-tools: Read, Glob, Grep, Bash
---

# Audit accessibility

## Procedure (each item with its check)

1. **Language**: `grep -n '<html' *.html` must return `lang="es"` or `es-MX`.
2. **Headings**: `grep -nE '<h[1-6]' index.html`; a single `h1`, no skipped levels (h2 to h4 is a failure).
3. **Images**: `grep -n '<img' *.html` and check that all have `alt`; decorative ones with `alt=""`. An
   `alt` like "image1.jpg" is a failure.
4. **Forms**: every `input/select/textarea` with `<label for>` or `aria-label`; the placeholder does not
   replace the label. Errors in text, not only in color.
5. **Contrast**: 4.5:1 normal text, 3:1 large text (18px+ or 14px bold) and control borders. Measure with
   DevTools (color picker) or calculate with the WCAG formula; write down both colors and the ratio.
6. **Keyboard**: go through with Tab (or Playwright `press Tab`): logical order, focus always visible
   (`grep -n 'outline' css/*.css` looks for `outline: none` without a replacement), no traps, menu operable with
   Enter/Esc.
7. **Links and buttons**: text that makes sense ("Book an appointment", not "click here"); touch targets of
   at least 44px.
8. **Reflow and zoom**: at 375px and with 200% zoom there is no horizontal scroll or cut-off text;
   `meta viewport` without `user-scalable=no`.
9. **Motion**: animations under `prefers-reduced-motion`; nothing flashes more than 3 times per second.
10. Whatever you cannot verify (a real screen reader) goes as "not verified".

## Output format

```markdown
| # | WCAG criterion | Result | Evidence (file:line / command) | Severity |
|---|---|---|---|---|
| 1 | 1.1.1 Alt | FAIL | index.html:42 `<img src="a.jpg">` without alt | high |
| 2 | 1.4.3 Contrast | FAIL | .button: #fff on #f4a261 = 2.1:1 (min. 4.5) | high |
| 3 | 2.4.7 Focus visible | PASS | css/styles.css:30 `:focus-visible` defined | - |

VERDICT: CHANGES REQUIRED - 2 high failures. Not verified: screen reader.
```

## Never

- Mark PASS without evidence, or give a tool score you did not run.
- Approve with contrast below 4.5:1 "because it looks fine".
- Fix the code yourself: report.

## Why

A site that cannot be used with a keyboard or with low vision excludes real clients; in addition, AA failures
are the ones detected most easily.
