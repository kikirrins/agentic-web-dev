---
name: design-critique
description: Critiques a built page or store against a craft floor (contrast, depth, spacing, type, motion, states, browser surfaces, copy, coverage), a design-specificity test, 10 usability heuristics scored 0-4 and P0-P3 severities, judged against the project's own chosen direction. Use for the design review pass in QA, before delivering a design, or when asked "is this good / what is wrong with this design". Reports; does not redesign.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

<!-- Derived from pbakaus/impeccable reference text (craft-floor, typeset, colorize, layout, critique), Apache-2.0, Copyright 2025 Paul Bakaus, commit 2f98774f86bc05563876643db37e6c37c322850f.
     Changes by Mty Agentic Labs: condensed and rewritten; removed commands, detector binary, hooks, live mode, sub-agent orchestration and platform-specific parts; bans turned into "decide, do not default". See ../../THIRD-PARTY-NOTICES.md (Apache-2.0 text and NOTICE). -->
# Design critique

Judge the result against **the project's own direction** (`docs/visual-direction.md`, tokens, the person's brand). Nothing here is a house style:
the checks below ask whether choices were made on purpose and work, not whether they match a taste. A direction or brief can earn any "default" listed.
Sibling file `CRAFT.md` has the type, colour and layout verify lists. Pair with `visual-verification` (screenshots) and `audit-accessibility`.

## Procedure

1. Read the brief, `visual-direction.md`, `tokens.css`; open the site at 375 and 1280 (`visual-verification`). Evidence = screenshot, selector, computed value or `file:line`.
2. **Specificity verdict first** (before any checklist): is the composition, type and imagery grounded in THIS business, or could an unrelated brand use it unchanged? Say which
   choices are category-interchangeable and what the direction's idea sentence would have asked for instead. Squint test: with detail blurred, can you still tell the primary
   element, the secondary and the groups, in order?
3. **Craft floor** (check the built result, each with evidence):
   - Contrast: body and placeholder 4.5:1, large text and controls 3:1; text on coloured surfaces tinted from that hue, not generic grey.
   - Depth: shadows have offset and blur; a zero-offset coloured halo is decoration. One elevation language (border or shadow, not both stacked).
   - Spacing: tight groups, generous separation, more space above a heading than below; read computed values, not intention.
   - Type: body measure 45-75ch, headings balanced, clear scale and weight steps, real copy fits at every breakpoint (long headings, zoom, Spanish expansion).
   - Motion: one authored moment, not scattered effects; exponential ease-out; reduced motion handled (`animation-craft` REVIEW.md).
   - States: hover, focus, disabled, loading, error, empty; real content; working controls; keyboard focus visible.
   - Browser surfaces: text selection, caret, scrollbars, focus rings, underline offset and tabular numerals themed from the palette, not left at browser defaults.
   - Copy: the product's own language; controls name their action; errors name the problem and the recovery.
   - Coverage: every brief requirement is present and findable within seconds.
4. **Defaults to question** (recognise, then keep only with a written reason): identical icon-card grids as the page structure; hero-metric template (big number + small label);
   eyebrow above every heading; 01/02/03 markers; gradient text; decorative glass/blur; coloured side-stripe borders; hard offset shadows outside a deliberately neobrutalist
   direction; monospace as a "technical" costume; system display face as the display voice; emoji/glyphs as icons; geometric masks faking organic edges; light/dark picked by category, not by use.
5. **Usability heuristics**, 0-4 each (Nielsen): status visibility, match with real world, user control, consistency, error prevention, recognition over recall, efficiency, minimal design,
   error recovery, help. On marketing/store pages heuristics 7 and 10 may be `n/a` (state why and renormalise the total, e.g. 24/32). Be honest: 4 = excellent; most real sites score 20-32/40.
   Bands by percentage: 90+ excellent, 70+ good, 50+ acceptable, 30+ poor, below critical.
6. **Cognitive load**: more than 4 visible options at one decision point, hidden navigation, jargon, inconsistent patterns, multi-step demands. For a store also walk the path product ->
   cart -> checkout as a first-timer and as a distracted mobile user; list red flags with the exact element.
7. **Severity** per issue: P0 blocks the task, P1 major (fix before release), P2 minor, P3 polish. Test: "would a customer write to support about this?" If yes, at least P1.

## Output (section "Design review" of `qa-report.md`)

Specificity verdict · What works (2-3, with why) · Priority issues (3-5: `[P?] what`, why it matters, concrete fix, evidence) · Heuristics table (score + key issue) ·
Persona red flags (first-timer, mobile, keyboard/screen-reader) · Minor notes · Questions worth asking · Not verified.

## Never

- Treat a personal taste as a finding, or demand a different direction than the one chosen; judge against the direction and the brief.
- Score without evidence, inflate scores, or skip the specificity verdict. Fix things (QA reports; others fix).

## Why

A checklist of mechanics finds broken pages; the specificity verdict finds forgettable ones. Both are needed, and both are measured against the project's own intent.
