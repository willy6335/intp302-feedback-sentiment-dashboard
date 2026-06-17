"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardSummary from "./components/DashboardSummary";
import FeedbackForm from "./components/FeedbackForm";
import EntriesList from "./components/EntriesList";

export default function Home() {
  const [entries, setEntries] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch("/api/feedback");
      if (!res.ok) throw new Error(`Failed to load entries (${res.status})`);
      const data = await res.json();
      // Support both { entries: [...] } and a bare array
      setEntries(Array.isArray(data) ? data : (data.entries ?? []));
      setFetchError(null);
    } catch (err) {
      setFetchError(err.message || "Could not load entries.");
    } finally {
      setLoadingEntries(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Sentiment Dashboard
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Powered by Azure AI Language · INTP302 Midterm
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            AI-Assisted
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8">
        {fetchError && (
          <div className="mb-6 flex items-start gap-2 rounded-xl px-4 py-3 text-sm
            bg-red-400/10 border border-red-400/30 text-red-400">
            <span>⚠</span>
            <span>Could not reach the backend: {fetchError}</span>
          </div>
        )}

        <DashboardSummary entries={entries} />
        <FeedbackForm onSubmitSuccess={fetchEntries} />
        <EntriesList entries={entries} loading={loadingEntries} />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-5 text-center flex flex-col gap-1">
        <p className="text-xs text-zinc-500">
          Don Joshua Anil &amp; Willard Sunil · INTP302 · SAIT
        </p>
        <p className="text-xs text-zinc-600 italic">
          AI sentiment results are for decision support only and should not replace human judgment.
        </p>
      </footer>
    </div>
  );
}
