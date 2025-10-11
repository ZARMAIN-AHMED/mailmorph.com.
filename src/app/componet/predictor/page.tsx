"use client";
import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function InboxPredictor() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/predict-inbox`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Prediction failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16">
      {/* Title outside the box */}
      <h2 className="text-4xl font-extrabold mb-6 text-center">
        🤖{" "}
        <span className="bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
          AI Inbox Predictor
        </span>
      </h2>

      {/* Main Card */}
      <div className="bg-gradient-to-br from-gray-900 via-black to-indigo-950 rounded-2xl shadow-xl border border-white/10 p-8 relative z-10">
        {/* Inputs */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="✉️ Enter email subject..."
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 
                       text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <textarea
            placeholder="📝 Write your email body here..."
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 
                       text-white placeholder-gray-400 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        {/* Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handlePredict}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 
                       rounded-xl font-semibold shadow-lg transition transform hover:scale-[1.02] 
                       disabled:opacity-60"
          >
            {loading ? "🔍 Analyzing..." : "🚀 Predict Inbox Placement"}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 p-6 bg-black/40 border border-white/10 rounded-xl space-y-3">
            <p className="font-bold text-lg">
              📌 Result:{" "}
              <span
                className={`${
                  result.verdict === "Inbox"
                    ? "text-green-400"
                    : result.verdict === "Promotions"
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {result.verdict}
              </span>
            </p>

            <p className="text-gray-300">⚡ Score: {result.score}</p>

            {result.risky_words?.length > 0 && (
              <div className="text-red-400">
                ⚠️ Risky Words Detected:{" "}
                <span className="font-medium">
                  {result.risky_words.join(", ")}
                </span>
              </div>
            )}

            <p className="italic text-gray-400">
              💡 Suggestion: {result.suggestion}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
