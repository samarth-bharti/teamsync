"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "@/lib/supabaseServer";
import type { ApprovalState } from "@/lib/types";

const ALLOWED: ApprovalState[] = ["approved", "changes_requested"];

/**
 * The client (who has NO account) approves or requests changes on an approval item.
 * Security model: everything is scoped by the share token. We look up the project
 * for the token, then confirm the target item belongs to that project before
 * writing — so a guessed item id from someone else's project can't be touched.
 */
export async function decideApproval(
  token: string,
  itemId: string,
  decision: ApprovalState,
  note: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!token || !itemId) return { ok: false, error: "Missing data." };
  if (!ALLOWED.includes(decision)) {
    return { ok: false, error: "Invalid decision." };
  }

  const supabase = getSupabaseServer();

  const { data: projectData, error: pErr } = await supabase
    .from("projects")
    .select("id")
    .eq("share_token", token)
    .maybeSingle();
  if (pErr) return { ok: false, error: "Lookup failed." };
  const project = projectData as { id: string } | null;
  if (!project) return { ok: false, error: "Project not found." };

  const { data: itemData, error: iErr } = await supabase
    .from("approval_items")
    .select("id, project_id")
    .eq("id", itemId)
    .maybeSingle();
  if (iErr) return { ok: false, error: "Lookup failed." };
  const item = itemData as { id: string; project_id: string } | null;
  if (!item || item.project_id !== project.id) {
    return { ok: false, error: "Item not found." };
  }

  const cleanNote = note.trim().slice(0, 1000) || null;

  const { error: uErr } = await supabase
    .from("approval_items")
    .update({ state: decision, client_note: cleanNote })
    .eq("id", itemId);
  if (uErr) return { ok: false, error: "Could not save." };

  revalidatePath(`/c/${token}`);
  return { ok: true };
}
