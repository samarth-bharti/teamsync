-- Demo data for local verification. Open: /c/demo-aurora
-- One-shot: re-running adds duplicate updates. Delete the project first to re-seed:
--   delete from projects where share_token = 'demo-aurora';

insert into projects (name, status, progress, share_token)
values ('Aurora Brand Refresh', 'In progress', 60, 'demo-aurora')
on conflict (share_token) do nothing;

with p as (select id from projects where share_token = 'demo-aurora')
insert into updates (project_id, body, created_at)
select p.id, v.body, v.created_at
from p,
  (values
    ('Wireframes for the homepage and pricing page are done and in your inbox.',
     now() - interval '6 days'),
    ('Logo refresh complete — 3 directions ready for you to look at.',
     now() - interval '3 days'),
    ('Started building the homepage in code; aiming for a preview link next week.',
     now() - interval '1 day')
  ) as v(body, created_at);

with p as (select id from projects where share_token = 'demo-aurora')
insert into approval_items (project_id, title, detail, state)
select p.id,
  'Pick a logo direction',
  'Three options are in the shared folder — let me know which to move forward with.',
  'pending'
from p;
