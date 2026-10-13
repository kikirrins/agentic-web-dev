---
name: code-review
description: Reviews a site's HTML/CSS/JS and reports findings with severity and file:line - semantics, tokens, JS, broken links, basic security. Use it when the developer delivers or before approving changes.
allowed-tools: Read, Glob, Grep, Bash
---

# Code review

## Procedure

1. List the files: `find . -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' \) -not -path './node_modules/*'`.
2. **HTML**: `lang`, `title`, a single `h1`, semantics (`grep -n '<div[^>]*onclick'`), duplicate ids
   (`grep -oE 'id="[^"]+"' index.html | sort | uniq -d`), valid HTML (`npx html-validate *.html` if
   available).
3. **CSS**: loose values that should be tokens (`grep -nE '#[0-9a-fA-F]{3,6}' css/styles.css`),
   `!important`, `outline: none`, mobile-first (`max-width` in media queries indicates desktop-first), dead
   rules.
4. **JS**: console errors on load; `innerHTML` with user data; keys or secrets in the
   code (`grep -rniE 'api[_-]?key|secret|token' .`); external dependencies without need.
5. **Links/resources**: every local `href`/`src` path exists (`ls`); external ones with
   `curl -sI -o /dev/null -w "%{http_code}"`.
6. **Against the brief**: requested sections and content present; pending `[NO DATA]` markers
   (`grep -rn 'NO DATA' .`).
7. Order by severity: **critical** (the page does not work or exposes secrets), **high** (AA accessibility,
   broken link, mobile failure), **medium** (maintainability, loose values), **low** (style).

## Output format

```markdown
## Findings
- [high] index.html:57 - `<div onclick="open()">` should be `<button>`. Check: `grep -n 'onclick' index.html`.
- [medium] css/styles.css:112 - loose `#c2410c`; use `var(--color-accent)`.

VERDICT: CHANGES REQUIRED - 0 critical, 1 high, 1 medium.
Not verified: HTML validation (html-validate not installed).
```

## Never

- A finding without file:line or a way to verify it.
- Opine on design taste as if it were a failure.
- Approve if there are open criticals or highs.

## Why

A finding that cannot be reproduced gets argued over; one with a line and a command gets fixed.
