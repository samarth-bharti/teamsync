import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Lazily-built server client. Construction is deferred (not run at import time) so
// `next build` succeeds without env vars — the dynamic /c/[token] route only calls
// this at request time.
let client: SupabaseClient | null = null;

/**
 * Server-only Supabase client built from the service-role key, which BYPASSES RLS.
 * Never import this into a client component — it must never reach the browser.
 */
export function getSupabaseServer(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set them in .env.local (see .env.example).",
    );
  }

  client = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
