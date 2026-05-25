# teamsync — Worker Handoff Spec

## Context

We're building **teamsync**: a client-facing project-status tool for freelancers. Decisions made with the user:

- **Niche:** freelancer ↔ client updates (chosen over student groups / deskless / dev standups).
- **Goal:** real users, so the smallest genuinely-useful core that solves one real pain.

**The pain:** Freelancers constantly field "any update?" messages; clients feel in the dark; updates are scattered across email/WhatsApp. Heavy PM tools (Trello, Asana, Notion) assume the client logs in and learns the tool — clients won't. So freelancers fall back to writing manual status emails.

**The insight that makes this winnable:** adoption is asymmetric. Only the freelancer signs up. The client just opens a link — no account, no app. That sidesteps the #1 reason team tools die (the whole team has to switch). **This is the core architectural bet.**

> **Note on roles:** this is greenfield and the worker Claude owns the stack and file structure. This spec fixes the product (what/why), not the architecture (how).

---

## Goal

A dead-simple shared status page for freelancer→client work. The freelancer posts updates and raises items needing client input; the client opens a no-login link to see progress at a glance and act on what's blocking the freelancer.

## Approach

- **Asymmetric adoption (core decision):** freelancer has an account; client accesses via an unguessable shareable link, no login. (Rejected: both sides log in — that's exactly why Trello/Notion fail with clients.)
- **Freelancer side:** sign up → create a project → post short update entries → mark items as "needs client approval/input."
- **Client side (link only, mobile-first):** see project name + current status, a milestone/progress indicator, the update feed, and any pending items — and act on them (approve / request changes + optional note).
- **Adoption test, build to it:** posting an update must be faster than writing an email, and the client view must be readable in 10 seconds on a phone. If a feature doesn't serve those two, it's scope creep.
- **Stack & file structure:** worker's call. Constraints below are product constraints, not architecture.

## Constraints

- Responsive web app, mobile-first (clients open links on phones).
- Client view needs no login — access via unguessable token in the URL.
- Free/cheap to deploy and run. Prefer a lean stack that ships fast over a heavy one.
- It must end up at a real public URL so we can test with an actual freelancer + client.

## Files to touch

- Greenfield — you own the architecture and file layout. Build whatever structure best fits the stack you choose.
- Leave `.claude/commands/execute-plan.md` untouched (it's our worker command).

## Out of scope (v1 — do NOT build these)

- Client accounts/login; teams or multiple freelancers per project.
- Billing/invoicing; file storage / large uploads; real-time chat; threaded comment discussions.
- Native mobile app (responsive web only).
- Integrations (Slack/email sync); a full notifications system (a shareable link is enough for v1).

## Done when

- A freelancer can sign up, create a project, and get a shareable client link.
- The freelancer can post an update and raise an item marked "needs client approval."
- Opening the client link in a fresh browser with no login shows: project name, current status, a progress/milestone indicator, the update feed, and any pending approval items.
- The client can approve or request changes on a pending item (with an optional note), and the freelancer sees the result.
- It looks and works correctly on a phone screen.
- It's deployed to a public URL (or runnable with one documented command) so we can test with a real freelancer + client.

## Risky / irreversible steps

- None expected in a greenfield build. **PAUSE and confirm before:** provisioning paid infrastructure, committing real secrets/API keys, or any action that costs money. Use free tiers only.

---

## Open fork for the user (decide at review)

v1 above includes a light client action loop (approve / request changes), because a pure one-way status page is basically a fancy email and won't feel worth adopting. If you'd rather ship even leaner first, we can cut client actions to view-only and add the approval loop in v2. **Recommendation:** keep the light approval loop — it's the actual wedge ("unblock me faster"), and kept minimal it's cheap.

## Verification (how we'll know it's real, not just demo-ware)

1. Deploy to the public URL.
2. As a freelancer: sign up, create a project, post 2 updates, raise 1 approval item.
3. Open the client link on a phone in a private/incognito window (no login) — confirm everything renders and reads in seconds.
4. As the client: approve one item, request changes on another with a note.
5. Back as freelancer: confirm both client actions are visible.
6. Then put it in front of one real freelancer and one real client and watch where they get stuck.
