---
name: verification
description: Evidence gate before claiming work is done - re-read the criteria, run tests, lint, types and build fresh, check edge cases and fill an evidence block. Use before saying "done", "fixed" or "working", before committing, and before moving a task to review.
allowed-tools: Read, Glob, Grep, Bash
---

# Verification before completion

Adapted from mission-control's `verification` skill.

## Iron law

No completion claim without fresh verification: you run the commands and read the output in THIS session.

## Procedure

1. **Re-read the criteria.** Go back to the original request or bug report and list every acceptance
   criterion explicitly. If a criterion is vague, ask; do not assume.
2. **Run everything fresh**, not only the tests you wrote: the full test suite, lint and type checks
   (`pnpm lint`, `pnpm exec tsc --noEmit` or the project's equivalent) and the build (`pnpm build`).
   Read the output; do not assume success.
3. **Check edge cases**: bad input, empty states, error paths, and a regression pass over what already worked.
   The feature must work for every criterion, not just the happy path.
4. **UI changes**: open the page at 375px and 1280px, check the console, take a screenshot.
5. **Servers and configs**: prove it with `curl`, `pgrep` or `cat` of the real file; restart and re-verify from scratch
   instead of trusting hot reload.
6. **Fill the evidence block** and include it in your report and in the task description:

```
### Verification evidence
- Criteria: <what was required>
- Tests: <pass/fail counts, command, when>
- Lint / types: <clean | N errors>
- Build: <success | fail>
- Manual check: <what you verified and how>
- Edge cases: <boundaries tested>
- Not verified: <anything you could not run, and why>
```

## Never

- Claim "done" from memory or from a cached result.
- Skip the evidence block: if you cannot fill it, you are not done.
- Treat a passing suite as enough: the specific criteria must also be checked.
- Retry the same failing command a third time: after two identical failures stop, print the raw error and ask.
- Claim partial completion as complete.

## Why

Premature "it works" was the most repeated failure in earlier projects: the person finds the bug, not the agent.
An evidence block makes the claim checkable in ten seconds.
