---
name: scope-discipline
description: Make the smallest valid change and resist scope expansion - one commit unless told otherwise, echo the smallest version first, split bundled requests. Use when a request bundles several steps ("fix X, update Y and deploy"), says "commit and push" or "deploy", or when you notice tempting cleanups.
allowed-tools: Read, Glob, Grep, Bash
---

# Scope discipline

Adapted from mission-control's `scope-discipline` skill.

## Procedure

1. **State the smallest change** that satisfies the request before acting. For anything larger, wait for confirmation.
2. **One commit** when asked to "commit and push"; do not split into several without asking.
3. **Three or more distinct steps in one message**: ask which to do first, or do the first and list the rest as
   follow-ups.
4. **Spot a cleanup, refactor or bonus feature?** Mention it as an option at the end. Do not do it.
5. **New dependency or service?** Say why it is needed and get approval first.
6. **If the request names a file or path, edit it directly**; do not explore. Without a named path, cap exploration
   at about three calls, then propose.

## Example

Request: "Fix the cart total, update the README and deploy."
Answer: "Smallest scope: fix the cart total only and commit it. Do you want the README and the deploy as separate steps afterwards?"

## Never

- Add related cleanups, renames or formatting changes silently.
- Bundle unrelated changes in one commit.
- Deploy, publish or send anything as a side effect of another task.

## Why

Small, separate changes can be reviewed and undone. Bundles hide the one change that broke something.
