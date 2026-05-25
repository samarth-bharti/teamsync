import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseSsr";
import { signOut } from "./actions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl px-4 py-8">
      <header className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your projects</h1>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Sign out
          </button>
        </form>
      </header>

      <p className="rounded-lg bg-slate-100 p-4 text-sm text-slate-600">
        Project list and &ldquo;New project&rdquo; are coming in the next step.
      </p>
    </main>
  );
}
