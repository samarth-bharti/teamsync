-- teamsync schema — Milestone 1 (read-only client view)
-- Run this in the Supabase SQL editor, then run db/seed.sql.

create extension if not exists pgcrypto;

create table if not exists projects (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  status      text not null default 'In progress',
  progress    int  not null default 0 check (progress between 0 and 100),
  share_token text not null unique,
  created_at  timestamptz not null default now()
);

create table if not exists updates (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  body       text not null,
  created_at timestamptz not null default now()
);

create table if not exists approval_items (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects(id) on delete cascade,
  title       text not null,
  detail      text,
  state       text not null default 'pending'
              check (state in ('pending', 'approved', 'changes_requested')),
  client_note text,
  created_at  timestamptz not null default now()
);

create index if not exists updates_project_created_idx
  on updates (project_id, created_at desc);
create index if not exists approval_items_project_state_idx
  on approval_items (project_id, state);

-- RLS ON with NO anon/public policies: the anon (browser) key can read nothing.
-- The app reads server-side with the service-role key, which bypasses RLS, and
-- gates access by the share token in the query (see lib/projects.ts).
alter table projects       enable row level security;
alter table updates        enable row level security;
alter table approval_items enable row level security;
