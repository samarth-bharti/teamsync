import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectByToken } from "@/lib/projects";
import { StatusBadge } from "@/components/StatusBadge";
import { ProgressBar } from "@/components/ProgressBar";
import { UpdateFeed } from "@/components/UpdateFeed";
import { ApprovalItemCard } from "@/components/ApprovalItemCard";

// Always render fresh: the client should see the latest status, not a cached page.
export const dynamic = "force-dynamic";

interface PageProps {
  // Next 15: route params are async.
  params: Promise<{ token: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { token } = await params;
  const project = await getProjectByToken(token);
  return { title: project ? `${project.name} — teamsync` : "teamsync" };
}

export default async function ClientProjectPage({ params }: PageProps) {
  const { token } = await params;
  const project = await getProjectByToken(token);
  if (!project) notFound();

  const pending = project.approvals.filter((a) => a.state === "pending");
  const resolved = project.approvals.filter((a) => a.state !== "pending");

  return (
    <main className="mx-auto min-h-screen w-full max-w-xl px-4 py-8 sm:py-12">
      <header className="mb-8">
        <p className="text-sm font-medium text-slate-400">Project status</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          {project.name}
        </h1>
        <div className="mt-3">
          <StatusBadge status={project.status} />
        </div>
      </header>

      <section className="mb-8">
        <ProgressBar value={project.progress} />
      </section>

      {pending.length > 0 ? (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">
            Needs your input
          </h2>
          <div className="space-y-3">
            {pending.map((item) => (
              <ApprovalItemCard key={item.id} item={item} token={token} />
            ))}
          </div>
        </section>
      ) : null}

      {resolved.length > 0 ? (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">
            Your decisions
          </h2>
          <div className="space-y-3">
            {resolved.map((item) => (
              <ApprovalItemCard key={item.id} item={item} token={token} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Updates</h2>
        <UpdateFeed updates={project.updates} />
      </section>

      <footer className="border-t border-slate-100 pt-4 text-center text-xs text-slate-400">
        Shared with you via teamsync
      </footer>
    </main>
  );
}
