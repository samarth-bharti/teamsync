# teamsync — Build Log (coder's running state)

> Single source of truth for "where are we?" across sessions. Update this before
> ending any session. Newest status at top.

_Last updated: 2026-05-22 — read-only client view built; typecheck + build green; needs Supabase keys for live render._

---

## Status

🟢 **Milestone 1 (read-only client view) built and compiling.** `npm run typecheck`
and `npm run build` both pass. The app cannot render live data until a Supabase
project exists and `.env.local` is filled (one external step, below).

## ⏭️ Action needed from user (to see it live)

1. Create a free Supabase project (https://supabase.com).
2. In the Supabase **SQL editor**, run `db/schema.sql`, then `db/seed.sql`.
3. Fill `.env.local` with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
   (Project Settings → API). The file is already created with empty placeholders.
4. `npm run dev` → open http://localhost:3000/c/demo-aurora

## Confirmed decisions

- **Stack:** Next.js 15 (App Router, TS) + React 19 + Tailwind 3 + Supabase
  (Postgres) + Vercel. Free tiers only, no existing accounts.
- **Data source:** **Supabase now** (user choice). Client view fetches by
  `share_token` **server-side with the service-role key** (never sent to browser);
  RLS on with no anon policies, so only our server can read.
- **Milestone split:** view-only client page first (this build) → approve /
  request-changes loop next.

## What's done

- Continuity docs (`CLAUDE.md`, `PROGRESS.md`) and Claude Code config
  (`.claude/settings.json` + 3 slash commands) — earlier session.
- **Milestone 1 — read-only client status page** (this session):
  - Next.js scaffold authored directly (create-next-app refuses a non-empty dir):
    `package.json`, `tsconfig.json`, `next.config.mjs`, `postcss`, `tailwind`,
    `.eslintrc.json`, `.gitignore`, `next-env.d.ts`, `app/layout.tsx`,
    `app/globals.css`, `app/page.tsx`.
  - Data layer: `lib/types.ts`, `lib/supabaseServer.ts` (lazy, server-only,
    service-role), `lib/projects.ts` (`getProjectByToken`, React-cached), `lib/format.ts`.
  - Client view: `app/c/[token]/page.tsx` (server component, async params,
    `force-dynamic`, `generateMetadata`) + `app/c/[token]/not-found.tsx`.
  - Components (mobile-first): `StatusBadge`, `ProgressBar`, `UpdateFeed`,
    `ApprovalItemCard` (read-only — actions deferred to M2).
  - DB: `db/schema.sql` (3 tables + RLS) and `db/seed.sql` (demo project
    `demo-aurora`). Docs: `README.md`, `.env.example`.
- Verified: `npm install` ✓, `npm run typecheck` ✓, `npm run build` ✓
  (`/c/[token]` is dynamic, so build needs no DB). Live data render still pending
  the Supabase step above.

## Next steps

1. **(User)** do the Supabase handoff above; confirm `/c/demo-aurora` renders
   name, status, progress, update feed, and the pending approval item on a phone.
2. Milestone 2 — client actions: approve / request changes + optional note
   (reuse `lib/projects.ts`; add a server action + minimal client component).
3. Freelancer side — signup (Supabase Auth) → create project → post update →
   raise approval item → get the `/c/[token]` link.
4. Deploy to Vercel (real public URL) for the end-to-end test in `task.md`.

## Decisions log

- **2026-05-22** — Continuity docs + Claude Code config created.
- **2026-05-22** — Stack confirmed; milestone split recorded.
- **2026-05-22** — Data source = Supabase now (user choice over interim seed).
- **2026-05-22** — Built Milestone 1 read-only client view. Authored Next.js files
  directly instead of create-next-app (won't scaffold into a non-empty dir).
  Set `outputFileTracingRoot` to silence a stray-home-lockfile workspace-root warning.

## Open questions for the user

- Once Supabase is live and `/c/demo-aurora` looks right on your phone, do we go to
  Milestone 2 (client actions) or the freelancer side first?
- Deploy now (Vercel) or after Milestone 2?
