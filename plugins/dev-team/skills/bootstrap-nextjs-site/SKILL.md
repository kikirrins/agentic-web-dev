---
name: bootstrap-nextjs-site
description: Starts a new site (landing, business site, portfolio, blog) with Next.js, TypeScript, Tailwind v4 and shadcn/ui in minutes, with structure, fonts, metadata and build verification. Use it when starting any new web project, before designing sections.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Next.js site bootstrap

> **Standalone mode:** if the `agentos_*` tools are not available (AgentOS not installed), skip every `agentos_*` call and any "virtual file"/Archivos step: write the document on disk inside the project folder (`<project>/...`) and tell the person its relative path.

Commands tested on 13-Oct-2026 (Next 16, React 19, Tailwind 4, shadcn with a `components.json` in the `base-nova` style).
If a command fails, read the error and adjust; do not invent flags.

## Procedure

1. **Requirements**: `node -v` (20 or higher) and `pnpm -v`. If pnpm is missing: `npm i -g pnpm` (tell the person).
2. **Create the project** inside `~/AgentOS/dev/` when AgentOS is installed; otherwise ask the person for the folder or use `./<project>/` in the current directory (lowercase name with hyphens):
   ```bash
   cd ~/AgentOS/dev
   npx --yes create-next-app@latest <project> --ts --tailwind --eslint --app --src-dir \
     --import-alias "@/*" --use-pnpm --yes
   cd <project> && npx --yes shadcn@latest init -d -y
   npx --yes shadcn@latest add button card badge input textarea dialog sheet accordion tabs separator -y
   ```
   Tailwind 4 does not use `tailwind.config`: tokens live in `src/app/globals.css` (`:root` and `@theme inline`).
3. **Tokens from the visual direction**: translate `visual-direction.md` into variables in `globals.css`
   (`--background`, `--foreground`, `--primary`, `--accent`, `--radius`) and into `@theme inline` so they exist
   as classes (`bg-primary`). Each color goes in `:root` and in `.dark`. No loose colors in components.
4. **Fonts** with `next/font/google` in `src/app/layout.tsx` (at most 2), exposed as CSS variables
   (`--font-heading`, `--font-body`) and wired up in `@theme inline`.
5. **Structure**:
   ```
   src/app/(site)/page.tsx         home, one section per component
   src/app/layout.tsx              fonts, <html lang="es-MX">, base metadata
   src/components/sections/        Hero.tsx, Services.tsx, Gallery.tsx, Contact.tsx ...
   src/components/ui/              (shadcn, do not edit recklessly)
   src/lib/content.ts              ALL the business's text and data in a typed object
   public/                         optimized images (use next/image with width/height)
   ```
   Content goes in `src/lib/content.ts`, not in the JSX: the person changes texts without touching the design.
   Missing data: a visible `"[NO DATA: ...]"`, and it is reported.
6. **Metadata**: `export const metadata` with `title`, `description`, `openGraph`; `lang="es-MX"` (see skill `seo-and-metadata`).
7. **Verify before saying "done"**:
   ```bash
   pnpm lint && pnpm build
   pnpm dev   # you start it and check http://localhost:3000 at 375px and 1280px, console without errors; the person views it at the URL you give them
   ```
   If port 3000 is busy, Next picks another: use the one it prints.

## Output format

`SITE-README.md` at the project root: how it is run (`pnpm dev`, started by the agent), where to edit the content
(`src/lib/content.ts`), sections created, `[NO DATA]` pending items, result of `lint` and `build`. Also write it as a virtual file with
`agentos_file_write` (`dev/<project>/SITE-README.md`) and deliver the project folder with `agentos_task_deliver` (`path`), so the person reads it in the web
(Archivos -> `dev/<project>`, or the task's delivery).

## Never

- Install an extra UI library (MUI, Chakra, etc.) on top of shadcn without a written reason.
- `className` with hexadecimal colors or inline `style`: everything comes from tokens.
- Leave the create-next-app sample content (Next logo, links to Vercel).
- Say "done" without having run `pnpm build`.

## Why

With the same startup every project comes out in minutes and is maintained the same way; content separated from design
lets the business owner update texts and prices without breaking anything.
