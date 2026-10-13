---
name: deploy-vercel
description: Prepares and documents the deployment of a Next.js site on Vercel - repository, environment variables, production database, domain and webhooks - as steps and commands the person executes. Use it when the site is ready and needs to be published.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Deploy on Vercel

> **Standalone mode:** if the `agentos_*` tools are not available (AgentOS not installed), skip every `agentos_*` call and any "virtual file"/Archivos step: write the document on disk inside the project folder (`<project>/...`) and tell the person its relative path.

**Publishing is an external action: you prepare, the person executes.** Do not run `vercel --prod`, do not create
accounts, domains or charges, and do not upload secrets.

## Procedure

1. **Local pre-flight** (this one you do run): `pnpm lint && pnpm build` without errors; `git status` without secrets
   (`.env*` ignored); no `file:local.db` as the production database; `NEXT_PUBLIC_SITE_URL` ready for the real domain.
2. **Repository**: `git init`, an initial commit and a GitHub repository created by the person. A `.gitignore`
   that excludes `node_modules`, `.next`, `.env*`, `*.db`.
3. **Write `docs/DEPLOYMENT.md`** with the steps for the person, in order:
   1. Import the repository in vercel.com (Next.js preset, without changing commands).
   2. Environment variables (table with **name, what it is for and where to get it**, no values): `NEXT_PUBLIC_SITE_URL`,
      `DATABASE_URL` / `DATABASE_AUTH_TOKEN` (Turso or another remote database), and if there is a store `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.
   3. Production database: create it in Turso (or the chosen one), run migrations pointing at it.
   4. First deploy and review of the `*.vercel.app` URL with the `launch-checklist` list.
   5. Custom domain: add it in Vercel and configure the DNS records it indicates.
   6. Store: create the production webhook in Stripe with the public URL and switch from `test` to `live` keys; make a small real purchase and refund it.
4. **Post-launch review** (with the person): open the public site, test the form and a purchase, check
   Search Console (see `seo-and-metadata`) and write down who renews the domain and who receives the emails.

## Output format

`docs/DEPLOYMENT.md` and a table of environment variables (also written with `agentos_file_write` under `dev/<project>/docs/`, so the person reads it in the web: Archivos -> `dev/<project>`). In the final report: what you left ready, what
is missing and who does it (the person).

## Never

- Deploy, buy a domain, activate `live` keys or write secret values in files or messages.
- Publish with a file-based database, a default `ADMIN_TOKEN` or open admin routes.
- Say "published" without the person having opened the public URL.

## Why

Deployment touches money, domain and real data. Leaving the steps written down and verifiable turns
the riskiest moment into a list anyone can follow without guessing.
