---
description: "Execute the plan in task.md — no discussion, just do the work"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

Read `task.md` in the project root.

- If `task.md` is missing, or any required section (Goal, Approach, Files to touch, Done when) is empty: STOP and say it's not ready. Do not guess.
- Otherwise execute the plan exactly as written. Make reasonable calls on small ambiguities; do NOT ask clarifying questions.
- EXCEPTION — pause and flag instead of proceeding before: any step listed under "Risky / irreversible steps", or any destructive action (deleting files, dropping data, force-pushing, overwriting work you didn't create).
- Stay in scope. Do not do anything listed under "Out of scope".

When done:
- Check your work against each "Done when" criterion and confirm it.
- Append an `## Outcome` section to `task.md`: files changed, what you verified, and anything the advisor should review.
