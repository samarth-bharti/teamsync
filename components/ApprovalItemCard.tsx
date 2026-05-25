import type { ApprovalItem } from "@/lib/types";

// Read-only in Milestone 1: the client can SEE what needs their input, but the
// approve / request-changes actions arrive in Milestone 2.
export function ApprovalItemCard({ item }: { item: ApprovalItem }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-amber-900">{item.title}</h3>
        <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-300">
          Awaiting your review
        </span>
      </div>
      {item.detail ? (
        <p className="mt-2 text-sm text-amber-800">{item.detail}</p>
      ) : null}
    </div>
  );
}
