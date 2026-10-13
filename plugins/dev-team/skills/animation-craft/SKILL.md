---
name: animation-craft
description: Build, review and speed up UI motion with exact numbers (easing curves, durations, springs, transform-origin, reduced motion), using CSS first and the `motion` library when needed. Covers whether to animate at all, recipes (button press, popover, modal, drawer, toast, accordion, stagger, scroll reveal, drag), a ten-point review checklist, frame-budget performance rules and mobile-native touch fixes. Use when adding or fixing animation, when the person says the site should feel alive, when something is janky, or when web-qa reviews motion. Replaces the old web-animation skill.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

<!-- Vendored and trimmed from emilkowalski/skills (MIT, (c) 2026 Emil Kowalski), commit 2d228630ba1446365f614a108cb8252f1feda202; Motion guidance is ours. See ../../THIRD-PARTY-NOTICES.md. -->
# Animation craft

Motion communicates (what appeared, what changed); it does not decorate. Pick the style of motion from the
project's direction (`art-direction`: its `motion` signature), never from habit; a playful brand can bounce a
little, a calm one stays crisp. The numbers below are the floor for every direction.

Sibling files, load on demand: `RECIPES.md` (ready CSS/JS per component), `REVIEW.md` (ten standards, escalation
triggers, output table; web-qa uses it), `PERFORMANCE.md` (frame budget, diagnosis), `MOBILE.md` (touch/viewport fixes).

## Build sequence (in order; steps 1-2 can end with "do not animate")

1. **Should it animate?** 100+/day or keyboard-initiated: no animation. Tens/day (hover, list nav): barely
   perceptible. Occasional (modal, drawer, toast): standard. Rare or first time (onboarding, order placed):
   delight budget. Failing this gate is a valid result: say so and give the static alternative.
2. **Name the purpose**: feedback, spatial consistency, state indication, preventing a jarring change, explanation
   (marketing only) or delight (rare tier only). Cannot name it: do not build it. Data the user reads or acts on
   (prices, cart totals) never moves for style.
3. **Cheapest tool**: CSS transition (hover, press, state) > `@starting-style` (mount) > CSS animation (must stay
   smooth while the page loads) > WAAPI `element.animate()` > `motion` library (springs, layout and exit
   animations, gestures, scroll). No library for a fade.
4. **Properties**: `transform` and `opacity` only (`clip-path` is the sanctioned fourth; `height` only for accordions).
   Never `scale(0)`: start at `scale(0.95)` + opacity 0. Origin at the trigger for popovers/menus/tooltips
   (modals stay centered). Never `transition: all`. Never drive a child's transform from a parent CSS variable.
5. **Easing and duration** (tokens, extend the project's if present):
   `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` enter/exit, `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)` on-screen
   movement, `--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)` sheets, `linear` only for marquee/progress. Never
   `ease-in` on UI. Press 100-160ms, tooltip 125-200ms, dropdown 150-250ms, modal/drawer 200-500ms; UI under 300ms.
   Springs only for drag, interruptible gestures and "alive" things: `{ type: "spring", duration: 0.5, bounce: 0.2 }`
   (bounce 0.1-0.3).
6. **Interruption and exit**: transitions (not keyframes) for anything triggered rapidly; springs for gestures; exit the
   way it entered; slow on the deliberate phase, snappy on the system response. Stagger groups 30-80ms.
7. **Reduced motion and hover gating ship with the animation**: gentler (opacity/colour kept, travel removed), not zero;
   `:hover` motion inside `@media (hover: hover) and (pointer: fine)`.

## `motion` library in Next.js (our setup)

`pnpm add motion`; import from `motion/react`. Only the wrapper is a client component; the section stays server.
```tsx
'use client'
import { motion, MotionConfig, useReducedMotion } from 'motion/react'
// app-level provider: <MotionConfig reducedMotion="user">{children}</MotionConfig>
export function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay }}
    >{children}</motion.div>
  )
}
```
Wrap blocks, not words; fire once. Bundle size: `LazyMotion` with `m` components and `domAnimation` (check the
current motion.dev docs before relying on the exact API). Shared transitions (product image to detail, cart
drawer): `layoutId`, but under load prefer CSS or WAAPI (see PERFORMANCE.md). Motion's `x`/`y`/`scale` shorthands are
not hardware accelerated: use the full `transform` string when the page is busy.

## Vocabulary (a non-technical person describes motion)

"bouncy when it opens" = spring on a popover/drawer (keep bounce <= 0.2); "slides up from below" = drawer/toast
`translateY`; "fades in as I scroll" = scroll reveal (once, marketing only); "grows when I press" = button press
`scale(0.97)`; "list appears one by one" = stagger 30-80ms; "smooth morph between two views" = `layoutId` or clip-path.
Confirm the reading in one line before building.

## Output

Reusable pieces in `src/components/animation/`; a note listing each animation with its gate result (frequency tier,
purpose), ingredients (tool, properties, curve, duration) and what needs a feel-check (play at 2-5x duration or in the
DevTools Animations panel; real phone for gestures). Evidence of reduced motion: `visual-verification` (emulate
`prefers-reduced-motion: reduce`).

## Never

- `transition: all`; `scale(0)` entrances; `ease-in`; animation on keyboard shortcuts; UI motion over 300ms without a reason.
- Content that stays invisible if JS fails; flashing; heavy parallax or autoplay video unless the person sees the cost.
- Ungated hover motion; missing reduced-motion handling; infinite animations without a pause.
- Approximated curves: take values from this skill or from easing.dev, never invent them.

## Why

Specific numbers are what separate motion that feels right from motion that merely runs. A 180ms dropdown feels more
responsive than a 400ms one, and one authored moment per page beats ten effects at once.
