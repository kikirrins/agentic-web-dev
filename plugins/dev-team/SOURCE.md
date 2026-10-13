# Source of dev-team

## Adapted from mission-control (condensed and translated)
- `frontend.md` and `fullstack-dev.md` -> `web-developer` (WCAG 2.1 AA accessibility, mobile-first,
  Core Web Vitals, progressive enhancement). Removed: global state management, backend, the ~10 KB context
  protocol, `.claude/knowledge`, the mission-control MCP, ollama and context7.
- `reviewer.md` and `qa-manager.md` -> `web-qa` and skill `code-review` (verdict with severity,
  actionable feedback, block if it does not pass). Removed: scoring by test coverage and the
  escalation flows to committees.
- `architect.md` (ideas only) -> `tech-lead` (split the work, decisions with criteria).
- `dev-team-practices.md` -> `tech-lead` rules: review before delivering, one task with one
  owner, verification with evidence, do not declare "done" without checking.

## Written from scratch
- `frontend-designer` and skill `frontend-design` (aesthetic direction, tokens, hierarchy).
- Skills `build-static-page`, `audit-accessibility`, `audit-performance`, `launch-checklist`.
- The "How you work with AgentOS" block, per `docs/CONVENTIONS-TEAMS.md`.
- Context: a web development course (a site for a small brand). No Obsidian.

## Shopify (added 2026-10-13)
- Agent `shopify-developer` and skills `shopify-choose-approach`, `shopify-store-setup`, `shopify-liquid-theme`,
  `shopify-admin-api-automation`, `shopify-headless-storefront`, `shopify-store-operations`: written from scratch.
- Context: the Shopify session of a web development training (options screen, Hydrogen/Oxygen fundamentals copy from shopify.dev)
  and the "decide Shopify vs own catalog" step of `vibe-coding-websites/PLAN-agentos-dev.md`.
- Sources verified 2026-10-13 (each skill lists its URLs): shopify.dev (API versioning, Shopify CLI, theme architecture, section schema,
  Storefront and Admin GraphQL, bulk operations, client credentials grant, Hydrogen/Oxygen, Functions) and help.shopify.com (Flow,
  product CSV, Shopify Payments Mexico, OXXO, taxes). Not verified, marked `[UNVERIFIED]` in the skills: native CFDI
  support (assumed absent), es vs es-MX locale, shipping-zone steps, scopes for old orders, Flow trigger names. Prices are never
  stored here: verify at shopify.com/mx/precios.
- The roster entry (`web/lib/roster.ts`, face) and `roster.json` are wired outside this plugin.

## Frontend resources integration (added 2026-10-13, from `docs/research/frontend-resources-audit.md`)
Owner decisions: no house style (libraries are options per project; the person's brand and Figma win); WebFetch for the designer; Playwright MCP for the designer, frontend engineer,
QA and Shopify developer; Claude Design, Figma and Higgsfield are human/optional steps for the student. Attribution, commit pins, licences and trims: `THIRD-PARTY-NOTICES.md`.

| Piece | Origin | What |
|---|---|---|
| `art-direction` | Taste Skill v2 (MIT), trimmed | 20 directions, 56 palettes, 44 type systems as tables; our procedure (brief, 3 candidates, pick/reject, tokens). No scripts, no house-rule bans |
| `animation-craft` (replaces `web-animation`) | Emil Kowalski skills (MIT), trimmed | animate + RECIPES, review-animations + STANDARDS, animation-performance, mobile-native; our `motion` library guidance and reduced-motion rules |
| `break-ui` | Emil Kowalski break-ui (MIT), trimmed + our store rows | worst-case data catalog for QA |
| `design-critique` | Impeccable reference text (Apache-2.0), condensed | craft floor, type/colour/layout checks, critique rubric. Plugin, hooks and binary NOT included |
| `visual-verification` | ours | Playwright MCP procedure, limits, screenshot citation |
| `component-sourcing`, `design-references` | ours | vetting checklist and provenance log; Refero/Claude Design/Figma/Higgsfield inputs |
| `.mcp.json`, `mcp/playwright-guard.mjs`, `docs/MCP-OPTIONAL.md` | ours around `@playwright/mcp@0.0.83` (Apache-2.0) | headless, isolated, unsafe tools filtered; Figma documented as optional |
| `frontend-design`, `modern-ui`, 4 agents + tech-lead | updated | no-house-style rule, new skills wired in |

Not vendored: **UI/UX Pro Max** (audit "Later"): it needs its Python search script and 7 CSVs whose palettes are generic category defaults, which fights the no-house-style rule; revisit only
if the designer needs a contrast/token safety net. Also not taken: Apple Design Skill, ComposioHQ list, HyperFrames, MotionSites, Open V0 clones, Motion AI Kit installer (owner may run it).
Refresh policy: quarterly review of the pinned commits (owner: AlgoLab); never track "latest".
