import "server-only";
import { cache } from "react";
import { getSupabaseServer } from "./supabaseServer";
import type { ApprovalItem, ApprovalState, Project, Update } from "./types";

// Row shapes as stored in Postgres (snake_case). We assert these on the query
// results, then map to the camelCase domain types in ./types.
interface ProjectRow {
  id: string;
  name: string;
  status: string;
  progress: number;
  share_token: string;
  created_at: string;
}
interface UpdateRow {
  id: string;
  body: string;
  created_at: string;
}
interface ApprovalItemRow {
  id: string;
  title: string;
  detail: string | null;
  state: ApprovalState;
  client_note: string | null;
  created_at: string;
}

/**
 * Load a project (with its updates and pending approval items) by its public share
 * token. Returns null if no project matches. Wrapped in React `cache` so calling it
 * from both `generateMetadata` and the page only hits the DB once per request.
 */
export const getProjectByToken = cache(
  async (token: string): Promise<Project | null> => {
    const supabase = getSupabaseServer();

    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .select("id, name, status, progress, share_token, created_at")
      .eq("share_token", token)
      .maybeSingle();
    if (projectError) throw projectError;
    if (!projectData) return null;

    const projectRow = projectData as ProjectRow;

    const [updatesRes, itemsRes] = await Promise.all([
      supabase
        .from("updates")
        .select("id, body, created_at")
        .eq("project_id", projectRow.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("approval_items")
        .select("id, title, detail, state, client_note, created_at")
        .eq("project_id", projectRow.id)
        .eq("state", "pending")
        .order("created_at", { ascending: false }),
    ]);
    if (updatesRes.error) throw updatesRes.error;
    if (itemsRes.error) throw itemsRes.error;

    const updateRows = (updatesRes.data ?? []) as UpdateRow[];
    const itemRows = (itemsRes.data ?? []) as ApprovalItemRow[];

    const updates: Update[] = updateRows.map((r) => ({
      id: r.id,
      body: r.body,
      createdAt: r.created_at,
    }));
    const pendingApprovals: ApprovalItem[] = itemRows.map((r) => ({
      id: r.id,
      title: r.title,
      detail: r.detail,
      state: r.state,
      clientNote: r.client_note,
      createdAt: r.created_at,
    }));

    return {
      id: projectRow.id,
      name: projectRow.name,
      status: projectRow.status,
      progress: projectRow.progress,
      shareToken: projectRow.share_token,
      createdAt: projectRow.created_at,
      updates,
      pendingApprovals,
    };
  },
);
