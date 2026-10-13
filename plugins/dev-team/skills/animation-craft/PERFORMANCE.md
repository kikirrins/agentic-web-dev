<!-- Vendored and trimmed from emilkowalski/skills (MIT, (c) 2026 Emil Kowalski), commit 2d228630ba1446365f614a108cb8252f1feda202. See ../../THIRD-PARTY-NOTICES.md. -->
# Animation performance

Goal: each frame finishes in time. Budget 16.7ms at 60Hz and 8ms at 120Hz; design for the smaller number. The developer's laptop is
the least representative device. Name the cause before changing code; never conclude "fine" from a fast machine.

## Symptom table

| Problem | Fix |
|---|---|
| Stutters | Animate `transform`/`opacity`, not `width/height/top/margin` |
| Shadow animation choppy | `filter: drop-shadow()` |
| Jank only during navigation/loading | Move to CSS or WAAPI (off the main thread) |
| Motion `x`/`y` drops frames | Animate the full `transform` string |
| Hand-rolled animation in React drops frames | Write `ref.current.style.transform`, not state; or a motion value |
| Drag gets laggier as the list grows | Stop animating an inherited CSS variable; set `transform` on the element |
| Blur transition lags (Safari) | Keep animated `blur()` under 20px (2-5px is enough) |
| Unexpected properties animate | Replace `transition: all` with explicit properties |
| Element shifts 1px at start/end | `will-change: transform`, only once seen |

## Cost tiers

Composite only: `transform`, `opacity` (and, uneven support, `filter`, `clip-path`, `background-color`). Paint + composite: `box-shadow`,
`border-radius`, `color`. Layout + paint + composite: `width`, `height`, `padding`, `margin`, `top`, `left`, `border-width`.
Swap down a tier: grow/shrink with `scale()`, move with `translate()` (percentages relate to own size), show/hide with `opacity`.

## Where it runs

rAF-driven JS (`motion/react` components, GSAP) runs on the main thread. CSS transitions/keyframes and WAAPI can be hardware-accelerated.
Use CSS for predetermined motion and anything that plays while the page is busy (page transitions, tab indicators during
navigation, hydration); the `motion` library for springs, layout and exit animations, momentum gestures. Acceleration is progressive
enhancement: percentage transforms are still right for unknown sizes.

## Diagnosis order

1 which properties animate; 2 does jank coincide with a busy page; 3 React re-rendering per frame (state in rAF/pointermove/scroll);
4 worse as content grows (inherited CSS variable, too many nodes); 5 any animated CSS variable (including Motion shorthands);
6 blur above 20px; 7 only then `will-change: transform` on the animating element (never on `*` or big containers).
Confirm with a recording (DevTools Performance and Animations panels), not by feel. Verify on a mid-range phone when possible;
if not, say "not verified on a device". Also check LCP/CLS do not get worse (reserve space for what appears) and animate fewer than ~10 elements at once.

## Report format per finding

Element `file:line` · Cause (from the order above) · Before · After · Verified: from code / by emulation / needs a device.
