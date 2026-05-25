"use client";

import { useState, useTransition } from "react";
import type { ApprovalItem } from "@/lib/types";
import { decideApproval } from "@/app/c/[token]/actions";

// Milestone 2: the client can act. Pending items show Approve / Request-changes
// plus an optional note; once decided, the card re-renders read-only with the
// outcome (the server action revalidates the page, so the freelancer sees it too).
export function ApprovalItemCard({
  item,
  token,
}: {
  item: ApprovalItem;
  token: string;
}) {
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (item.state !== "pending") {
    const approved = item.state === "approved";
    const tone = approved
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : "border-rose-200 bg-rose-50 text-rose-900";
    return (
      <div className={`rounded-xl border p-4 ${tone}`}>
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold">{item.title}</h3>
          <span className="shrink-0 rounded-full bg-white/70 px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ring-current/30">
            {approved ? "Approved" : "Changes requested"}
          </span>
        </div>
        {item.clientNote ? (
          <p className="mt-2 text-sm italic opacity-90">
            &ldquo;{item.clientNote}&rdquo;
          </p>
        ) : null}
      </div>
    );
  }

  function submit(decision: "approved" | "changes_requested") {
    setError(null);
    startTransition(async () => {
      const res = await decideApproval(token, item.id, decision, note);
      if (!res.ok) setError(res.error ?? "Something went wrong.");
    });
  }

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

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note (optional)"
        rows={2}
        disabled={isPending}
        className="mt-3 w-full rounded-lg border border-amber-300 bg-white p-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-amber-400 focus:outline-none disabled:opacity-60"
      />

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => submit("approved")}
          disabled={isPending}
          className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          Approve
        </button>
        <button
          type="button"
          onClick={() => submit("changes_requested")}
          disabled={isPending}
          className="flex-1 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-rose-700 ring-1 ring-inset ring-rose-300 hover:bg-rose-50 disabled:opacity-50"
        >
          Request changes
        </button>
      </div>
      {error ? <p className="mt-2 text-sm text-rose-700">{error}</p> : null}
    </div>
  );
}
