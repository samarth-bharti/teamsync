import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseSsr";
import { StatusBadge } from "@/components/StatusBadge";
import { signOut, createProject } from "./actions";

export const dynamic = "force-dynamic";

interface ProjectRow {
  id: string;
  name: string;
  status: string;
  progress: number;
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("projects")
    .select("id, name, status, progress")
    .order("created_at", { ascending: false });
  const projects = (data ?? []) as ProjectRow[];

  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl px-4 py-8">
      <header className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your projects</h1>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>
        <form action={signOut}>
          <button className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100">
            Sign out
          </button>
        </form>
      </header>

      <form action={createProject} className="mb-8 flex gap-2">
        <input
          name="name"
          required
          maxLength={120}
          placeholder="New project name…"
          className="flex-1 rounded-lg border border-slate-300 p-2.5 text-slate-900 focus:border-blue-500 focus:outline-none"
        />
        <button className="rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700">
          Create
        </button>
      </form>

      {projects.length === 0 ? (
        <p className="rounded-lg bg-slate-100 p-4 text-sm text-slate-600">
          No projects yet — create your first one above.
        </p>
      ) : (
        <ul className="space-y-3">
          {projects.map((p) => (
            <li key={p.id}>
              <Link
                href={`/dashboard/${p.id}`}
                className="block rounded-xl border border-slate-200 p-4 hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-slate-900">{p.name}</span>
                  <StatusBadge status={p.status} />
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {p.progress}% complete
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
