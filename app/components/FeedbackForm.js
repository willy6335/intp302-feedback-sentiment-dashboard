"use client";

import { useState } from "react";

const SENTIMENT_STYLES = {
  positive: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
  },
  negative: {
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/30",
  },
  neutral: {
    color: "text-zinc-400",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/30",
  },
  mixed: {
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/30",
  },
};

export default function FeedbackForm({ onSubmitSuccess }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const charCount = text.length;
  const tooLong = charCount > 1000;
  const canSubmit = text.trim() && !tooLong && !loading;

  async function handleSubmit() {
    if (!canSubmit) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback: text.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error: ${res.status}`);
      }

      const data = await res.json();
      setResult({
        sentiment: data.entry.sentiment,
        confidence: data.entry.confidenceScore,
      });
      setText("");
      onSubmitSuccess();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const sentimentKey = result?.sentiment?.toLowerCase();
  const styles = SENTIMENT_STYLES[sentimentKey] ?? SENTIMENT_STYLES.neutral;

  return (
    <section className="mb-8">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
        Submit Feedback
      </h2>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="feedback-input"
            className="text-sm text-zinc-500 font-medium"
          >
            Customer feedback text
          </label>
          <textarea
            id="feedback-input"
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
            placeholder="e.g. The service was excellent and the staff were very friendly."
            className={`w-full rounded-lg px-3 py-2.5 text-sm leading-relaxed
              bg-zinc-50 dark:bg-zinc-800
              text-zinc-900 dark:text-zinc-100
              border outline-none resize-y transition-colors
              placeholder:text-zinc-400 dark:placeholder:text-zinc-600
              focus:ring-2 focus:ring-indigo-500/40
              disabled:opacity-50
              ${tooLong
                ? "border-red-400 focus:border-red-400"
                : "border-zinc-200 dark:border-zinc-700 focus:border-indigo-400"
              }`}
          />
        </div>

        <div className="flex items-center justify-between">
          <span
            className={`text-xs ${
              tooLong ? "text-red-400" : "text-zinc-500"
            }`}
          >
            {charCount} / 1000
          </span>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white
              hover:bg-indigo-500 transition-colors
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Analyzing…" : "Analyze Sentiment"}
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg px-4 py-3 text-sm
            bg-red-400/10 border border-red-400/30 text-red-400">
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className={`rounded-lg border px-4 py-4 flex flex-col gap-2 ${styles.bg} ${styles.border}`}>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-500">Sentiment</span>
              <span className={`text-sm font-bold ${styles.color}`}>
                {result.sentiment}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-500">Confidence</span>
              <span className="text-sm font-semibold text-zinc-300">
                {(result.confidence * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-xs text-zinc-500 italic mt-1">
              AI results may not always be accurate. Use alongside human judgment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
