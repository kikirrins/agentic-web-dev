<!-- Vendored and trimmed from emilkowalski/skills (MIT, (c) 2026 Emil Kowalski), commit 2d228630ba1446365f614a108cb8252f1feda202. See ../../THIRD-PARTY-NOTICES.md. -->
# Feeling native on a phone (web)

Fashion traffic is mostly phones. Most "feels janky on mobile" reports are a tap delay, a flash on tap or a hover state that will not let go,
not animation. Fixes are CSS or meta tags, gated by capability (never user-agent sniffing). Emulation cannot reproduce sticky hover, tap delay,
rubber-banding, safe areas or the keyboard: say which fixes you verified from code and which need a real phone.

| Symptom | Fix and reason |
|---|---|
| Hover stuck after tap | All `:hover` inside `@media (hover: hover) and (pointer: fine)` (Tailwind v4's `hover:` already does this). Give touch press feedback with `:active`. |
| Grey flash on tap | `html { -webkit-tap-highlight-color: transparent }` and give every tappable its own `:active`. |
| Wrong height | App shell `100dvh`; hero `min-height: 100svh`; avoid `100vh`. |
| Page zooms into an input | Inputs 16px minimum. Never `user-scalable=no` / `maximum-scale=1` (accessibility failure). Set `inputmode`, `type="email"/"tel"`, `enterkeyhint`. |
| Laggy tap | `touch-action: manipulation` on buttons/links; feedback on `:active`/`pointerdown`, not `click`. |
| Pull-to-refresh hijacks scroll | `overscroll-behavior: none` on `html, body`; `contain` on inner scrollers (cart drawer). Never `touchmove` + `preventDefault`. |
| Content under the notch | `viewport-fit=cover` in the viewport meta + `env(safe-area-inset-*, 0px)` padding on fixed headers, bottom bars, sheets. |
| Long-press selects button text | `user-select: none` + `-webkit-touch-callout: none` on controls only, never on `body`. |
| Carousel scrolls the page | Native `scroll-snap-type: x mandatory` first; else `touch-action: pan-y` on the track. |
| Status bar colour | One `theme-color` meta per `prefers-color-scheme`, matching the top of the page (Next.js: `viewport` export). |

Baseline before the first component: viewport `width=device-width, initial-scale=1, viewport-fit=cover`; the CSS above (tap highlight, 16px inputs,
`touch-action: manipulation`, hover gating, `overscroll-behavior`). Test landscape and with the keyboard open.
