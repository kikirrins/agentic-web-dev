---
name: api-and-database
description: Builds the backend of a Next.js site - schema with Drizzle and SQLite/libSQL, API routes (route handlers) and server actions with zod validation, clear errors and migrations. Use it when the site stores data (orders, bookings, contacts, products) or exposes endpoints.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# API and database

> **Standalone mode:** if the `agentos_*` tools are not available (AgentOS not installed), skip every `agentos_*` call and any "virtual file"/Archivos step: write the document on disk inside the project folder (`<project>/...`) and tell the person its relative path.

By default: **Drizzle ORM + libSQL**. Locally it is a file (`file:local.db`); in production the same
code points to Turso (remote libSQL) or is migrated to Postgres if needed. A file-based SQLite database
**does not persist on Vercel**: do not publish with `file:` (tell the person).

## Procedure

1. **Dependencies**: `pnpm add drizzle-orm @libsql/client zod` and `pnpm add -D drizzle-kit`.
2. **Schema** `src/db/schema.ts` (one file per domain if it grows):
   ```ts
   import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
   export const products = sqliteTable('products', {
     id: integer('id').primaryKey({ autoIncrement: true }),
     slug: text('slug').notNull().unique(),
     name: text('name').notNull(),
     priceCents: integer('price_cents').notNull(),
     active: integer('active', { mode: 'boolean' }).notNull().default(true),
   })
   ```
3. **Connection** `src/db/index.ts`:
   ```ts
   import { drizzle } from 'drizzle-orm/libsql'
   import { createClient } from '@libsql/client'
   const client = createClient({ url: process.env.DATABASE_URL ?? 'file:local.db', authToken: process.env.DATABASE_AUTH_TOKEN })
   export const db = drizzle(client)
   ```
4. **Migrations** `drizzle.config.ts` (`dialect: 'turso'`, `schema`, `out: './drizzle'`, `dbCredentials: { url }`);
   then `pnpm drizzle-kit generate` and `pnpm drizzle-kit migrate`. If the command changed, read the
   error message or `pnpm drizzle-kit --help` and adjust. Never delete migrations that have already been applied.
5. **Route handlers** `src/app/api/<resource>/route.ts`: validate with `zod` **before touching the database**, respond with JSON
   and the correct status (400 invalid input, 404 does not exist, 409 duplicate, 500 unexpected without leaking the internal error).
   ```ts
   const Body = z.object({ name: z.string().trim().min(2).max(80), email: z.string().email() })
   export async function POST(req: Request) {
     const r = Body.safeParse(await req.json().catch(() => null))
     if (!r.success) return Response.json({ error: 'Datos inválidos' }, { status: 400 })
     await db.insert(contacts).values(r.data)
     return Response.json({ ok: true }, { status: 201 })
   }
   ```
6. **Server actions** for the site's own forms (`'use server'`): the same `zod` validation, returning
   `{ ok, errors }` to render the form.
7. **Basic security**: secrets only in `.env.local` and read on the server; admin routes behind
   a token or real authentication; size and attempt limits on public forms (honeypot or a simple
   per-IP limit); queries always through the ORM (never SQL concatenated with user text).
8. **Sample data** `src/db/seed.ts` with content that is clearly test data, runnable with `pnpm tsx src/db/seed.ts` (`pnpm add -D tsx`). Wrap the logic in `async function main() { ... } main()`: `tsx` does not support a bare top-level `await` in a CommonJS project.
9. **Verify**: `pnpm build` and test each endpoint with `curl` (happy case and 2 invalid cases); write down the response and status.

## Output format

`docs/API.md` in the project: table of routes (method, path, input, outputs), table schema, environment
variables and how to migrate/seed. Also write it with `agentos_file_write` as `dev/<project>/docs/API.md`.

## Never

- Trust browser data (prices, roles, foreign ids) without validating it on the server.
- Return the internal error message or the query to the client.
- Store passwords in plain text (if accounts are needed, use a proven authentication library; ask first).
- Publish with a local file-based database.

## Why

The browser is hostile territory: what is not validated on the server eventually arrives broken. A schema
with migrations lets you change the database without losing data.
