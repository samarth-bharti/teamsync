"use client";

import { useState } from "react";

// Shows the client share URL with a one-tap copy button.
export function ShareLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
      <code className="flex-1 truncate text-xs text-slate-700">{url}</code>
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="shrink-0 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
