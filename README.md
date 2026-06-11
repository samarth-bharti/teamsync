i made changes here last time
# teamsync

No-login client status pages for freelancers. A client opens a private link
(`/c/<token>`) — no account, no app — and sees the project's status, progress, the
update feed, and anything that needs their input.

## Stack

Next.js (App Router, TypeScript) · Tailwind CSS · Supabase (Postgres) · deploy on
Vercel.

## Run it

1. Install dependencies:
   ```
   npm install
   ```
2. Create a free Supabase project at https://supabase.com.
3. In the Supabase **SQL editor**, run `db/schema.sql`, then `db/seed.sql`.
4. Copy `.env.example` to `.env.local` and fill in (both from
   **Project Settings → API**):
   - `SUPABASE_URL` — Project URL
   - `SUPABASE_SERVICE_ROLE_KEY` — the `service_role` key
5. Start the app:
   ```
   npm run dev
   ```
6. Open the demo client link: http://localhost:3000/c/demo-aurora

The service-role key is used **server-side only** and is never sent to the browser.
Keep it in `.env.local` (gitignored) — never commit it.

> `db/seed.sql` is a one-shot demo seed. Re-running it would add duplicate updates;
> reset the demo project first if you need to re-seed.

## Scripts

- `npm run dev` — dev server
- `npm run build` / `npm start` — production build / serve
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — `next lint`

## Scope

This build is the **read-only client view** (Milestone 1). The freelancer side
(signup, create project, post updates) and client actions (approve / request
changes) are next — see `PROGRESS.md`.
