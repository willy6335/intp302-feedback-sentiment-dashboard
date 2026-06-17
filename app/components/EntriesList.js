const SENTIMENT_STYLES = {
  positive: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    icon: "↑",
  },
  negative: {
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
    icon: "↓",
  },
  neutral: {
    color: "text-zinc-400",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/20",
    icon: "→",
  },
  mixed: {
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    icon: "~",
  },
};

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString("en-CA", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function EntriesList({ entries, loading }) {
  if (loading) {
    return (
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
          All Entries
        </h2>
        <p className="text-sm text-zinc-500 py-4">Loading entries…</p>
      </section>
    );
  }

  if (entries.length === 0) {
    return (
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
          All Entries
        </h2>
        <div className="flex flex-col items-center gap-2 py-12 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 text-sm text-center">
          <span className="text-3xl">📋</span>
          <p>No feedback submitted yet.</p>
          <p className="text-xs text-zinc-600">Submit your first entry above to see results here.</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-baseline gap-3 mb-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          All Entries
        </h2>
        <span className="text-xs text-zinc-500">{entries.length} total</span>
      </div>

      <div className="flex flex-col gap-2">
        {entries.map((entry) => {
          const s =
            SENTIMENT_STYLES[entry.sentiment?.toLowerCase()] ??
            SENTIMENT_STYLES.neutral;

          return (
            <div
              key={entry.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 flex flex-col gap-2"
            >
              <div className="flex gap-4 items-start justify-between">
                <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed flex-1">
                  {entry.feedback}
                </p>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${s.color} ${s.bg} border ${s.border}`}
                  >
                    {s.icon} {entry.sentiment}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {(entry.confidenceScore * 100).toFixed(0)}% confidence
                  </span>
                </div>
              </div>
              <span className="text-xs text-zinc-500 opacity-60">
                {formatDate(entry.submittedAt)}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
