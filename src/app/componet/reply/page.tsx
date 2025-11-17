"use client";
import React, { useEffect, useState } from "react";
import { RefreshCw, Search, Share2, Trash2, Star, Download, X } from "lucide-react";

const API_BASE =  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ReplyType {
  from: string;   // Corrected from from_
  subject: string;
  body: string;
  threadId: string;
}

export default function RepliesUI() {
  const [replies, setReplies] = useState<ReplyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterSender, setFilterSender] = useState("All");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [favorites, setFavorites] = useState<string[]>([]);

  // Fetch replies from backend
  const fetchReplies = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE}/replies?ts=${Date.now()}`);
      if (!res.ok) throw new Error("Failed to fetch replies");

      const data = await res.json();
      console.log("Fetched replies:", data);

      const list: ReplyType[] = Array.isArray(data)
        ? data
        : Array.isArray(data.items)
        ? data.items
        : [];

      setReplies(list);
      localStorage.setItem("replies", JSON.stringify(list));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete one reply
  const handleDelete = async (threadId: string) => {
    try {
      const res = await fetch(`${API_BASE}/replies/${threadId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete reply");

      const updated = replies.filter((r) => r.threadId !== threadId);
      setReplies(updated);
      localStorage.setItem("replies", JSON.stringify(updated));
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Clear all replies
  const handleClearAll = async () => {
    try {
      const res = await fetch(`${API_BASE}/replies`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to clear replies");

      setReplies([]);
      localStorage.removeItem("replies");
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Copy threadId
  const handleCopy = (threadId: string) => {
    navigator.clipboard.writeText(threadId);
    setCopied(threadId);
    setTimeout(() => setCopied(null), 2000);
  };

  // Toggle favorite
  const toggleFavorite = (threadId: string) => {
    let updated;
    if (favorites.includes(threadId)) {
      updated = favorites.filter((id) => id !== threadId);
    } else {
      updated = [...favorites, threadId];
    }
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  // Share reply
  const handleShare = (threadId: string) => {
    const url = `${window.location.origin}/thread/${threadId}`;
    if (navigator.share) {
      navigator
        .share({ title: "Check out this reply thread", text: "Here's an email thread:", url })
        .catch((err) => console.error("Share failed:", err));
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  // Export replies
  const handleExport = (format: "json" | "csv") => {
    if (replies.length === 0) {
      alert("No replies to export!");
      return;
    }

    let dataStr = "", fileName = "";
    if (format === "json") {
      dataStr = JSON.stringify(replies, null, 2);
      fileName = "replies.json";
    } else {
      const headers = "From,Subject,Body,ThreadId\n";
      const rows = replies
        .map(
          (r) =>
            `"${r.from}","${r.subject}","${r.body.replace(/\n/g, " ")}","${r.threadId}"`
        )
        .join("\n");
      dataStr = headers + rows;
      fileName = "replies.csv";
    }

    const blob = new Blob([dataStr], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  // Load saved data on mount
  useEffect(() => {
    const savedReplies = localStorage.getItem("replies");
    if (savedReplies) setReplies(JSON.parse(savedReplies));

    const savedFavs = localStorage.getItem("favorites");
    if (savedFavs) setFavorites(JSON.parse(savedFavs));

    fetchReplies();
  }, []);

  // Filtering + Sorting
  const uniqueSenders = ["All", ...new Set(replies.map((r) => r.from))];
  const filteredReplies = replies
    .filter(
      (r) =>
        (filterSender === "All" || r.from === filterSender) &&
        (r.subject.toLowerCase().includes(search.toLowerCase()) ||
          r.from.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) =>
      sortOrder === "latest"
        ? b.threadId.localeCompare(a.threadId)
        : a.threadId.localeCompare(b.threadId)
    );

  // Render UI
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-6 text-cyan-400 drop-shadow text-center">
        📩 Latest Replies
      </h2>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-3 mb-6 items-center justify-between">
        <div className="flex items-center bg-white/10 backdrop-blur-md px-3 py-2 rounded-lg w-full md:w-1/2 transition">
          <Search className="w-5 h-5 text-gray-300" />
          <input
            type="text"
            placeholder="Search by subject or sender..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-2 bg-transparent outline-none text-white w-full placeholder-gray-400"
          />
        </div>

        <select
          value={filterSender}
          onChange={(e) => setFilterSender(e.target.value)}
          className="px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-lg"
        >
          {uniqueSenders.map((sender, idx) => (
            <option key={idx} value={sender}>
              {sender}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) =>
            setSortOrder(e.target.value as "latest" | "oldest")
          }
          className="px-4 py-2 bg-white/10 text-white rounded-lg"
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
        </select>

        <button
          onClick={fetchReplies}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white transition"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>

        <button
          onClick={() => handleExport("json")}
          className="p-2 rounded-lg hover:bg-white/20 transition"
        >
          <Download className="w-5 h-5 text-cyan-400" />
        </button>

        <button
          onClick={handleClearAll}
          className="p-2 rounded-lg hover:bg-red-600 text-red-400 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Status */}
      {loading && (
        <p className="text-gray-400 animate-pulse text-center">
          Loading replies...
        </p>
      )}
      {error && (
        <p className="text-red-500 bg-red-100 border border-red-400 rounded p-3 text-center">
          Error: {error}
        </p>
      )}
      {!loading && filteredReplies.length === 0 && !error && (
        <p className="text-gray-400 text-center">No replies found.</p>
      )}

      {/* Replies Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredReplies.map((r, idx) => (
          <div
            key={idx}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 flex flex-col"
          >
            {/* Sender */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 flex items-center justify-center rounded-full text-white font-bold shadow-md bg-gradient-to-tr from-cyan-500 to-blue-700">
                {r.from.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-white">{r.from}</p>
                <p className="text-xs text-gray-300">Sender</p>
              </div>
            </div>

            {/* Subject */}
            <h3 className="text-lg font-semibold text-cyan-300 mb-2">{r.subject}</h3>

            {/* Body */}
            <div className="relative flex-1">
              <div
                className={`text-gray-200 text-sm leading-relaxed transition-all duration-300 ${
                  expanded === idx
                    ? "max-h-60 overflow-y-auto"
                    : "max-h-24 overflow-hidden"
                }`}
              >
                {r.body}
              </div>
              {r.body.length > 120 && (
                <button
                  onClick={() => setExpanded(expanded === idx ? null : idx)}
                  className="mt-2 text-cyan-400 hover:text-cyan-200 text-sm font-medium"
                >
                  {expanded === idx ? "Show less ▲" : "Read more ▼"}
                </button>
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-gray-300 border-t border-gray-700 pt-3 gap-2 sm:gap-0">
              <span className="truncate max-w-full sm:max-w-[40%]">Thread ID: {r.threadId}</span>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => toggleFavorite(r.threadId)}
                  className={`p-2 rounded ${
                    favorites.includes(r.threadId)
                      ? "text-yellow-400"
                      : "text-gray-400 hover:text-yellow-400"
                  } transition`}
                >
                  <Star className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleCopy(r.threadId)}
                  className="px-2 py-1 rounded bg-cyan-500 hover:bg-cyan-600 text-white transition text-xs"
                >
                  {copied === r.threadId ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={() => handleShare(r.threadId)}
                  className="p-2 rounded hover:bg-white/20 transition"
                >
                  <Share2 className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => handleDelete(r.threadId)}
                  className="p-2 rounded hover:bg-red-600 text-red-400 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
