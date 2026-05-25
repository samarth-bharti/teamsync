"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseSsr";

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function createProject(formData: FormData) {
  const name = String(formData.get("name") ?? "")
    .trim()
    .slice(0, 120);
  if (!name) return;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Long, crypto-random, URL-safe token — the ONLY thing protecting the client view.
  const shareToken = randomBytes(18).toString("base64url");

  const { data, error } = await supabase
    .from("projects")
    .insert({ name, owner_id: user.id, share_token: shareToken })
    .select("id")
    .single();
  if (error) throw error;

  redirect(`/dashboard/${(data as { id: string }).id}`);
}
