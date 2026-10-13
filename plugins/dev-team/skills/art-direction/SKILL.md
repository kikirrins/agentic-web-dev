---
name: art-direction
description: Chooses an art direction for a website or store from a library of 20 researched directions (fashion and ecommerce included), 56 palettes and 44 type systems, using a brief, 3 candidates from different families, written pick/reject reasons and tokens. There is NO house style: the library is a menu of options, never a default look. Use at the start of any design, redesign or "this looks generic" request, before writing tokens or code; not for dashboards or admin screens.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

<!-- Vendored and trimmed from Leonxlnx/taste-skill (MIT, (c) 2026 Leonxlnx), commit 2b44c81bbe36ac8a8a6bdd1c9ff593f28b8728f4; procedure rewritten by us. See ../../THIRD-PARTY-NOTICES.md. -->
# Art direction (a library of options, not a style)

> **Standalone mode:** if the `agentos_*` tools are not available (AgentOS not installed), skip every `agentos_*` call and any "virtual file"/Archivos step: write the document on disk inside the project folder (`<project>/...`) and tell the person its relative path.

Left alone, a model builds the average of every page it has seen: centered headline, row of icon cards, soft gradient.
This skill replaces that default with a decision. **There is no house style.** Every project is different:
directions, palettes and type systems here are options to choose from per brief, never the starting look. Never reuse
the previous project's palette, fonts or layout by default; reuse needs the person's explicit request.
The person's own brand assets and Figma files beat any library entry (map them onto the roles, take only composition from a direction).

Files (load on demand, do not read whole): `directions.md` (20 directions + 11 motion signatures; `fashion` and `ecommerce`
sector tags are marked), `palettes.md` (56, by tag), `type-systems.md` (44, by class).

## Procedure

1. **Brief and references first.** Ask for 2 sites they love, 1 they hate, 3 adjectives, what real imagery exists (own
   photos? product shots? none) and brand assets (logo, colours, fonts, Figma). Without references, ask before drawing;
   do not guess. If a Figma file or brand kit exists, read it first (`design-references`).
2. **Inventory the subject**: 8-12 things that belong to this client and to no competitor (its name and meaning, place, materials,
   rituals, the printed things of its world, the numbers in the brief). The idea comes from this list, not from the category.
3. **Anti-repeat check**: list what other projects used (`agentos_file_list` prefix `dev/`, read each `docs/visual-direction.md`
   if any). Write "already used elsewhere: ..." and keep those out of the candidates unless the person asks.
4. **Draw 3 candidates from different families** (`directions.md` index, column family; filter by the sector tag and tones that
   fit, then pick three whose families differ, e.g. type + object + photo). Include one that is uncomfortable or unexpected for
   the category; do not draw only the ones you would have chosen anyway. For each: its idea applied to THIS subject in one
   sentence, plus candidate palette (by tag) and type class.
5. **Pick one and reject two, in writing.** Criteria: carries something only this client has (the competitor test: put the
   nearest competitor in the idea sentence; if it still works, the idea is generic); fits the real imagery available; fits
   the audience and device (mostly phones); is feasible with our stack and performance rules. Record why each rejected
   option loses. If the person chose another one, that wins, with your note of the trade-off.
6. **Idea sentence**: "On this page, [something that belongs to the subject] becomes [the device the direction calls for]."
   Both blanks from the inventory. Optional "one live thing": one real interaction made from the idea (pick a fabric and see it,
   choose a size and see it on a figure), with a plain fallback without JS.
7. **Tokens.** From the chosen palette: bg -> `--background`, ink -> `--foreground`, surface -> `--card`, muted -> `--muted-foreground`,
   accent -> `--primary`/`--accent`. **Measure contrast** of each pair used (4.5:1 text, 3:1 large text and controls); library values
   are not guaranteed AA. Pair from `type-systems.md`: max 2 families, free for commercial use, self-hosted via `next/font`
   (Google) or downloaded (Fontshare); use the direction's tracking/leading as starting values. Scale per `frontend-design`.
8. **Write it down** in `docs/visual-direction.md` (via `frontend-design` format) with a section "Options considered":
   the 3 candidates (id, family, one-line idea), the pick, the reasons the 2 others lost, the redraws, and what was kept
   from the person's brand. Hand the motion signature to `animation-craft`.

## Avoid unconsidered defaults (tells)

These are not banned; they are what appears when nobody decided. If you use one, write the reason: centered headline + subtitle
+ two buttons + screenshot; three identical icon cards; violet/indigo gradients; gradient headline text; glass panels everywhere;
soft grey shadow under every card; emoji as icons; the same typeface as every generated page; eyebrow label over every heading;
01/02/03 section numbers; fake dashboards; stock photos standing in for the client's own.

## Rules of use

- A direction is adopted as a whole (composition, type class, palette tags, imagery, motion), then adapted. Do not blend it with the
  layout you would have made anyway. Redraw a slot only for a stated reason (contradicts brand, needs an asset that does not exist).
- Content first: every section carries its full real content; thin sections lose to busy ones. Sample content is marked `[NO DATA]`.
- No invented proof (customers, quotes, reviews, press). No pictures you do not have: design with type and colour and leave marked space.
- Directions assume public marketing/store pages. Not for admin or dashboard screens.

## Never

- Present the library as "our style", pick a direction because it was the first in the file, or skip the rejection reasons.
- Pick fonts or palettes without measuring contrast and confirming the font licence.
- Run or download anything from the upstream repo (scripts, `assets.mjs` image fetchers): this skill is static text and data.

## Why

Blind reviews of award-level sites showed that the best pages came from an idea taken from the subject and a composition chosen
on purpose, and the weakest from a category default. Requiring 3 different candidates and written rejections forces the decision.
