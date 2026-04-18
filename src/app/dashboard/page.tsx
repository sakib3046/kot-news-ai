"use client";

import { useCallback, useEffect, useState } from "react";

interface Stats {
  totalArticles: number;
  processedArticles: number;
  postedArticles: number;
  bySource: Array<{ source: string; _count: number }>;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("/api/rss/fetch");
      if (!response.ok) throw new Error("Failed to fetch stats");
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadStats = async () => {
      await fetchStats();
    };
    loadStats();
    const interval = setInterval(loadStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [fetchStats]);

  const triggerRSSFetch = async () => {
    try {
      const response = await fetch("/api/rss/fetch", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || ""}`,
        },
      });
      if (!response.ok) throw new Error("Failed to trigger RSS fetch");
      const data = await response.json();
      console.log("RSS fetch result:", data);
      await fetchStats();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error triggering RSS fetch");
    }
  };

  const triggerProcessing = async () => {
    try {
      const response = await fetch("/api/cron/process", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || ""}`,
        },
      });
      if (!response.ok) throw new Error("Failed to trigger processing");
      const data = await response.json();
      console.log("Processing result:", data);
      await fetchStats();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error triggering processing");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">
          KOT Tech News AI
        </h1>
        <p className="text-slate-400 mb-8">Automated Tech News to Facebook</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={triggerRSSFetch}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            🔄 Fetch RSS Feeds
          </button>
          <button
            onClick={triggerProcessing}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            🚀 Process & Post
          </button>
        </div>

        {loading ? (
          <div className="text-center text-white">Loading...</div>
        ) : error ? (
          <div className="bg-red-900 text-white p-4 rounded-lg">{error}</div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-700 p-6 rounded-lg border border-slate-600">
              <div className="text-slate-400 text-sm mb-2">Total Articles</div>
              <div className="text-3xl font-bold text-white">
                {stats.totalArticles}
              </div>
            </div>
            <div className="bg-slate-700 p-6 rounded-lg border border-slate-600">
              <div className="text-slate-400 text-sm mb-2">
                AI Processed
              </div>
              <div className="text-3xl font-bold text-blue-400">
                {stats.processedArticles}
              </div>
              <div className="text-slate-500 text-xs mt-2">
                {stats.totalArticles > 0
                  ? `${((stats.processedArticles / stats.totalArticles) * 100).toFixed(1)}%`
                  : "0%"}
              </div>
            </div>
            <div className="bg-slate-700 p-6 rounded-lg border border-slate-600">
              <div className="text-slate-400 text-sm mb-2">Posted to FB</div>
              <div className="text-3xl font-bold text-green-400">
                {stats.postedArticles}
              </div>
              <div className="text-slate-500 text-xs mt-2">
                {stats.totalArticles > 0
                  ? `${((stats.postedArticles / stats.totalArticles) * 100).toFixed(1)}%`
                  : "0%"}
              </div>
            </div>
          </div>
        ) : null}

        {stats?.bySource && stats.bySource.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Articles by Source
            </h2>
            <div className="bg-slate-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-800">
                  <tr>
                    <th className="text-left px-6 py-3 text-slate-400">
                      Source
                    </th>
                    <th className="text-right px-6 py-3 text-slate-400">
                      Count
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.bySource.map((source, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-slate-600 hover:bg-slate-600"
                    >
                      <td className="px-6 py-3 text-white">{source.source}</td>
                      <td className="px-6 py-3 text-right text-slate-300">
                        {source._count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
