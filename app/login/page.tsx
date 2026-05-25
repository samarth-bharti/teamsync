import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseSsr";
import { LoginForm } from "@/components/LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Sign in to teamsync</h1>
      <p className="mb-6 mt-1 text-sm text-slate-500">
        Post project updates and share a no-login status link with your client.
      </p>
      <LoginForm />
    </main>
  );
}
