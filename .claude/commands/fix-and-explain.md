---
description: Find and fix the bug behind an error message, then explain the root cause
argument-hint: <error message or stack trace>
allowed-tools: Bash, Read, Edit, Grep, Glob
---

An error was reported:

$ARGUMENTS

Work through it in order:

1. **Locate.** Search the codebase for the failing symbol, file, or message text in the error above. Read the relevant code and its callers.
2. **Diagnose.** Identify the ROOT cause, not just the symptom. State your hypothesis in one or two sentences *before* you edit anything.
3. **Fix.** Apply the smallest correct change that follows `CLAUDE.md` conventions. Do not refactor unrelated code or expand scope. If the error is a symptom of a deeper design issue, fix the immediate bug and flag the deeper issue separately.
4. **Verify.** Re-run whatever the error implies — the failing test, `npm run typecheck`, or `npm run lint`. Report the result.
5. **Explain.** Briefly: what was actually wrong (root cause), why it produced *this* error, and what your fix changes. Note any remaining risk if the fix is partial.
