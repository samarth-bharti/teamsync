# teamsync — Build Log (coder's running state)

> Single source of truth for "where are we?" across sessions. Update this before
> ending any session. Newest status at top.

_Last updated: 2026-05-25 — full product built (client + freelancer sides); project MOVED off OneDrive to E:\ancilar\teamsync; dev server verified working there._

---

## ⚠️ IMPORTANT — project location changed

The live working copy is now **`E:\ancilar\teamsync`** (off OneDrive). OneDrive was
locking Next.js's `.next` files and breaking/​slowing the dev server. The old copy at
`C:\Users\…\OneDrive\Desktop\New folder\teamsync` is **stale — do not use it**; it
should be deleted. Always run Claude Code + `npm run dev` from `E:\ancilar\teamsync`.

## Status — feature-complete, not yet deployed

🟢 **Client side (Milestones 1 + 2):** `/c/[token]` renders status, progress, update
feed, approval items; client can Approve / Request changes + note (token-gated server
action). Live-verified against Supabase.

🟢 **Freelancer side:** email+password auth (`@supabase/ssr` + `middleware.ts`),
`/login`, `/dashboard` (list + create project → mints crypto-random share token),
`/dashboard/[id]` (edit status/progress, post updates, raise approval items, copy
client link, see client responses). Login verified (account created + confirmed).

🟢 **Supabase live:** `.env.local` filled (base URL, service `sb_secret_` key, public
anon JWT). `db/schema.sql` + `db/seed.sql` + `db/freelancer.sql` (owner_id + RLS) all
run. Connection + `owner_id` column verified.

🟢 **Day 3 tooling:** 3 hooks (`.claude/settings.json` → `.claude/hooks/*.ps1`,
paths updated to E:), `ship-check` skill, vitest. Hooks verified firing live.

🟢 **GitHub:** https://github.com/samarth-bharti/teamsync (public, `main`), pushed
through commit `bc9d1d4`. `typecheck` + `lint` + `test` + `build` all green.

## Next steps

1. **Delete the old OneDrive copy** of the project (first task in the E: session).
2. **Rotate the Supabase secret key** (user deferred it; the old `sb_secret_` was
   pasted into a tracked file + logs). Must do before any public deploy. Update
   `.env.local` after.
3. **Deploy to Vercel:** import the GitHub repo, set env vars (the 4 in `.env.local`),
   deploy → real public URL. Then run `task.md`'s 6-step end-to-end check on a phone.
4. (Optional) finish Day 3: install 3 community skills + 1 plugin via `/plugin`; more
   git drills (fetch/pull, reset/rm, stash, revert) on a scratch repo.

## Confirmed decisions

- **Stack:** Next.js 15 (App Router, TS) + React 19 + Tailwind 3 + Supabase + Vercel.
- **Two security worlds:** client = no account, service-role key server-side gated by
  share token; freelancer = Supabase Auth + RLS (anon key + session cookie).
- **Login mechanism:** email + password (email-confirmation disabled in Supabase for
  testing).
- **Approach:** did the course's Day 3 (Skills/Hooks) + Git assignment _on_ teamsync.

## Decisions log

- **2026-05-22** — Continuity docs + config; Milestone 1 built.
- **2026-05-25** — `git init` + public GitHub repo `samarth-bharti/teamsync`.
- **2026-05-25** — Day 3: 3 hooks + `ship-check` skill + vitest.
- **2026-05-25** — Milestone 2: token-gated client approve / request-changes.
- **2026-05-25** — Freelancer side: auth + dashboard + project detail.
- **2026-05-25** — Moved project off OneDrive → `E:\ancilar\teamsync` (OneDrive was
  corrupting `.next`). Fresh `npm install` + build + dev server verified there.
