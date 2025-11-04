


"use client";
import jsPDF from "jspdf";
import React, { useEffect, useState } from "react";
import RepliesUI from "../reply/page";
import InboxPredictor from "../predictor/page";
import { Menu, X,  } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

interface Email {
  to: string;
  subject: string;
  body: string;
  threadId: string;
  date?: string;
}

interface Reply {
  from: string;
  subject: string;
  body: string;
  threadId: string;
}

type SidebarOption = "inbox" | "sent" | "replies" | "predictor";

const EmailHistory: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSidebar, setSelectedSidebar] = useState<SidebarOption>("sent");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "unread" | "replied">("all");
  const [selectedEmails, setSelectedEmails] = useState<{ [key: string]: boolean }>({});
  const [sentimentScores, setSentimentScores] = useState<{ [key: string]: string }>({});
  const [summaries, setSummaries] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // ---- Fetch Emails ----
  const fetchEmails = async () => {
    try {
      const res = await fetch(`${API_BASE}/sent`, { credentials: "include" });
      const data = await res.json();
      setEmails(data.items || []);

      const sentiments: any = {};
      const summariesTemp: any = {};

      (data.items || []).forEach((email: Email) => {
        sentiments[email.threadId] = analyzeSentiment(email.body);
        summariesTemp[email.threadId] = generateSummary(email.body);
      });

      setSentimentScores(sentiments);
      setSummaries(summariesTemp);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReplies = async () => {
    try {
      const res = await fetch(`${API_BASE}/replies`, { credentials: "include" });
      const data = await res.json();
      setReplies(data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmails();
    fetchReplies();
  }, []);

  // ---- Helpers ----
  const toggleEmail = (threadId: string) => {
    setExpandedEmail(expandedEmail === threadId ? null : threadId);
  };

  const analyzeSentiment = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes("thank") || lower.includes("great") || lower.includes("appreciate"))
      return "positive";
    if (lower.includes("sorry") || lower.includes("delay") || lower.includes("unfortunately"))
      return "negative";
    return "neutral";
  };

  const generateSummary = (text: string) => {
    const clean = text.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
    const short = clean.split(" ").slice(0, 25).join(" ");
    return short.length > 0 ? `${short}...` : "No content";
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const exportPDF = () => {
    const selected = emails.filter((e) => selectedEmails[e.threadId]);
    if (selected.length === 0) return showToast("Select emails to export", "error");

    const doc = new jsPDF();
    let y = 15;
    doc.setFontSize(16);
    doc.text("📬 MailMorph Export", 10, y);
    y += 10;

    selected.forEach((email) => {
      if (y > 270) {
        doc.addPage();
        y = 10;
      }
      doc.setFontSize(12);
      doc.text(`Subject: ${email.subject}`, 10, y);
      y += 7;
      doc.text(`To: ${email.to}`, 10, y);
      y += 6;
      doc.text(`Sentiment: ${sentimentScores[email.threadId]}`, 10, y);
      y += 6;
      doc.text(`Summary: ${summaries[email.threadId]}`, 10, y);
      y += 8;
      const splitBody = doc.splitTextToSize(email.body, 180);
      doc.text(splitBody, 10, y);
      y += splitBody.length * 5 + 5;
      doc.line(10, y, 200, y);
      y += 8;
    });

    doc.save("MailMorph_Export.pdf");
    showToast("Emails exported to PDF!", "success");
  };

  const deleteSelected = async () => {
    const ids = Object.keys(selectedEmails).filter((id) => selectedEmails[id]);
    if (ids.length === 0) return showToast("Select emails to delete", "error");

    if (!confirm(`Delete ${ids.length} selected email(s)?`)) return;

    setLoading(true);
    try {
      for (const id of ids) {
        const res = await fetch(`${API_BASE}/email/delete/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error(`Failed to delete email ${id}`);
      }
      showToast("Emails deleted successfully!", "success");
      await fetchEmails();
      setSelectedEmails({});
    } catch (err) {
      console.error(err);
      showToast("Error deleting emails!", "error");
    } finally {
      setLoading(false);
    }
  };

  const selectAll = () => {
    const all = emails.reduce((acc, email) => ({ ...acc, [email.threadId]: true }), {});
    setSelectedEmails(all);
  };

  const deselectAll = () => setSelectedEmails({});

  const getFilteredEmails = () => {
    let filtered = emails;
    if (filterType === "unread") filtered = emails.filter((e) => !replies.find((r) => r.threadId === e.threadId));
    if (filterType === "replied") filtered = emails.filter((e) => replies.find((r) => r.threadId === e.threadId));
    if (searchQuery) {
      filtered = filtered.filter(
        (e) =>
          e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.to.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  const getPriority = (subject: string) => {
    const s = subject.toLowerCase();
    if (s.includes("urgent") || s.includes("important")) return "High Priority";
    if (s.includes("reminder")) return "Reminder";
    return "Normal";
  };

  return (
    <div className="pt-16 flex min-h-screen bg-black text-white relative">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-xl shadow-lg transition-all ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-30 w-64 bg-gradient-to-b from-black via-gray-900 to-black border-r border-white/20 p-8 pt-10 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } overflow-y-auto`}
      >
        <h2 className="mt-20 text-2xl font-bold mb-8 text-cyan-400">📬 Dashboard</h2>
        <ul className="space-y-4">
          {["inbox", "sent", "replies", "predictor"].map((option) => (
            <li key={option}>
              <button
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  selectedSidebar === option ? "bg-blue-600/40" : "hover:bg-white/10"
                }`}
                onClick={() => setSelectedSidebar(option as SidebarOption)}
              >
                {option === "inbox"
                  ? "🏠 Inbox"
                  : option === "sent"
                  ? "📩 Sent Emails"
                  : option === "replies"
                  ? "💬 Replies"
                  : "🚀 Predict Inbox"}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Menu */}
      <div className="fixed top-4 left-4 z-40 lg:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-0 lg:ml-64 px-6 py-16">
        {selectedSidebar === "predictor" ? (
          <InboxPredictor />
        ) : selectedSidebar === "replies" ? (
          <RepliesUI />
        ) : (
          <>
            {/* Toolbar */}
            <div className="sticky top-0 z-20 bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 mb-8 flex flex-col lg:flex-row justify-between items-center gap-4 shadow-lg">
              <input
                type="text"
                placeholder="🔍 Search emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 rounded-lg w-full lg:w-1/3 bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none"
              />
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                {["all", "unread", "replied"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type as any)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      filterType === type
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    {type === "all" ? "📩 All" : type === "unread" ? "🆕 Unread" : "✅ Replied"}
                  </button>
                ))}
                <button
                  onClick={selectAll}
                  className="px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-300 rounded-lg text-sm font-semibold"
                >
                  ✅ Select All
                </button>
                <button
                  onClick={deselectAll}
                  className="px-3 py-2 bg-gray-600/20 hover:bg-gray-600/40 text-gray-300 rounded-lg text-sm font-semibold"
                >
                  🚫 Deselect
                </button>
                <button
                  onClick={exportPDF}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold shadow-lg text-sm"
                >
                  📝 Export
                </button>
               
              </div>
            </div>

            {/* Emails List */}
            <h2 className="text-3xl font-extrabold text-center mb-10">
              {selectedSidebar === "inbox" ? "🏠 Inbox" : "📩 Sent Emails"}
            </h2>

            <div className="grid gap-6">
              {getFilteredEmails().slice().reverse().map((email, idx) => {
                const tone = sentimentScores[email.threadId];
                const emailReplies = replies.filter((r) => r.threadId === email.threadId);
                return (
                  <div
                    key={idx}
                    className="relative bg-white/10 border border-white/20 p-6 rounded-2xl shadow-lg hover:scale-[1.01] transition"
                  >
                    <div className="flex justify-between items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!selectedEmails[email.threadId]}
                        onChange={(e) =>
                          setSelectedEmails({
                            ...selectedEmails,
                            [email.threadId]: e.target.checked,
                          })
                        }
                        className="w-4 h-4 accent-cyan-400 cursor-pointer"
                      />
                      <div onClick={() => toggleEmail(email.threadId)} className="flex-1 cursor-pointer">
  <p className="font-bold text-lg truncate">{email.subject}</p>
  <p className="text-sm text-gray-300 truncate">To: {email.to}</p>
  {/* Display date/time here */}
  {email.date && (
    <p className="text-xs text-gray-400 mt-1">
      🕒 {new Date(email.date).toLocaleString()}
    </p>
  )}
  <p className="text-xs text-gray-400 mt-1">🧠 {summaries[email.threadId]}</p>
  <div className="flex items-center gap-3 mt-2">
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
        tone === "positive"
          ? "bg-green-500/20 text-green-300"
          : tone === "negative"
          ? "bg-red-500/20 text-red-300"
          : "bg-gray-500/20 text-gray-300"
      }`}
    >
      {tone.toUpperCase()}
    </span>
    <span className="text-[10px] uppercase tracking-wide text-yellow-300">
      {getPriority(email.subject)}
    </span>
  </div>
</div>

                      <button
                        onClick={() => toggleEmail(email.threadId)}
                        className="text-xl shrink-0"
                      >
                        {expandedEmail === email.threadId ? "▴" : "▾"}
                      </button>
                    </div>

                    {/* Expanded */}
                    {expandedEmail === email.threadId && (
                      <div className="mt-4 border-t border-white/20 pt-4 space-y-3">
                        <p className="text-gray-200 whitespace-pre-line text-sm">{email.body}</p>
                        {emailReplies.length > 0 && (
                          <div className="border-l border-white/20 pl-4">
                            <h4 className="font-semibold mb-2">Replies:</h4>
                            {emailReplies.map((rep, i) => (
                              <div key={i}>
                                <p className="text-xs text-gray-400">
                                  From: {rep.from} | {rep.subject}
                                </p>
                                <p className="whitespace-pre-line text-gray-200 text-sm">{rep.body}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailHistory;
