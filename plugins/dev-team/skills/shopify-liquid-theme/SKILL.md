---
name: shopify-liquid-theme
description: Builds and customizes a Shopify Online Store 2.0 theme in Liquid with Shopify CLI on a dev store or unpublished theme - sections, blocks, snippets, JSON templates, theme settings, metafields, performance and accessibility - and checks it with `shopify theme check`. Use it when the store is a Liquid theme (option A of shopify-choose-approach) or needs theme changes.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch
---

# Shopify Liquid theme

> **Standalone mode:** if the `agentos_*` tools are not available (AgentOS not installed), skip every `agentos_*` call and any "virtual file"/Archivos step: write the document on disk inside the project folder (`<project>/...`) and tell the person its relative path.

## Safety rules (override everything below)

- Work on a **dev store or an unpublished/duplicate theme**. **Never** `shopify theme push --live`, `--allow-live`,
  `--publish`, or `shopify theme publish`: going live is the person's click. `shopify theme dev` edits a development
  theme, not the live one.
- Login (`shopify auth`/first `theme dev` prompt) is done by the person in the browser. Never ask for passwords or tokens in chat.
- Pulling a theme from a real store first (`shopify theme pull --theme <id>`) is allowed; pushing back only to a new
  unpublished theme (`shopify theme push --unpublished`) after the person approves.

## Procedure

1. **Prerequisites**: Node 22.12+ and Git 2.28+; `npm install -g @shopify/cli@latest` (the person approves the install);
   `shopify version`. Chrome is the supported browser for the local preview.
2. **Start**: `shopify theme init` clones the Skeleton reference theme (https://github.com/shopify/skeleton-theme),
   the starter used in Shopify's current tutorial; Dawn is the older reference theme `[UNVERIFIED: not fetched]`.
   An existing store's theme: `shopify theme pull --store <store> --theme <id>` into a git repo, commit it, then branch.
3. **Dev loop**: `shopify theme dev --store <store>` -> preview at `http://127.0.0.1:9292`, hot reload of CSS and sections.
   Useful flags: `--theme-editor-sync`, `--nodelete`, `--only "sections/*"`, `--port`.
4. **Structure (OS 2.0)**: `layout/theme.liquid` (required), `templates/*.json` (JSON templates list sections),
   `sections/` (merchant-editable modules; JSON section groups for header/footer), `blocks/` and in-section `blocks`
   (reorderable parts), `snippets/` (reusable code, `{% render 'name' %}`), `assets/`, `config/settings_schema.json`
   (theme settings) and `settings_data.json` (values: do not hand-edit), `locales/` (`es.json`, `en.default.json`).
   Every merchant-editable text goes through settings or the `t` filter, never hardcoded.
5. **Section skeleton**: markup + `{% stylesheet %}` + `{% schema %}` JSON with `name`, `settings`, `blocks`, `presets`
   (a preset is what makes a section appear in the editor's "Add section"). Block cap is 50 per section by default; use
   `enabled_on`/`disabled_on` (not the old `templates`).
6. **Liquid patterns**: loops `{% for product in collection.products %}`; images
   `{{ image | image_url: width: 800 | image_tag: alt: image.alt, widths: '400, 800, 1200', sizes: '(min-width: 750px) 25vw, 50vw', loading: 'lazy' }}`
   (`width` or `height` is required; max 5760; use `loading: 'eager'` + no lazy for the hero image only; `img_url` is the old filter,
   do not use); prices `{{ product.price | money }}` `[UNVERIFIED: filter page not fetched]`; metafields
   (e.g. fabric, care) defined in admin Settings > Custom data, then read in Liquid and set in bulk via `shopify-admin-api-automation`;
   `{% render %}` not `{% include %}`.
7. **Styling**: plain CSS with the designer's tokens as CSS variables in a `{% stylesheet %}` or `assets/base.css`; map
   `frontend-designer`'s `tokens.css` to `settings_schema.json` color/font settings so the owner can tweak them. Tailwind
   is not the default (build step, class noise in the editor); use it only if the person agrees and a build pipeline exists.
8. **Performance and accessibility**: ship little JS (progressive enhancement, no jQuery); responsive images as above;
   fonts limited to 2 families with `font-display: swap`; semantic landmarks, visible focus, labels on forms,
   `alt` from media alt text, contrast AA; `prefers-reduced-motion`. See `audit-accessibility` and `audit-performance`.
9. **Check**: `shopify theme check` (flags: `--auto-correct`, `--fail-level <severity>`, `--output`, `--init` for
   `.theme-check.yml`) must pass with no errors; then `shopify theme push --unpublished` (`--json` for the result) to
   get a preview link, and ask `web-qa` to run Lighthouse and the accessibility review on the preview.
10. **Hand-off**: write `docs/THEME-README.md`: what sections/settings exist, how to edit in the theme editor, the preview link,
    the exact steps for the person to publish (Online Store > Themes > Publish), how to roll back (previous theme stays in the library).

## Output format

`docs/THEME-README.md` (also via `agentos_file_write`), the git-committed theme folder, and the `theme check` output pasted into the
report.

## Never

- Push or publish to the live theme; delete themes (`shopify theme delete`); edit `settings_data.json` by hand.
- Hardcode copy, prices or product data; invent metafield names without defining them in admin first.
- Install a paid theme or app without the person's approval; copy a paid theme's code.

## Why

A theme edit on the live theme is instantly visible to customers and cart/checkout bugs cost sales. Unpublished themes,
`theme check` and a human publish step make every change reviewable and reversible.

Sources (checked 2026-10-13): https://shopify.dev/docs/storefronts/themes/getting-started/create ;
https://shopify.dev/docs/storefronts/themes/architecture ; https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema ;
https://shopify.dev/docs/api/shopify-cli/theme (and `/theme-dev`, `/theme-push`, `/theme-pull`, `/theme-check` pages) ;
https://shopify.dev/docs/api/shopify-cli (Node 22.12, Git 2.28) ; https://shopify.dev/docs/api/liquid/filters/image_url ;
https://shopify.dev/docs/api/liquid/filters/image_tag.
