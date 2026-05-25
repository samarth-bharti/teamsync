import { createBrowserClient } from "@supabase/ssr";

// Browser Supabase client (anon key), used by the login form. @supabase/ssr stores
// the session in cookies (not localStorage) so the server can read it for RLS.
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
