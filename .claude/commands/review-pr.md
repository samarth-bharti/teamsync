---
description: Run lint + typecheck + tests, then critique the current diff
allowed-tools: Bash, Read, Grep, Glob
---

Review the pending changes on the current branch. **Do not modify any files — this is review only.**

1. Run all three checks and report each result (don't stop at the first failure):
   - Lint: `npm run lint`
   - Typecheck: `npm run typecheck`
   - Tests: `npm test`
   (Skip a check only if its script doesn't exist yet; say which you skipped and why.)

2. Gather the diff to review:
   - `git status`, then `git diff` (unstaged) and `git diff --staged` (staged).

3. Critique the diff for:
   - **Correctness:** bugs, unhandled edge cases, wrong async/await, off-by-one.
   - **Scope:** anything that drifts from `task.md`, especially its "Out of scope" list.
   - **Security:** leaked secrets/keys, the client view (`/c/[token]`) exposing data beyond its own project, missing input validation, service-role key reaching the browser.
   - **Conventions:** violations of `CLAUDE.md` (TS strictness, mobile-first, Tailwind-only).

4. Output: the three check results first, then findings grouped by severity — **Blocker / Should-fix / Nit** — each with `file:line` and a concrete fix. End with a one-line verdict.
