-- teamsync — freelancer-side migration (project ownership + RLS policies).
-- Run this in the Supabase SQL editor AFTER db/schema.sql.
--
-- What it does:
--   1. Adds owner_id to projects so each project belongs to a logged-in freelancer.
--      Nullable + default auth.uid() so the existing demo project (no owner) survives
--      and app inserts auto-stamp the current user.
--   2. Adds RLS policies so an authenticated freelancer can only read/write THEIR OWN
--      data. The browser/anon key still sees nothing; the service_role key (client
--      view + client approve action) still bypasses RLS, so those are unaffected.

-- 1) Ownership column ---------------------------------------------------------
alter table projects
  add column if not exists owner_id uuid
    references auth.users(id) on delete cascade
    default auth.uid();

create index if not exists projects_owner_idx on projects (owner_id);

-- 2) RLS policies for the authenticated freelancer ---------------------------
-- (RLS is already enabled on all three tables in db/schema.sql.)

-- projects: the owner can do everything to their own rows.
drop policy if exists "owner manages own projects" on projects;
create policy "owner manages own projects" on projects
  for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- updates: scoped through the parent project's owner.
drop policy if exists "owner manages own updates" on updates;
create policy "owner manages own updates" on updates
  for all to authenticated
  using (
    exists (
      select 1 from projects p
      where p.id = updates.project_id and p.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from projects p
      where p.id = updates.project_id and p.owner_id = auth.uid()
    )
  );

-- approval_items: same ownership rule through the parent project.
drop policy if exists "owner manages own approvals" on approval_items;
create policy "owner manages own approvals" on approval_items
  for all to authenticated
  using (
    exists (
      select 1 from projects p
      where p.id = approval_items.project_id and p.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from projects p
      where p.id = approval_items.project_id and p.owner_id = auth.uid()
    )
  );
