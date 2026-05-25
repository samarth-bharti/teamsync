"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseSsr";

// Every write goes through the authenticated client, so RLS enforces that the
// project belongs to the logged-in freelancer — we don't have to re-check here.
async function requireClient() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return supabase;
}

export async function updateProjectMeta(projectId: string, formData: FormData) {
  const status = String(formData.get("status") ?? "")
    .trim()
    .slice(0, 60);
  const progress = Math.max(
    0,
    Math.min(100, Math.round(Number(formData.get("progress") ?? 0))),
  );
  const supabase = await requireClient();
  const { error } = await supabase
    .from("projects")
    .update({ status, progress })
    .eq("id", projectId);
  if (error) throw error;
  revalidatePath(`/dashboard/${projectId}`);
}

export async function postUpdate(projectId: string, formData: FormData) {
  const body = String(formData.get("body") ?? "")
    .trim()
    .slice(0, 2000);
  if (!body) return;
  const supabase = await requireClient();
  const { error } = await supabase
    .from("updates")
    .insert({ project_id: projectId, body });
  if (error) throw error;
  revalidatePath(`/dashboard/${projectId}`);
}

export async function raiseApproval(projectId: string, formData: FormData) {
  const title = String(formData.get("title") ?? "")
    .trim()
    .slice(0, 120);
  const detail = String(formData.get("detail") ?? "")
    .trim()
    .slice(0, 1000);
  if (!title) return;
  const supabase = await requireClient();
  const { error } = await supabase
    .from("approval_items")
    .insert({ project_id: projectId, title, detail: detail || null });
  if (error) throw error;
  revalidatePath(`/dashboard/${projectId}`);
}
