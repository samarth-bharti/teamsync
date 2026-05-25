"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabaseBrowser";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const supabase = createSupabaseBrowserClient();
    const { error } =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-slate-900 focus:border-blue-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-slate-900 focus:border-blue-500 focus:outline-none"
        />
      </div>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
      </button>
      <button
        type="button"
        onClick={() => {
          setMode(mode === "signin" ? "signup" : "signin");
          setError(null);
        }}
        className="w-full text-center text-sm text-slate-500 hover:text-slate-700"
      >
        {mode === "signin"
          ? "No account? Create one"
          : "Have an account? Sign in"}
      </button>
    </form>
  );
}
