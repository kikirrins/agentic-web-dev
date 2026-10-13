<!-- Derived from pbakaus/impeccable reference text (typeset, colorize, layout), Apache-2.0, Copyright 2025 Paul Bakaus, commit 2f98774f86bc05563876643db37e6c37c322850f. Condensed; commands, detector and live-mode parts removed. See ../../THIRD-PARTY-NOTICES.md. -->
# Type, colour and layout: verify lists

Improve inside the established visual world; do not replace the identity unless asked.

## Typography
- Visitor mode: persuasion/experience pages (storefront, campaign) may let display type carry the voice; reading and operating surfaces (forms, cart, account) put stability, scanability and measure first.
- Ask with evidence (selector or computed value): which faces/weights/roles are established, is each family necessary; can heading, body, label, metadata, data roles be told apart at a glance; is there
  a deliberate role scale or arbitrary values; does body stay 45-75ch with line height tuned inversely to measure; what happens with long headings, expansion of Spanish copy, zoom, narrow containers, missing weights, font fallback;
  are only used font files loaded, with fallback metrics and no invisible text.
- Apply: body 1rem/16px floor; light text on dark gets slightly more line height, a touch more tracking and maybe one more weight; consistent roles across screens; tabular numerals for prices and quantities;
  fewest roles and families that make hierarchy unmistakable (size + weight + space + tone, not size alone); paragraph spacing OR first-line indent, not both; preserve browser zoom and user font settings.
- Never decorative type at the expense of comprehension; no second family without a role only it can perform.

## Colour
- Audit: which colours are confirmed brand commitments; current roles (canvas, elevated surface, text primary/secondary, action, focus, selection, border, success/warning/error/info);
  places where grey hides hierarchy or state; contrast failures; colour-only communication.
- Strategy: name the emotional temperature, dominant relationship, contrast range and colour dosage before editing; it follows the brief and direction, not a fixed percentage rule.
  Let the strongest colour own a deliberate region or role; keep the primary action colour for the action; tint neutrals only when the brand hue creates cohesion.
- OKLCH is easier to adjust predictably for new web palettes (vary lightness, reduce chroma near white/black); prefer explicit colours to stacks of translucent overlays when alpha makes contrast context-dependent.
- Dark mode: compose surface elevation and contrast explicitly; do not invert the light theme mechanically. Define primitive values and semantic tokens so themes remap roles.
- Verify computed pairs in all states (hover, disabled, overlays, text on images, both themes): body 4.5:1, large text 3:1, controls/icons/focus 3:1; simulate common colour-vision deficiencies; add text/shape/position where colour carries meaning.

## Layout
- Ask: reading order (squint test), grouping (proximity before containers), rhythm (tight vs generous, not one spacing everywhere), structure (are repeated cards genuinely equivalent or a framework default), density vs
  use frequency, adaptation (what reorders/collapses/wraps/scrolls at narrow, intermediate, wide, zoom; DOM and focus order match the visual order), extremes (long content, empty states, sticky elements, safe areas, small targets).
- Apply: documented spacing scale (4-unit base gives the useful middle steps); `gap` for sibling rhythm; hierarchy follows product priority; responsive behaviour is structural (reorder, collapse, reveal), not shrinking;
  container-aware components when one component lives in different contexts; touch targets usable even when the visible mark is small; depth only when it clarifies state or hierarchy; optical corrections only after viewing the render.
- Variation is not a goal; repetition supports recognition, break it only when content or priority changes.
