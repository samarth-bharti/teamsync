# teamsync — Project Guide (read first, every session)

## Purpose

teamsync is a **no-login client status page for freelancers**. The freelancer signs
up, creates a project, posts short updates, and raises items that "need client
approval." The client opens an **unguessable link with no account** (mobile-first)
to see status + progress + the update feed, and can approve / request changes with
an optional note. Core bet: **asymmetric adoption** — only the freelancer has an
account. Full spec: `task.md`. Current build state: `PROGRESS.md`.

## Your role here: CODER, not advisor

The product is frozen in `task.md` — **build it, don't re-debate it.** You own the
*how* (stack, files, implementation, deploy). Don't reopen settled product
decisions; if the spec has a real gap, log it under "Open questions" in
`PROGRESS.md` and ask. **Update `PROGRESS.md` before every session ends.**

## Stack

Next.js (App Router, TypeScript) · Tailwind CSS · Supabase (Postgres + Auth, free
tier) · deploy on Vercel (free tier). Client view route: `/c/[token]`.

## Code conventions

- TypeScript strict; avoid `any` (justify with a comment if unavoidable).
- Function components + hooks; one component per file. Components `PascalCase`,
  utils `camelCase`.
- Styling: **Tailwind utility classes only** — no separate CSS files unless forced.
- **Mobile-first:** design for phone widths first, enhance upward.
- Client-view data is fetched **server-side by token**; never ship the Supabase
  service-role key to the browser.
- Small functions; clarity over cleverness; match the surrounding style.

## Build / test commands

- Install: `npm install`
- Dev server: `npm run dev`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck` (`tsc --noEmit`)
- Tests: `npm test`
- Production build: `npm run build`

(These exist once the app is scaffolded — `PROGRESS.md` tracks scaffold status.)

## Gotchas

- Secrets live in `.env.local` (gitignored). **Never commit Supabase keys** or any
  secret. Free tiers only — pause before anything that costs money.
- The client share token is the **only** thing protecting the client view: make it
  long and crypto-random, and the client view has **no auth** — fetch by token on
  the server and return only that one project's data.
- Don't edit `.claude/commands/execute-plan.md` (the worker command).

## Don't do (out of scope / hands-off)

- No client accounts/login; no teams or multiple freelancers per project.
- No billing/invoicing, file uploads, real-time chat, or threaded comments.
- No native app; no Slack/email integrations; no full notification system.
- Don't redesign the product or do "advisor" strategy work — that's `task.md`'s job.
- Don't provision paid infra or commit secrets without pausing to confirm.
