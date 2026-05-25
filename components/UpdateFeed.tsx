import type { Update } from "@/lib/types";
import { formatDate } from "@/lib/format";

export function UpdateFeed({ updates }: { updates: Update[] }) {
  if (updates.length === 0) {
    return <p className="text-sm text-slate-500">No updates yet.</p>;
  }

  return (
    <ol className="space-y-5">
      {updates.map((u) => (
        <li key={u.id} className="border-l-2 border-slate-200 pl-4">
          <time className="block text-xs font-medium uppercase tracking-wide text-slate-400">
            {formatDate(u.createdAt)}
          </time>
          <p className="mt-1 whitespace-pre-line text-slate-800">{u.body}</p>
        </li>
      ))}
    </ol>
  );
}
