---
name: target-file-verification
description: Confirm you are editing the file that really renders a screen before changing UI code - grep the visible text, read a slice, then edit. Use before editing any component or page, when the person refers to a screen by its label, or when several files have similar names.
allowed-tools: Read, Glob, Grep, Bash
---

# Target file verification

Adapted from mission-control's `target-file-verification` skill.

## Procedure

1. **Grep for text visible on the target screen** (a heading, button label or placeholder):
   `grep -rn "Visible label" src --include="*.tsx" -l`. Use the exact text the person sees, in the language of the UI.
2. **Several matches?** Pick the one whose path makes sense for the route and say which you chose and why.
3. **Read a slice of the file** to confirm it renders that content (and that it is the component the route imports).
4. **Then edit.** In Next.js also check `src/app/**/page.tsx` and its imports to be sure the component is used.

## Example

Request: "Add a save button to the Hooks page."
Wrong: edit `Hooks.tsx` because of its name.
Right: grep a visible label, confirm the file path, read it, edit.

## Never

- Edit based on a filename alone.
- Edit a component that no route imports.
- Change copy without checking it is not centralized in `src/lib/content.ts`.

## Why

Names drift from what is rendered. Editing the wrong file looks like a success until the person reloads the page.
