export type ApprovalState = "pending" | "approved" | "changes_requested";

export interface Update {
  id: string;
  body: string;
  createdAt: string;
}

export interface ApprovalItem {
  id: string;
  title: string;
  detail: string | null;
  state: ApprovalState;
  clientNote: string | null;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  status: string;
  /** 0–100 */
  progress: number;
  shareToken: string;
  createdAt: string;
  updates: Update[];
  pendingApprovals: ApprovalItem[];
}
