const SENTIMENTS = [
  {
    key: "positive",
    label: "Positive",
    icon: "↑",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
  },
  {
    key: "negative",
    label: "Negative",
    icon: "↓",
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/30",
  },
  {
    key: "neutral",
    label: "Neutral",
    icon: "→",
    color: "text-zinc-400",
    bg: "bg-zinc-400/10",
    border: "border-zinc-400/30",
  },
  {
    key: "mixed",
    label: "Mixed",
    icon: "~",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/30",
  },
];

export default function DashboardSummary({ entries }) {
  const total = entries.length;

  const counts = SENTIMENTS.map((s) => ({
    ...s,
    count: entries.filter(
      (e) => e.sentiment?.toLowerCase() === s.key
    ).length,
  }));

  return (
    <section className="mb-8">
      <div className="flex items-baseline gap-3 mb-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Overview
        </h2>
        <span className="text-xs text-zinc-500">
          {total} {total === 1 ? "entry" : "entries"} total
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {counts.map((s) => (
          <div
            key={s.key}
            className={`flex flex-col items-center gap-1 py-5 px-3 rounded-xl border ${s.bg} ${s.border}`}
          >
            <span className={`text-3xl font-bold leading-none ${s.color}`}>
              {s.count}
            </span>
            <span className="text-xs text-zinc-500 font-medium">{s.label}</span>
            {total > 0 && (
              <span className="text-xs text-zinc-600">
                {Math.round((s.count / total) * 100)}%
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
