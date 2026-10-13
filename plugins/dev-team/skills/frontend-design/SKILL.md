---
name: frontend-design
description: Process for choosing an aesthetic direction and turning it into a system of CSS tokens (color, typography, spacing, radii), hierarchy and composition, avoiding the generic AI-template look. Use it when starting the design of any site or when critiquing an existing one, before writing HTML.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Frontend design

**There is no house style and no base style.** Every project is different. Directions, palettes and type systems from `art-direction` are a library of
options to choose from per brief, never a default look. Never reuse the previous project's palette, fonts or layout unless the person asks for it. The person's
own brand assets and Figma files win over any library (`design-references`). Examples below (names, hex values, fonts) are illustrations, not suggestions.

## Procedure

1. **Visual brief.** Ask for references first: 2 sites that are liked and 1 that is not, 3 adjectives for the desired feeling, brand assets (logo, colours,
   fonts, Figma) and what real photography exists. Without this, ask; do not guess. Run `design-references` if the person brings Figma, a DESIGN.md or a Claude Design bundle.
2. **Propose 2-3 candidate directions from different families** with the skill `art-direction` (library of 20 directions, 56 palettes, 44 type systems; filter by sector
   and tone, never the first one you think of). Pick one with 3 written criteria against the brief and record why each of the others is rejected
   (never "I like it"). Check that the pick is not just last project's look (`art-direction` step 3).
3. **Color.** One neutral base, one brand color, one accent for the main action. At most 5 colors
   plus their neutrals. Measure the contrast of every text/background pair (WCAG formula or the DevTools
   contrast tool): 4.5:1 normal text, 3:1 large text and control borders.
4. **Typography.** At most 2 families (headings + body) from Google Fonts, with a reason. Modular scale
   (ratio 1.25) with `clamp()` to adjust without jumps; body 16-18px, line height 1.5-1.7.
5. **Spacing.** Base scale of 4/8px (4, 8, 16, 24, 32, 48, 64, 96). Space groups: more air between
   sections than inside a card.
6. **Hierarchy.** On each screen, a single element dominates (size, weight or color), one supports, the rest
   stay quiet. Test: squint; if you do not know what to look at first, reduce it.
7. **Composition.** Break the grid of three equal cards: alternate widths, align to a 12-column
   grid, use asymmetry with intent and leave empty zones. Own imagery over illustration.
8. **Motion.** Choose the signature from the direction and follow `animation-craft` (numbers, reduced motion); UI motion stays under 300ms with `ease-out`.
9. Deliver `visual-direction.md` and `tokens.css`.

## Output format

`visual-direction.md`: Direction · Options considered (3 candidates with family and one-line idea) · Criteria (3) · Rejected (2, with reasons) · Idea sentence · Color (table with measured
contrast) · Typography · Spacing · Hierarchy per section · Responsive (what changes at 375/768/1280) ·
What to avoid.

Minimal example of `tokens.css`:

```css
:root {
  --color-background: #faf6f1;   --color-text: #2a2320;   /* contrast 14.2:1 */
  --color-brand: #8a4b3c;        --color-accent: #c2410c; /* accent on background 4.8:1 */
  --font-heading: "Fraunces", Georgia, serif;
  --font-body: "Instrument Sans", system-ui, sans-serif;
  --text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --text-h1: clamp(2.25rem, 1.5rem + 3.5vw, 4rem);
  --space-1: 0.5rem; --space-2: 1rem; --space-3: 1.5rem; --space-4: 3rem; --space-5: 6rem;
  --radius: 0.5rem;  --radius-pill: 999px;
}
```

(The contrast ratios in the example are illustrative: recalculate them with your real colors.)

## Never

- A purple-blue gradient by default, three identical cards with a shadow, a generic centered hero,
  emojis as icons, "Inter everywhere" without a reason.
- Claim a contrast without calculating it.
- Colors, sizes or spacing outside the tokens.
- Treat a library entry, the last project or an example in this file as the default look.

## Why

The generic comes from deciding out of habit. A written criterion against the brief makes every decision
defensible, reviewable and changeable without arguing over taste.
