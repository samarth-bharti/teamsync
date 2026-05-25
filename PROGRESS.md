# teamsync — Build Log (coder's running state)

> Single source of truth for "where are we?" across sessions. Update this before
> ending any session. Newest status at top.

_Last updated: 2026-05-25 — Milestone 2 (client approve / request-changes) built; typecheck + lint + build green; still needs Supabase keys for live render._

---

## Status

🟢 **Milestone 1 (read-only client view) built and compiling.** The client page at
`/c/[token]` renders status, progress, the update feed, and approval items.

🟢 **Milestone 2 (client actions) built.** The client can **Approve** / **Request
changes** with an optional note via a token-gated server action
(`app/c/[token]/actions.ts`); the card flips to a read-only outcome after deciding,
which the freelancer will see. `typecheck` + `lint` + `build` + `npm test` all pass.

🟢 **Repo is live on GitHub:** https://github.com/samarth-bharti/teamsync (public, branch `main`).

🟢 **Day 3 tooling (course Skills/Hooks, authored for this repo):** 3 hooks in
`.claude/settings.json` — block destructive Bash; run Prettier on Edit/Write; turn-end
Windows toast — backed by `.claude/hooks/*.ps1`; a `ship-check` skill in
`.claude/skills/ship-check/`; vitest wired so `npm test` runs. **Hooks verified
firing live** (blocked an `rm -rf`; auto-Prettier on edits; toast on turn-end).

⚠️ The app cannot render **live data** until a Supabase project exists and
`.env.local` is filled (one external step, below).

## ⏭️ Action needed from user (to see it live)

1. Create a free Supabase project (https://supabase.com).
2. In the Supabase **SQL editor**, run `db/schema.sql`, then `db/seed.sql`.
3. Fill `.env.local` with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
   (Project Settings → API). The file is already created with empty placeholders.
4. `npm run dev` → open http://localhost:3000/c/demo-aurora

## Confirmed decisions

- **Stack:** Next.js 15 (App Router, TS) + React 19 + Tailwind 3 + Supabase
  (Postgres) + Vercel. Free tiers only.
- **Data source:** client view fetches by `share_token` **server-side with the
  service-role key** (never sent to browser); RLS on with no anon policies.
- **Client actions:** the no-account client mutates only via token-gated server
  actions that verify the item belongs to the token's project.
- **Approach this session:** do the course's Day 3 (Skills/Hooks) + the Git
  assignment _on_ teamsync, so learning and shipping reinforce each other.

## What's done

- **Milestone 1** — read-only client status page (scaffold, data layer
  `lib/*`, `app/c/[token]/page.tsx`, components, `db/schema.sql` + `db/seed.sql`).
- **Milestone 2** — client approve / request-changes: `app/c/[token]/actions.ts`
  (`decideApproval`, token-gated), interactive `components/ApprovalItemCard.tsx`,
  `lib/projects.ts` now returns all approvals (pending + resolved), page splits them.
- **Git/GitHub** — repo initialized, identity set, public GitHub remote, pushed.
- **Day 3** — 3 hooks + `ship-check` skill + vitest test runner.

## Next steps

1. **(User)** do the Supabase handoff above; confirm `/c/demo-aurora` renders and
   that approve / request-changes works end to end on a phone.
2. **(User, optional)** finish Day 3: install 3 community skills + 1 plugin via `/plugin`.
3. **Freelancer side** — signup (Supabase Auth) → dashboard → create project → post
   update → raise approval item → copy the `/c/[token]` link → see client responses.
   Needs schema change (`owner_id` + RLS) and `@supabase/ssr`.
4. Deploy to Vercel (real public URL) for the end-to-end test in `task.md`.

## Decisions log

- **2026-05-22** — Continuity docs + Claude Code config created.
- **2026-05-22** — Stack confirmed; milestone split recorded.
- **2026-05-22** — Built Milestone 1 read-only client view (authored Next.js files
  directly; create-next-app won't scaffold into a non-empty dir).
- **2026-05-25** — `git init` + first commit; pushed to public GitHub repo
  `samarth-bharti/teamsync` (branch `main`); verified remote.
- **2026-05-25** — Day 3: authored 3 hooks + a `ship-check` skill; wired vitest.
- **2026-05-25** — Built Milestone 2: client approve / request-changes + optional
  note. `decideApproval` is token-gated (verifies item→project) via the service-role
  client; `lib/projects.ts` returns all approvals so the page shows pending +
  resolved outcomes.

## Open questions for the user

- Freelancer login mechanism — email+password vs magic link — decide when we start
  the freelancer side (after you've seen the app live).
- Deploy to Vercel now, or after the freelancer side is built?
