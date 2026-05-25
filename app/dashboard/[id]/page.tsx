import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabaseSsr";
import { StatusBadge } from "@/components/StatusBadge";
import { ProgressBar } from "@/components/ProgressBar";
import { UpdateFeed } from "@/components/UpdateFeed";
import { ShareLink } from "@/components/ShareLink";
import { updateProjectMeta, postUpdate, raiseApproval } from "./actions";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none";

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: projectData } = await supabase
    .from("projects")
    .select("id, name, status, progress, share_token")
    .eq("id", id)
    .maybeSingle();
  if (!projectData) notFound();
  const p = projectData as {
    id: string;
    name: string;
    status: string;
    progress: number;
    share_token: string;
  };

  const [{ data: updateData }, { data: itemData }] = await Promise.all([
    supabase
      .from("updates")
      .select("id, body, created_at")
      .eq("project_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("approval_items")
      .select("id, title, detail, state, client_note, created_at")
      .eq("project_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const updateRows = (updateData ?? []) as Array<{
    id: string;
    body: string;
    created_at: string;
  }>;
  const updates = updateRows.map((u) => ({
    id: u.id,
    body: u.body,
    createdAt: u.created_at,
  }));
  const items = (itemData ?? []) as Array<{
    id: string;
    title: string;
    detail: string | null;
    state: string;
    client_note: string | null;
  }>;

  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = host.includes("localhost") ? "http" : "https";
  const shareUrl = `${proto}://${host}/c/${p.share_token}`;

  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl px-4 py-8">
      <Link
        href="/dashboard"
        className="text-sm text-slate-500 hover:text-slate-700"
      >
        ← All projects
      </Link>

      <header className="mb-6 mt-2">
        <h1 className="text-2xl font-bold text-slate-900">{p.name}</h1>
        <div className="mt-2">
          <StatusBadge status={p.status} />
        </div>
        <div className="mt-4">
          <ProgressBar value={p.progress} />
        </div>
      </header>

      <section className="mb-8">
        <h2 className="mb-2 text-sm font-semibold text-slate-700">
          Client link — no login needed
        </h2>
        <ShareLink url={shareUrl} />
      </section>

      <section className="mb-6 rounded-xl border border-slate-200 p-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">
          Status &amp; progress
        </h2>
        <form
          action={updateProjectMeta.bind(null, p.id)}
          className="flex flex-wrap items-end gap-3"
        >
          <label className="min-w-40 flex-1">
            <span className="block text-xs text-slate-500">Status</span>
            <input
              name="status"
              defaultValue={p.status}
              maxLength={60}
              className={inputClass}
            />
          </label>
          <label className="w-28">
            <span className="block text-xs text-slate-500">Progress %</span>
            <input
              name="progress"
              type="number"
              min={0}
              max={100}
              defaultValue={p.progress}
              className={inputClass}
            />
          </label>
          <button className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700">
            Save
          </button>
        </form>
      </section>

      <section className="mb-6 rounded-xl border border-slate-200 p-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">
          Post an update
        </h2>
        <form action={postUpdate.bind(null, p.id)} className="space-y-2">
          <textarea
            name="body"
            rows={2}
            required
            maxLength={2000}
            placeholder="What did you get done?"
            className={inputClass}
          />
          <button className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Post update
          </button>
        </form>
      </section>

      <section className="mb-8 rounded-xl border border-slate-200 p-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">
          Ask the client to approve something
        </h2>
        <form action={raiseApproval.bind(null, p.id)} className="space-y-2">
          <input
            name="title"
            required
            maxLength={120}
            placeholder="e.g. Pick a logo direction"
            className={inputClass}
          />
          <textarea
            name="detail"
            rows={2}
            maxLength={1000}
            placeholder="Optional details"
            className={inputClass}
          />
          <button className="rounded-lg bg-amber-600 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-700">
            Raise item
          </button>
        </form>
      </section>

      {items.length > 0 ? (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">
            Approval items
          </h2>
          <div className="space-y-3">
            {items.map((it) => {
              const label =
                it.state === "approved"
                  ? "Approved"
                  : it.state === "changes_requested"
                    ? "Changes requested"
                    : "Pending";
              const tone =
                it.state === "approved"
                  ? "bg-emerald-100 text-emerald-800"
                  : it.state === "changes_requested"
                    ? "bg-rose-100 text-rose-800"
                    : "bg-amber-100 text-amber-800";
              return (
                <div
                  key={it.id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-slate-900">{it.title}</h3>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${tone}`}
                    >
                      {label}
                    </span>
                  </div>
                  {it.detail ? (
                    <p className="mt-1 text-sm text-slate-600">{it.detail}</p>
                  ) : null}
                  {it.client_note ? (
                    <p className="mt-2 text-sm italic text-slate-700">
                      Client: &ldquo;{it.client_note}&rdquo;
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">
          Update feed
        </h2>
        <UpdateFeed updates={updates} />
      </section>
    </main>
  );
}
