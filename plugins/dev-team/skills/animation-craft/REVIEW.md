<!-- Vendored and trimmed from emilkowalski/skills (MIT, (c) 2026 Emil Kowalski), commit 2d228630ba1446365f614a108cb8252f1feda202. See ../../THIRD-PARTY-NOTICES.md. -->
# Animation review checklist (web-qa)

Review motion against a high bar. Default to flagging; approval is earned. Review only what exists in the project:
the standards below are measurable, personal taste is not a finding. Cite `file:line` and the exact value from this file.

## Ten standards (a violation is a finding)

1. **Justified**: every animation answers why (spatial consistency, state, feedback, explanation, preventing a jarring change). "Looks cool" on a frequently seen element: block.
2. **Frequency-appropriate**: none on keyboard-initiated or 100+/day actions; reduced on tens/day; standard on occasional; delight only rare/first-time.
3. **Responsive easing**: enter/exit use `ease-out` or a strong custom curve; `ease-in` on UI is a block; built-in CSS easings are too weak on deliberate motion.
4. **Under 300ms** for UI (press 100-160, tooltip 125-200, dropdown 150-250, modal/drawer 200-500); slower needs a stated reason.
5. **Origin and physicality**: popovers/menus/tooltips scale from the trigger (`transform-origin`), never `scale(0)` (use 0.9-0.97 + opacity); modals stay centered.
6. **Interruptible**: rapid or gesture-driven motion uses transitions or springs, not keyframes that restart from zero.
7. **GPU-only**: `transform` and `opacity` (clip-path allowed); no `width/height/margin/padding/top/left`; Motion `x/y/scale` shorthands only when the page is idle.
8. **Accessibility**: `prefers-reduced-motion` handled (gentler, not zero); hover motion gated by `@media (hover: hover) and (pointer: fine)`.
9. **Asymmetric**: deliberate phases (press, hold, destructive confirm) slower; system responses snap.
10. **Cohesion**: motion matches the project's direction and the rest of the product; a jarring crossfade can be bridged with `filter: blur(2px)` (under 20px). When unsure, deleting it is the strongest move.

## Escalation triggers (flag on sight)

`transition: all`; `scale(0)` or fade-only entrances with no initial transform; `ease-in` on UI; animation on keyboard/100+-per-day
actions; UI duration over 300ms without reason; `transform-origin: center` on trigger-anchored popovers; keyframes on toasts/toggles;
animating layout properties; parent CSS variable driving a child transform; missing reduced-motion; ungated `:hover` motion;
symmetric timing on press-and-release; everything entering at once where a 30-80ms stagger belongs; content invisible until JS runs.

## Preferred fix order

1 delete it, 2 reduce it (shorter, smaller, fewer properties), 3 fix easing, 4 fix origin/physicality, 5 make interruptible,
6 move to GPU properties or WAAPI, 7 asymmetric timing, 8 polish (blur mask, stagger, `@starting-style`, spring), 9 reduced motion + hover gating + cohesion.

## Numbers to cite

- Curves: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`, `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)`, `--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)`.
- Springs: `{ type: "spring", duration: 0.5, bounce: 0.2 }` or `{ mass: 1, stiffness: 100, damping: 10 }`; bounce 0.1-0.3.
- Press: `scale(0.97)` (0.95-0.98) on `:active`, 160ms ease-out. Tooltip after the first: instant. Stagger 30-80ms.
- Reduced motion: `@media (prefers-reduced-motion: reduce) { .el { animation: fade 0.2s ease; } }` keeps opacity/colour, drops travel. In motion: `<MotionConfig reducedMotion="user">`.
- Gestures: dismiss on velocity (distance / elapsed ms > ~0.11), pointer capture, ignore extra touches, damping past edges.
- Debug: slow to 2-5x duration or use the DevTools Animations panel; real device for gestures; look again the next day.

## Output (qa-report.md section "Animation")

Part 1, a findings table (never a before/after list):

| Before (file:line) | After | Why |
|---|---|---|
| `transition: all 300ms` (Card.tsx:12) | `transition: transform 200ms var(--ease-out)` | Name exact properties; `all` animates off the GPU |

Part 2, verdict grouped by tier, highest first (omit empty tiers): feel-breaking regressions, missed simplifications,
performance, interruptibility and timing, origin/physicality/cohesion, accessibility. Close with **Block** (any feel-breaking
regression, animation on a high-frequency action, `scale(0)`/`ease-in` on UI, a non-GPU animation with an easy fix) or **Approve**.
Mark what was verified by reading code vs by emulation (`visual-verification`) vs not verified (needs a phone).
