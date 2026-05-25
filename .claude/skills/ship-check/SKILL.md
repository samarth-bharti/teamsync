---
name: ship-check
description: Run all teamsync quality gates (typecheck, lint, unit tests, production build) and report a clear pass/fail summary. Use when the user asks to "ship-check", "run all checks", or wants to confirm the app is safe to commit, push, or deploy.
allowed-tools: Bash(npm run typecheck:*), Bash(npm run lint:*), Bash(npm test:*), Bash(npm run build:*)
---

# ship-check

teamsync's pre-ship gate. Run every quality check in one pass so we never push or
deploy broken code.

## What to run (all four, even if an earlier one fails)

1. `npm run typecheck` — TypeScript errors (`tsc --noEmit`).
2. `npm run lint` — ESLint via `next lint`.
3. `npm test` — unit tests (vitest).
4. `npm run build` — production build; catches issues `tsc` alone misses.

Run all four regardless of failures so the user sees the complete picture in one go.

## How to report

Print a short table — one row per gate — marking each ✅ pass or ❌ fail. For any
failure, quote the 2–3 key error lines (not the whole log). End with a one-line
verdict: **"Ready to ship"** only if all four pass; otherwise **"Not ready"** plus
the shortest path to green.
