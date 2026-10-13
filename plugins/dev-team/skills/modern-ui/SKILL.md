---
name: modern-ui
description: Recipes for modern, beautiful interfaces with Tailwind v4 and shadcn/ui - hero, bento grid, product cards, pricing, fluid typography, dark mode, surfaces with depth and complete states. Use it when building the sections of a site or store, after defining the direction with frontend-design.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Modern UI

> **Standalone mode:** if the `agentos_*` tools are not available (AgentOS not installed), skip every `agentos_*` call and any "virtual file"/Archivos step: write the document on disk inside the project folder (`<project>/...`) and tell the person its relative path.

Beauty comes from a few decisions applied without exception, not from many effects. Before this skill
there is a `visual-direction.md` (skills `frontend-design` and `art-direction`); here it gets executed. **There is no base style:** the craft rules below are
mechanics (states, rhythm, tokens), while shape, colour, type and layout come from the direction chosen for THIS project. The patterns are skeletons to adapt or
discard when the direction's composition calls for something else; never use them as the default hero or grid. Do not carry over the previous project's look.

## Craft rules

1. **A single shape family**: the radius (`--radius`) from the direction's tokens, used everywhere; pill buttons only if the direction calls for it.
2. **Fluid type scale**: headings with `clamp()`, `text-balance` on headings and `text-pretty` on paragraphs,
   `tracking-tight` at large sizes, body 16-18px with `leading-relaxed`. Strong heading contrast (weight 600-700) against light body.
3. **Subtle depth**: a 1px low-opacity border (`border-border/60`) + a soft two-layer shadow;
   no hard black shadows. Backgrounds with a very light gradient or noise, not flat saturated color.
4. **Vertical rhythm**: sections with `py-20 md:py-32`, container `max-w-6xl mx-auto px-4 sm:px-6`. Space groups.
5. **One focus per screen**: one dominant heading, one primary action; everything else secondary.
6. **Own imagery first**: product/business photos with `next/image`, fixed `aspect-*`, `object-cover`, corners using the radius.
   No real photo: a brand color block with large typography, not generic illustrations or fake stock.
7. **Complete states on every interactive component**: hover, `focus-visible` (visible ring), active,
   disabled, loading and empty. A component without a loading state is incomplete.
8. **Dark mode** with tokens (`.dark` in `globals.css`), not with duplicated colors in the classes.
9. **Mobile-native feel** (fashion traffic is mostly phones): `100dvh`/`100svh`, 16px inputs, hover only under `(hover: hover) and (pointer: fine)`, `touch-action: manipulation`,
   safe-area insets; details in `animation-craft` MOBILE.md.
10. **Third-party components** only through `component-sourcing` (vet, adapt to tokens, record in `docs/components.md`).

## Patterns (skeletons to adapt)

**Asymmetric hero** (text on the left, large visual on the right, one primary action and one secondary link):
```tsx
<section className="relative overflow-hidden">
  <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:py-32">
    <div>
      <p className="mb-4 text-sm font-medium tracking-wide text-primary uppercase">{c.eyebrow}</p>
      <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-6xl">{c.title}</h1>
      <p className="mt-6 max-w-prose text-lg text-pretty text-muted-foreground">{c.subtitle}</p>
      <div className="mt-8 flex flex-wrap gap-3"><Button size="lg">{c.cta}</Button><Button size="lg" variant="ghost">{c.cta2}</Button></div>
    </div>
    <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius)] border border-border/60 shadow-xl"><Image src={c.image} alt="" fill priority className="object-cover" /></div>
  </div>
</section>
```

**Bento grid** (breaks the three equal cards: cells of different sizes):
```tsx
<div className="grid auto-rows-[14rem] gap-4 md:grid-cols-4">
  <Card className="md:col-span-2 md:row-span-2" />  <Card className="md:col-span-2" />
  <Card />  <Card />  <Card className="md:col-span-2" />
</div>
```

**Product card**: square image with a soft zoom on hover (`group-hover:scale-105 transition duration-500`), name,
price formatted with `Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })` from cents, an "Agregar" button with a loading state and visible confirmation.

**Pricing / plans**: 2-3 columns, the recommended one with an accent border and a label; a list of 4-5 benefits with a lucide icon (`Check`), large price, a CTA on each.

**Navigation bar**: sticky with `backdrop-blur` and a subtle bottom border, mobile menu with shadcn's `Sheet`, active link marked.

## Output format

Components in `src/components/sections/` using only tokens and components from `ui/`, with content from
`src/lib/content.ts`. Screenshots at 375 and 1280px (light and dark) in `screenshots/`, and a note on what was discarded. Also write the note and the screenshots as virtual files with `agentos_file_write` (`dev/<project>/screenshots/`, `content_base64`) so the person sees them in the web.

## Never

- A purple-blue gradient by default, identical cards with a shadow, emojis as icons, glassmorphism everywhere.
- More than 2 type families, or more than one "wow" effect per section.
- A clickable `div` instead of `Button`/`a`; images without useful `alt` or without dimensions.
- Ignore `prefers-reduced-motion` (see `animation-craft`).
- Reuse the same hero, bento or palette across projects without a reason tied to the brief.

## Why

Sites that look expensive share three things: typography with character, generous space and total
consistency. Effects without those three things just look overloaded.
