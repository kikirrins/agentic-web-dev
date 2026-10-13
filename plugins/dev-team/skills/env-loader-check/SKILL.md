---
name: env-loader-check
description: Diagnose missing or malformed environment variables before blaming the code - print the variable from the failing process, confirm which .env file loads, check for hidden characters. Use for "API key invalid", 401/403 locally, variables that show as undefined, or after rotating a secret.
allowed-tools: Read, Glob, Grep, Bash
---

# Env loader check

Adapted from mission-control's `env-loader-check` skill. **Never print secret values**: show only that a variable is
set, its length, or its first 4 characters.

## Procedure

1. **Check from the failing process**, not from your shell: in Node, `node -e "console.log(Boolean(process.env.MY_VAR), (process.env.MY_VAR||'').length)"`
   run from the same working directory and with the same loader (Next.js loads `.env*` itself; plain scripts need `--env-file=.env.local`).
2. **Which file loads?** Next.js order: `.env.local` overrides `.env`; `.env.development.local` overrides both in dev. List them: `ls -la .env*`.
3. **Does the file exist and have the line?** `grep -c '^MY_VAR=' .env.local`.
4. **Hidden characters**: `cat -A .env.local | grep MY_VAR` — `^M` means CRLF, a BOM at the start of the file breaks the first variable.
5. **Name and quoting**: exact name, no trailing spaces, no quotes unless intended.
6. **Restart the dev server** after any `.env*` change; Next.js does not reload them live.
7. Only after all of this, look at the code.

## Common pitfalls

- Running from another directory, so another `.env` loads.
- A `.env.local` silently overriding `.env`.
- Docker not passing host variables: use `env_file:` or `-e`.
- Using a `NEXT_PUBLIC_` variable on the server before restart, or a private variable in the browser (it is `undefined` there by design).

## Never

- Print, log or paste a secret value in chat, a task or a file.
- Commit `.env*` files.
- Rotate or replace keys yourself: ask the person.

## Why

Most "invalid key" errors are a key in the wrong file or a stale process, not a code bug; checking the loader first
saves hours of debugging the wrong layer.
