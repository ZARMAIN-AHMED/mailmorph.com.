// "use client";
// import React, { useEffect, useState, useRef } from "react";

// const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// interface Email {
//   to: string;
//   subject: string;
//   body: string;
//   threadId: string;
// }

// interface Reply {
//   from: string;
//   subject: string;
//   body: string;
//   threadId: string;
// }

// const EmailHistory: React.FC = () => {
//   const [emails, setEmails] = useState<Email[]>([]);
//   const [replies, setReplies] = useState<Reply[]>([]);
//   const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
//   const [loading, setLoading] = useState(false);
//   const [expandedEmail, setExpandedEmail] = useState<string | null>(null);
//   const [generating, setGenerating] = useState<{ [key: string]: boolean }>({});
//   const [notifications, setNotifications] = useState<Reply[]>([]);
//   const audioRef = useRef<HTMLAudioElement>(null);

//   // Fetch sent emails
//   const fetchEmails = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/sent`, { credentials: "include" });
//       const data = await res.json();
//       setEmails(data.items || []);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to fetch emails");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch all replies from backend
//   const fetchReplies = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/replies`, { credentials: "include" });
//       const data = await res.json();
//       setReplies(data.items || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Poll for new replies every 15 seconds
//   const fetchNewReplies = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/replies-latest`, { credentials: "include" });
//       const data = await res.json();
//       if (data.items && data.items.length > 0) {
//         setNotifications((prev) => {
//           const newReplies = data.items.filter(
//             (r: Reply) => !prev.find((p) => p.threadId === r.threadId)
//           );
//           if (newReplies.length > 0 && audioRef.current) {
//             audioRef.current.play(); // play notification sound
//           }
//           // also update main replies state
//           setReplies((prevReplies) => [...prevReplies, ...newReplies]);
//           return [...prev, ...newReplies];
//         });
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchEmails();
//     fetchReplies();
//     const interval = setInterval(fetchNewReplies, 15000);
//     return () => clearInterval(interval);
//   }, []);

//   const toggleEmail = (threadId: string) => {
//     setExpandedEmail(expandedEmail === threadId ? null : threadId);
//   };

//   const handleReply = async (email: Email) => {
//     const reply = replyText[email.threadId];
//     if (!reply) return alert("Type a reply first");
//     try {
//       await fetch(`${API_BASE}/reply`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ threadId: email.threadId, to: email.to, body: reply }),
//       });
//       alert("✅ Reply sent!");
//       setReplyText({ ...replyText, [email.threadId]: "" });
//     } catch (err) {
//       console.error(err);
//       alert("Failed to send reply");
//     }
//   };

//   const generateAIReply = async (email: Email) => {
//     setGenerating({ ...generating, [email.threadId]: true });
//     try {
//       const res = await fetch(`${API_BASE}/generate-reply`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ subject: email.subject, body: email.body, to: email.to }),
//       });
//       const data = await res.json();
//       setReplyText({ ...replyText, [email.threadId]: data.reply });
//     } catch (err) {
//       console.error(err);
//       alert("Failed to generate AI reply");
//     } finally {
//       setGenerating({ ...generating, [email.threadId]: false });
//     }
//   };

//   return (
//     <section className="bg-gray-50 py-20 px-6 min-h-screen">
//       <audio ref={audioRef} src="/notification.mp3" preload="auto" />
//       <div className="max-w-5xl mx-auto">
//         <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-12">
//           📬 Sent Emails
//         </h2>

//         {notifications.length > 0 && (
//           <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-600 rounded">
//             🔔 You have {notifications.length} new reply(ies)!
//           </div>
//         )}

//         {loading && <p className="text-center text-gray-500">Loading emails...</p>}
//         {!loading && emails.length === 0 && (
//           <p className="text-center text-gray-500">No emails sent yet.</p>
//         )}

//         <div className="grid gap-6">
//           {emails
//             .slice() // copy to avoid mutating state
//             .reverse()
//             .map((email, idx) => {
//               const emailReplies = replies.filter((r) => r.threadId === email.threadId);
//               return (
//                 <div
//                   key={idx}
//                   className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition cursor-pointer"
//                 >
//                   {/* Email Summary */}
//                   <div
//                     className="flex justify-between items-center"
//                     onClick={() => toggleEmail(email.threadId)}
//                   >
//                     <div>
//                       <p className="font-semibold text-gray-900 text-lg">{email.subject}</p>
//                       <p className="text-gray-500 text-sm">To: {email.to}</p>
//                     </div>
//                     <div className="text-gray-400">
//                       {expandedEmail === email.threadId ? "▴" : "▾"}
//                     </div>
//                   </div>

//                   {/* Expanded Details */}
//                   {expandedEmail === email.threadId && (
//                     <div className="mt-4 border-t border-gray-200 pt-4 bg-gray-50 rounded-lg">
//                       <p className="text-gray-700 mb-4 whitespace-pre-line">{email.body}</p>

//                       {/* Show replies */}
//                       {emailReplies.length > 0 && (
//                         <div className="mb-4">
//                           <h4 className="font-semibold text-gray-800 mb-2">Replies:</h4>
//                           <div className="space-y-3">
//                             {emailReplies.map((rep, i) => (
//                               <div
//                                 key={i}
//                                 className="p-3 bg-green-50 border border-green-200 rounded-lg"
//                               >
//                                 <p className="text-sm text-gray-500">
//                                   From: {rep.from} | {rep.subject}
//                                 </p>
//                                 <p className="text-gray-800 whitespace-pre-line">{rep.body}</p>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       <textarea
//                         rows={4}
//                         placeholder="Write your reply..."
//                         className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//                         value={replyText[email.threadId] || ""}
//                         onChange={(e) =>
//                           setReplyText({ ...replyText, [email.threadId]: e.target.value })
//                         }
//                       />

//                       <div className="flex gap-4 mt-4">
//                         <button
//                           onClick={() => handleReply(email)}
//                           className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
//                         >
//                           ↩️ Send Reply
//                         </button>
//                         <button
//                           onClick={() => generateAIReply(email)}
//                           className={`flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition ${
//                             generating[email.threadId] ? "opacity-70 cursor-not-allowed" : ""
//                           }`}
//                           disabled={generating[email.threadId]}
//                         >
//                           {generating[email.threadId] ? "Generating..." : "🤖 Generate Reply"}
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//         </div>
//       </div>
//     </section>
//   );
// };












// // export default EmailHistory;
// "use client";
// import jsPDF from "jspdf";
// import React, { useEffect, useState, useRef } from "react";
// import RepliesUI from "../reply/page";
// import InboxPredictor from "../predictor/page";

// const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// interface Email {
//   to: string;
//   subject: string;
//   body: string;
//   threadId: string;
// }

// interface Reply {
//   from: string;
//   subject: string;
//   body: string;
//   threadId: string;
// }

// type Tag = "🔥 Hot Lead" | "⏰ Follow-up" | "❌ No Response";

// const EmailHistory: React.FC = () => {
//   const [emails, setEmails] = useState<Email[]>([]);
//   const [replies, setReplies] = useState<Reply[]>([]);
//   const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
//   const [loading, setLoading] = useState(false);
//   const [expandedEmail, setExpandedEmail] = useState<string | null>(null);
//   const [generating, setGenerating] = useState<{ [key: string]: boolean }>({});
//   const [notifications, setNotifications] = useState<Reply[]>([]);
//   const [filterType, setFilterType] = useState<"all" | "unread" | "replied">("all");
//   const [typingReply, setTypingReply] = useState<{ [key: string]: string }>({});
//   const [sentimentScores, setSentimentScores] = useState<{ [key: string]: string }>({});
//   const [searchQuery, setSearchQuery] = useState("");
//   const [emailTags, setEmailTags] = useState<{ [key: string]: Tag[] }>({});
//   const [selectedEmails, setSelectedEmails] = useState<{ [key: string]: boolean }>({});
//   const audioRef = useRef<HTMLAudioElement>(null);

//   // ---- Fetch Emails & Replies ----
//   const fetchEmails = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/sent`, { credentials: "include" });
//       const data = await res.json();
//       setEmails(data.items || []);
//       const sentiments: any = {};
//       (data.items || []).forEach((email: Email) => {
//         sentiments[email.threadId] = analyzeSentiment(email.body);
//       });
//       setSentimentScores(sentiments);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchReplies = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/replies`, { credentials: "include" });
//       const data = await res.json();
//       setReplies(data.items || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchEmails();
//     fetchReplies();
//   }, []);

//   // ---- Helper Functions ----
//   const toggleEmail = (threadId: string) => {
//     setExpandedEmail(expandedEmail === threadId ? null : threadId);
//   };

//   const analyzeSentiment = (text: string) => {
//     const lower = text.toLowerCase();
//     if (lower.includes("thank") || lower.includes("good") || lower.includes("great")) return "positive";
//     if (lower.includes("sorry") || lower.includes("unfortunately") || lower.includes("bad")) return "negative";
//     return "neutral";
//   };

//   const exportSelectedPDF = () => {
//     const doc = new jsPDF();
//     let y = 10;
//     emails.forEach((email) => {
//       if (selectedEmails[email.threadId]) {
//         doc.text(`Subject: ${email.subject}`, 10, y); y += 8;
//         doc.text(`To: ${email.to}`, 10, y); y += 8;
//         doc.text(`Body: ${email.body}`, 10, y); y += 12;
//       }
//     });
//     doc.save("emails.pdf");
//   };

//   const getFilteredEmails = () => {
//     let filtered = emails;
//     if (filterType === "unread") filtered = emails.filter((e) => !replies.find((r) => r.threadId === e.threadId));
//     if (filterType === "replied") filtered = emails.filter((e) => replies.find((r) => r.threadId === e.threadId));
//     if (searchQuery) {
//       filtered = filtered.filter((e) =>
//         e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         e.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         e.to.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
//     return filtered;
//   };

//   // ---- UI ----
//   return (
//     <section className="relative min-h-screen bg-black text-white">
//       {/* Background Gradient + Blur */}
//       <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-black to-purple-900 opacity-80"></div>
//       <div className="absolute inset-0 bg-[url('/bg-noise.png')] opacity-20 mix-blend-overlay"></div>

//       <div className="relative max-w-7xl mx-auto px-6 py-20">
//         <h2 className="text-4xl font-extrabold text-center mb-10">
//           📬 Sent Emails Dashboard
//         </h2>

//         {/* Search + Filters */}
//         <div className="sticky top-0 z-20 bg-black/50 backdrop-blur-lg border border-white/10 rounded-2xl px-6 py-4 mb-10 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg">
//           <input
//             type="text"
//             placeholder="🔍 Search emails..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="px-4 py-2 rounded-lg w-full md:w-1/3 bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none"
//           />
//           <div className="flex gap-3">
//             {["all", "unread", "replied"].map((type) => (
//               <button
//                 key={type}
//                 onClick={() => setFilterType(type as any)}
//                 className={`px-4 py-2 rounded-full font-medium transition ${
//                   filterType === type
//                     ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
//                     : "bg-white/10 text-gray-300 hover:bg-white/20"
//                 }`}
//               >
//                 {type === "all" ? "📩 All" : type === "unread" ? "🆕 Unread" : "✅ Replied"}
//               </button>
//             ))}
//             <button
//               onClick={exportSelectedPDF}
//               className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold shadow-lg"
//             >
//               📝 Export PDF
//             </button>
//           </div>
//         </div>

//         {loading && <p className="text-center text-gray-300">Loading emails...</p>}
//         {!loading && emails.length === 0 && <p className="text-center text-gray-400">No emails sent yet.</p>}

//         {/* Email Cards */}
//         <div className="grid gap-8">
//           {getFilteredEmails().slice().reverse().map((email, idx) => {
//             const emailReplies = replies.filter((r) => r.threadId === email.threadId);
//             return (
//               <div
//                 key={idx}
//                 className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-lg hover:scale-[1.01] transition"
//               >
//                 {/* Checkbox */}
//                 <input
//                   type="checkbox"
//                   checked={selectedEmails[email.threadId] || false}
//                   onChange={() =>
//                     setSelectedEmails((prev) => ({ ...prev, [email.threadId]: !prev[email.threadId] }))
//                   }
//                   className="absolute top-4 right-4 w-5 h-5"
//                 />

//                 {/* Header */}
//                 <div
//                   className="flex justify-between items-center cursor-pointer"
//                   onClick={() => toggleEmail(email.threadId)}
//                 >
//                   <div>
//                     <p className="font-bold text-lg">{email.subject}</p>
//                     <p className="text-sm text-gray-300">To: {email.to}</p>
//                     <span
//                       className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
//                         sentimentScores[email.threadId] === "positive"
//                           ? "bg-green-500/20 text-green-300"
//                           : sentimentScores[email.threadId] === "negative"
//                           ? "bg-red-500/20 text-red-300"
//                           : "bg-gray-500/20 text-gray-300"
//                       }`}
//                     >
//                       {sentimentScores[email.threadId]?.toUpperCase()}
//                     </span>
//                   </div>
//                   <div className="text-2xl">{expandedEmail === email.threadId ? "▴" : "▾"}</div>
//                 </div>

//                 {/* Tags */}
//                 <div className="mt-3 flex gap-2 flex-wrap">
//                   {(["🔥 Hot Lead", "⏰ Follow-up", "❌ No Response"] as Tag[]).map((tag) => (
//                     <button
//                       key={tag}
//                       onClick={() =>
//                         setEmailTags((prev) => {
//                           const current = prev[email.threadId] || [];
//                           if (current.includes(tag)) return { ...prev, [email.threadId]: current.filter((t) => t !== tag) };
//                           return { ...prev, [email.threadId]: [...current, tag] };
//                         })
//                       }
//                       className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
//                         emailTags[email.threadId]?.includes(tag)
//                           ? "bg-yellow-500/30 border-yellow-400 text-yellow-200"
//                           : "bg-white/10 border-white/20 text-gray-300 hover:bg-white/20"
//                       }`}
//                     >
//                       {tag}
//                     </button>
//                   ))}
//                 </div>

//                 {/* Expanded Email */}
//                 {expandedEmail === email.threadId && (
//                   <div className="mt-4 border-t border-white/20 pt-4">
//                     <p className="mb-4 text-gray-200 whitespace-pre-line">{email.body}</p>

//                     {/* Replies */}
//                     {emailReplies.length > 0 && (
//                       <div className="mb-4">
//                         <h4 className="font-semibold mb-2">Replies:</h4>
//                         <div className="relative border-l border-white/20 pl-4 space-y-4">
//                           {emailReplies.map((rep, i) => (
//                             <div key={i} className="relative">
//                               <div className="absolute -left-2 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
//                               <p className="text-sm text-gray-400">From: {rep.from} | {rep.subject}</p>
//                               <p className="whitespace-pre-line text-gray-200">{rep.body}</p>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* Reply Box */}
//                     <textarea
//                       rows={4}
//                       placeholder="Write your reply..."
//                       className="w-full border border-white/20 bg-black/30 text-white rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                       value={typingReply[email.threadId] || replyText[email.threadId] || ""}
//                       onChange={(e) =>
//                         setReplyText({ ...replyText, [email.threadId]: e.target.value })
//                       }
//                     />
//                     <div className="flex gap-4 mt-4">
//                       <button
//                         className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:opacity-90"
//                       >
//                         ↩️ Send Reply
//                       </button>
//                       <button
//                         className={`flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium shadow ${
//                           generating[email.threadId] ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
//                         }`}
//                       >
//                         {generating[email.threadId] ? "Generating..." : "🤖 Generate Reply"}
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       <RepliesUI />
//       <InboxPredictor/>
//     </section>
//   );
// };

// export default EmailHistory;



// // export default EmailHistory;
// "use client";
// import jsPDF from "jspdf";
// import React, { useEffect, useState, useRef } from "react";
// import RepliesUI from "../reply/page";
// import InboxPredictor from "../predictor/page";

// const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// interface Email {
//   to: string;
//   subject: string;
//   body: string;
//   threadId: string;
// }

// interface Reply {
//   from: string;
//   subject: string;
//   body: string;
//   threadId: string;
// }

// type Tag = "🔥 Hot Lead" | "⏰ Follow-up" | "❌ No Response";

// const EmailHistory: React.FC = () => {
//   const [emails, setEmails] = useState<Email[]>([]);
//   const [replies, setReplies] = useState<Reply[]>([]);
//   const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
//   const [loading, setLoading] = useState(false);
//   const [expandedEmail, setExpandedEmail] = useState<string | null>(null);
//   const [generating, setGenerating] = useState<{ [key: string]: boolean }>({});
//   const [notifications, setNotifications] = useState<Reply[]>([]);
//   const [filterType, setFilterType] = useState<"all" | "unread" | "replied">("all");
//   const [typingReply, setTypingReply] = useState<{ [key: string]: string }>({});
//   const [sentimentScores, setSentimentScores] = useState<{ [key: string]: string }>({});
//   const [searchQuery, setSearchQuery] = useState("");
//   const [emailTags, setEmailTags] = useState<{ [key: string]: Tag[] }>({});
//   const [selectedEmails, setSelectedEmails] = useState<{ [key: string]: boolean }>({});
//   const audioRef = useRef<HTMLAudioElement>(null);

//   // ---- Fetch Emails & Replies ----
//   const fetchEmails = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/sent`, { credentials: "include" });
//       const data = await res.json();
//       setEmails(data.items || []);
//       const sentiments: any = {};
//       (data.items || []).forEach((email: Email) => {
//         sentiments[email.threadId] = analyzeSentiment(email.body);
//       });
//       setSentimentScores(sentiments);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchReplies = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/replies`, { credentials: "include" });
//       const data = await res.json();
//       setReplies(data.items || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchEmails();
//     fetchReplies();
//   }, []);

//   // ---- Helper Functions ----
//   const toggleEmail = (threadId: string) => {
//     setExpandedEmail(expandedEmail === threadId ? null : threadId);
//   };

//   const analyzeSentiment = (text: string) => {
//     const lower = text.toLowerCase();
//     if (lower.includes("thank") || lower.includes("good") || lower.includes("great")) return "positive";
//     if (lower.includes("sorry") || lower.includes("unfortunately") || lower.includes("bad")) return "negative";
//     return "neutral";
//   };

//   const exportSelectedPDF = () => {
//     const doc = new jsPDF();
//     let y = 10;
//     emails.forEach((email) => {
//       if (selectedEmails[email.threadId]) {
//         doc.text(`Subject: ${email.subject}`, 10, y); y += 8;
//         doc.text(`To: ${email.to}`, 10, y); y += 8;
//         doc.text(`Body: ${email.body}`, 10, y); y += 12;
//       }
//     });
//     doc.save("emails.pdf");
//   };

//   const getFilteredEmails = () => {
//     let filtered = emails;
//     if (filterType === "unread") filtered = emails.filter((e) => !replies.find((r) => r.threadId === e.threadId));
//     if (filterType === "replied") filtered = emails.filter((e) => replies.find((r) => r.threadId === e.threadId));
//     if (searchQuery) {
//       filtered = filtered.filter((e) =>
//         e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         e.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         e.to.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
//     return filtered;
//   };

//   // ---- UI ----
//   return (
//     <section className="relative min-h-screen bg-black text-white">
//       {/* Background Gradient + Blur */}
//       <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-black to-purple-900 opacity-80"></div>
//       <div className="absolute inset-0 bg-[url('/bg-noise.png')] opacity-20 mix-blend-overlay"></div>

//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
//         <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 sm:mb-10">
//           📬 Sent Emails Dashboard
//         </h2>

//         {/* Search + Filters */}
//         <div className="sticky top-0 z-20 bg-black/50 backdrop-blur-lg border border-white/10 rounded-2xl px-4 sm:px-6 py-4 mb-8 flex flex-col lg:flex-row justify-between items-center gap-4 shadow-lg">
//           <input
//             type="text"
//             placeholder="🔍 Search emails..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="px-4 py-2 rounded-lg w-full lg:w-1/3 bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none"
//           />
//           <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
//             {["all", "unread", "replied"].map((type) => (
//               <button
//                 key={type}
//                 onClick={() => setFilterType(type as any)}
//                 className={`px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base font-medium transition ${
//                   filterType === type
//                     ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
//                     : "bg-white/10 text-gray-300 hover:bg-white/20"
//                 }`}
//               >
//                 {type === "all" ? "📩 All" : type === "unread" ? "🆕 Unread" : "✅ Replied"}
//               </button>
//             ))}
//             <button
//               onClick={exportSelectedPDF}
//               className="px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold shadow-lg text-sm sm:text-base"
//             >
//               📝 Export PDF
//             </button>
//           </div>
//         </div>

//         {loading && <p className="text-center text-gray-300">Loading emails...</p>}
//         {!loading && emails.length === 0 && <p className="text-center text-gray-400">No emails sent yet.</p>}

//         {/* Email Cards */}
//         <div className="grid gap-6 sm:gap-8">
//           {getFilteredEmails().slice().reverse().map((email, idx) => {
//             const emailReplies = replies.filter((r) => r.threadId === email.threadId);
//             return (
//               <div
//                 key={idx}
//                 className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-4 sm:p-6 rounded-2xl shadow-lg hover:scale-[1.01] transition"
//               >
//                 {/* Checkbox */}
//                 <input
//                   type="checkbox"
//                   checked={selectedEmails[email.threadId] || false}
//                   onChange={() =>
//                     setSelectedEmails((prev) => ({ ...prev, [email.threadId]: !prev[email.threadId] }))
//                   }
//                   className="absolute top-4 right-4 w-4 h-4 sm:w-5 sm:h-5"
//                 />

//                 {/* Header */}
//                 <div
//                   className="flex justify-between items-center cursor-pointer gap-2"
//                   onClick={() => toggleEmail(email.threadId)}
//                 >
//                   <div className="flex-1 min-w-0">
//                     <p className="font-bold text-base sm:text-lg truncate">{email.subject}</p>
//                     <p className="text-xs sm:text-sm text-gray-300 truncate">To: {email.to}</p>
//                     <span
//                       className={`inline-block mt-2 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold ${
//                         sentimentScores[email.threadId] === "positive"
//                           ? "bg-green-500/20 text-green-300"
//                           : sentimentScores[email.threadId] === "negative"
//                           ? "bg-red-500/20 text-red-300"
//                           : "bg-gray-500/20 text-gray-300"
//                       }`}
//                     >
//                       {sentimentScores[email.threadId]?.toUpperCase()}
//                     </span>
//                   </div>
//                   <div className="text-xl sm:text-2xl shrink-0">
//                     {expandedEmail === email.threadId ? "▴" : "▾"}
//                   </div>
//                 </div>

//                 {/* Tags */}
//                 <div className="mt-3 flex gap-2 flex-wrap">
//                   {(["🔥 Hot Lead", "⏰ Follow-up", "❌ No Response"] as Tag[]).map((tag) => (
//                     <button
//                       key={tag}
//                       onClick={() =>
//                         setEmailTags((prev) => {
//                           const current = prev[email.threadId] || [];
//                           if (current.includes(tag)) return { ...prev, [email.threadId]: current.filter((t) => t !== tag) };
//                           return { ...prev, [email.threadId]: [...current, tag] };
//                         })
//                       }
//                       className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold border transition ${
//                         emailTags[email.threadId]?.includes(tag)
//                           ? "bg-yellow-500/30 border-yellow-400 text-yellow-200"
//                           : "bg-white/10 border-white/20 text-gray-300 hover:bg-white/20"
//                       }`}
//                     >
//                       {tag}
//                     </button>
//                   ))}
//                 </div>

//                 {/* Expanded Email */}
//                 {expandedEmail === email.threadId && (
//                   <div className="mt-4 border-t border-white/20 pt-4">
//                     <p className="mb-4 text-gray-200 whitespace-pre-line text-sm sm:text-base">
//                       {email.body}
//                     </p>

//                     {/* Replies */}
//                     {emailReplies.length > 0 && (
//                       <div className="mb-4">
//                         <h4 className="font-semibold mb-2">Replies:</h4>
//                         <div className="relative border-l border-white/20 pl-4 space-y-4">
//                           {emailReplies.map((rep, i) => (
//                             <div key={i} className="relative">
//                               <div className="absolute -left-2 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white"></div>
//                               <p className="text-xs sm:text-sm text-gray-400">From: {rep.from} | {rep.subject}</p>
//                               <p className="whitespace-pre-line text-gray-200 text-sm sm:text-base">{rep.body}</p>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* Reply Box */}
//                     <textarea
//                       rows={4}
//                       placeholder="Write your reply..."
//                       className="w-full border border-white/20 bg-black/30 text-white rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
//                       value={typingReply[email.threadId] || replyText[email.threadId] || ""}
//                       onChange={(e) =>
//                         setReplyText({ ...replyText, [email.threadId]: e.target.value })
//                       }
//                     />
//                     <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
//                       <button
//                         className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:opacity-90 text-sm sm:text-base"
//                       >
//                         ↩️ Send Reply
//                       </button>
//                       <button
//                         className={`flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium shadow text-sm sm:text-base ${
//                           generating[email.threadId] ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
//                         }`}
//                       >
//                         {generating[email.threadId] ? "Generating..." : "🤖 Generate Reply"}
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Extra Modules */}
//       <RepliesUI />
//       <InboxPredictor/>
//     </section>
//   );
// };

// export default EmailHistory;


// "use client";
// import jsPDF from "jspdf";
// import React, { useEffect, useState } from "react";
// import RepliesUI from "../reply/page";
// import InboxPredictor from "../predictor/page";
// import { Menu, X } from "lucide-react";

// const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// interface Email {
//   to: string;
//   subject: string;
//   body: string;
//   threadId: string;
// }

// interface Reply {
//   from: string;
//   subject: string;
//   body: string;
//   threadId: string;
// }

// type Tag = "🔥 Hot Lead" | "⏰ Follow-up" | "❌ No Response";
// type SidebarOption = "inbox" | "sent" | "replies" | "predictor";

// const EmailHistory: React.FC = () => {
//   const [emails, setEmails] = useState<Email[]>([]);
//   const [replies, setReplies] = useState<Reply[]>([]);
//   const [expandedEmail, setExpandedEmail] = useState<string | null>(null);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [selectedSidebar, setSelectedSidebar] = useState<SidebarOption>("sent");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterType, setFilterType] = useState<"all" | "unread" | "replied">("all");
//   const [emailTags, setEmailTags] = useState<{ [key: string]: Tag[] }>({});
//   const [selectedEmails, setSelectedEmails] = useState<{ [key: string]: boolean }>({});
//   const [typingReply, setTypingReply] = useState<{ [key: string]: string }>({});
//   const [generating, setGenerating] = useState<{ [key: string]: boolean }>({});
//   const [sentimentScores, setSentimentScores] = useState<{ [key: string]: string }>({});

//   // ---- Fetch Emails & Replies ----
//   const fetchEmails = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/sent`, { credentials: "include" });
//       const data = await res.json();
//       setEmails(data.items || []);
//       const sentiments: any = {};
//       (data.items || []).forEach((email: Email) => {
//         sentiments[email.threadId] = analyzeSentiment(email.body);
//       });
//       setSentimentScores(sentiments);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchReplies = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/replies`, { credentials: "include" });
//       const data = await res.json();
//       setReplies(data.items || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchEmails();
//     fetchReplies();
//   }, []);

//   // ---- Helper Functions ----
//   const toggleEmail = (threadId: string) => {
//     setExpandedEmail(expandedEmail === threadId ? null : threadId);
//   };

//   const analyzeSentiment = (text: string) => {
//     const lower = text.toLowerCase();
//     if (lower.includes("thank") || lower.includes("good") || lower.includes("great")) return "positive";
//     if (lower.includes("sorry") || lower.includes("unfortunately") || lower.includes("bad")) return "negative";
//     return "neutral";
//   };

//   const exportPDF = () => {
//     const doc = new jsPDF();
//     let y = 10;
//     emails.forEach((email) => {
//       if (selectedEmails[email.threadId]) {
//         doc.text(`Subject: ${email.subject}`, 10, y); y += 8;
//         doc.text(`To: ${email.to}`, 10, y); y += 8;
//         doc.text(`Body: ${email.body}`, 10, y); y += 12;
//       }
//     });
//     doc.save("emails.pdf");
//   };

//   const getFilteredEmails = () => {
//     let filtered = emails;
//     if (filterType === "unread") filtered = emails.filter((e) => !replies.find((r) => r.threadId === e.threadId));
//     if (filterType === "replied") filtered = emails.filter((e) => replies.find((r) => r.threadId === e.threadId));
//     if (searchQuery) {
//       filtered = filtered.filter(
//         (e) =>
//           e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           e.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           e.to.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
//     return filtered;
//   };

//   const getContentForSidebar = () => {
//     switch (selectedSidebar) {
//       case "inbox":
//       case "sent":
//         return getFilteredEmails();
//       case "replies":
//         return replies;
//       case "predictor":
//         return [];
//       default:
//         return getFilteredEmails();
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-black text-white">
//       {/* Sidebar */}
//       <div
//         className={`fixed inset-y-0 left-0 z-30 w-64 bg-black/90 backdrop-blur-lg border-r border-white/20 p-6 transform transition-transform duration-300 lg:translate-x-0 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <h2 className="text-2xl font-bold mb-8 text-cyan-400">📬 Dashboard</h2>
//         <ul className="space-y-4">
//           {["inbox", "sent", "replies", "predictor"].map((option) => (
//             <li key={option}>
//               <button
//                 className={`w-full text-left px-4 py-2 rounded-lg transition ${
//                   selectedSidebar === option ? "bg-blue-600/40" : "hover:bg-white/10"
//                 }`}
//                 onClick={() => setSelectedSidebar(option as SidebarOption)}
//               >
//                 {option === "inbox"
//                   ? "🏠 Inbox"
//                   : option === "sent"
//                   ? "📩 Sent Emails"
//                   : option === "replies"
//                   ? "💬 Replies"
//                   : "🚀 Predict Inbox"}
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Mobile hamburger */}
//       <div className="fixed top-4 left-4 z-40 lg:hidden">
//         <button
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition"
//         >
//           {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//         </button>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 ml-0 lg:ml-64 relative z-10 px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
//         {selectedSidebar === "predictor" ? (
//           <InboxPredictor />
//         ) : selectedSidebar === "replies" ? (
//           <div>
//             <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 sm:mb-10">
//               💬 Replies
//             </h2>
//             <div className="space-y-6">
//               {replies.slice().reverse().map((rep, idx) => (
//                 <div key={idx} className="bg-white/10 p-4 rounded-xl shadow hover:scale-[1.01] transition">
//                   <p className="text-sm sm:text-base text-gray-300">
//                     <strong>From:</strong> {rep.from} | <strong>Subject:</strong> {rep.subject}
//                   </p>
//                   <p className="text-gray-200 mt-2 whitespace-pre-line">{rep.body}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div>
//             {/* Search & Filters */}
//             <div className="sticky top-0 z-20 bg-black/50 backdrop-blur-lg border border-white/10 rounded-2xl px-4 sm:px-6 py-4 mb-8 flex flex-col lg:flex-row justify-between items-center gap-4 shadow-lg">
//               <input
//                 type="text"
//                 placeholder="🔍 Search emails..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="px-4 py-2 rounded-lg w-full lg:w-1/3 bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none"
//               />
//               <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
//                 {["all", "unread", "replied"].map((type) => (
//                   <button
//                     key={type}
//                     onClick={() => setFilterType(type as any)}
//                     className={`px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base font-medium transition ${
//                       filterType === type
//                         ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
//                         : "bg-white/10 text-gray-300 hover:bg-white/20"
//                     }`}
//                   >
//                     {type === "all" ? "📩 All" : type === "unread" ? "🆕 Unread" : "✅ Replied"}
//                   </button>
//                 ))}
//                 <button
//                   onClick={exportPDF}
//                   className="px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold shadow-lg text-sm sm:text-base"
//                 >
//                   📝 Export PDF
//                 </button>
//               </div>
//             </div>

//             {/* Emails */}
//             <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 sm:mb-10">
//               {selectedSidebar === "inbox" ? "🏠 Inbox" : "📩 Sent Emails"}
//             </h2>
//             <div className="grid gap-6 sm:gap-8">
//               {getContentForSidebar().slice().reverse().map((email: any, idx: number) => {
//                 const emailReplies = replies.filter((r) => r.threadId === email.threadId);
//                 return (
//                   <div
//                     key={idx}
//                     className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-4 sm:p-6 rounded-2xl shadow-lg hover:scale-[1.01] transition"
//                   >
//                     <div className="flex justify-between items-center cursor-pointer gap-2">
//                       <div className="flex-1 min-w-0">
//                         <p className="font-bold text-base sm:text-lg truncate">{email.subject}</p>
//                         <p className="text-xs sm:text-sm text-gray-300 truncate">To: {email.to}</p>
//                         <span
//                           className={`inline-block mt-2 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold ${
//                             sentimentScores[email.threadId] === "positive"
//                               ? "bg-green-500/20 text-green-300"
//                               : sentimentScores[email.threadId] === "negative"
//                               ? "bg-red-500/20 text-red-300"
//                               : "bg-gray-500/20 text-gray-300"
//                           }`}
//                         >
//                           {sentimentScores[email.threadId]?.toUpperCase()}
//                         </span>
//                       </div>
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => toggleEmail(email.threadId)}
//                           className="text-xl sm:text-2xl shrink-0"
//                         >
//                           {expandedEmail === email.threadId ? "▴" : "▾"}
//                         </button>
//                       </div>
//                     </div>

//                     {/* Tags */}
//                     <div className="mt-3 flex gap-2 flex-wrap">
//                       {(["🔥 Hot Lead", "⏰ Follow-up", "❌ No Response"] as Tag[]).map((tag) => (
//                         <button
//                           key={tag}
//                           onClick={() =>
//                             setEmailTags((prev) => {
//                               const current = prev[email.threadId] || [];
//                               if (current.includes(tag)) return { ...prev, [email.threadId]: current.filter((t) => t !== tag) };
//                               return { ...prev, [email.threadId]: [...current, tag] };
//                             })
//                           }
//                           className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold border transition ${
//                             emailTags[email.threadId]?.includes(tag)
//                               ? "bg-yellow-500/30 border-yellow-400 text-yellow-200"
//                               : "bg-white/10 border-white/20 text-gray-300 hover:bg-white/20"
//                           }`}
//                         >
//                           {tag}
//                         </button>
//                       ))}
//                     </div>

//                     {/* Expanded Content */}
//                     {expandedEmail === email.threadId && (
//                       <div className="mt-4 border-t border-white/20 pt-4 space-y-4">
//                         <p className="text-gray-200 whitespace-pre-line text-sm sm:text-base">{email.body}</p>

//                         {emailReplies.length > 0 && (
//                           <div className="mb-4">
//                             <h4 className="font-semibold mb-2">Replies:</h4>
//                             <div className="relative border-l border-white/20 pl-4 space-y-4">
//                               {emailReplies.map((rep, i) => (
//                                 <div key={i} className="relative">
//                                   <div className="absolute -left-2 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white"></div>
//                                   <p className="text-xs sm:text-sm text-gray-400">
//                                     From: {rep.from} | {rep.subject}
//                                   </p>
//                                   <p className="whitespace-pre-line text-gray-200 text-sm sm:text-base">{rep.body}</p>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}

//                         {/* Reply Box */}
//                         <textarea
//                           rows={4}
//                           placeholder="Write your reply..."
//                           className="w-full border border-white/20 bg-black/30 text-white rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
//                           value={typingReply[email.threadId] || ""}
//                           onChange={(e) =>
//                             setTypingReply({ ...typingReply, [email.threadId]: e.target.value })
//                           }
//                         />
//                         <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
//                           <button
//                             className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:opacity-90 text-sm sm:text-base"
//                           >
//                             ↩️ Send Reply
//                           </button>
//                           <button
//                             className={`flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium shadow text-sm sm:text-base ${
//                               generating[email.threadId] ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
//                             }`}
//                           >
//                             {generating[email.threadId] ? "Generating..." : "🤖 Generate Reply"}
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//         {/* Extra Modules */}
       
//       </div>
//     </div>
//   );
// };

// export default EmailHistory;



// "use client";
// import jsPDF from "jspdf";
// import React, { useEffect, useState } from "react";
// import RepliesUI from "../reply/page";
// import InboxPredictor from "../predictor/page";
// import { Menu, X } from "lucide-react";

// const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// interface Email {
//   to: string;
//   subject: string;
//   body: string;
//   threadId: string;
// }

// interface Reply {
//   from: string;
//   subject: string;
//   body: string;
//   threadId: string;
// }

// type Tag = "🔥 Hot Lead" | "⏰ Follow-up" | "❌ No Response";
// type SidebarOption = "inbox" | "sent" | "replies" | "predictor";

// const EmailHistory: React.FC = () => {
//   const [emails, setEmails] = useState<Email[]>([]);
//   const [replies, setReplies] = useState<Reply[]>([]);
//   const [expandedEmail, setExpandedEmail] = useState<string | null>(null);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [selectedSidebar, setSelectedSidebar] = useState<SidebarOption>("sent");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterType, setFilterType] = useState<"all" | "unread" | "replied">("all");
//   const [emailTags, setEmailTags] = useState<{ [key: string]: Tag[] }>({});
//   const [selectedEmails, setSelectedEmails] = useState<{ [key: string]: boolean }>({});
//   const [typingReply, setTypingReply] = useState<{ [key: string]: string }>({});
//   const [generating, setGenerating] = useState<{ [key: string]: boolean }>({});
//   const [sentimentScores, setSentimentScores] = useState<{ [key: string]: string }>({});

//   // ---- Fetch Emails & Replies ----
//   const fetchEmails = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/sent`, { credentials: "include" });
//       const data = await res.json();
//       setEmails(data.items || []);
//       const sentiments: any = {};
//       (data.items || []).forEach((email: Email) => {
//         sentiments[email.threadId] = analyzeSentiment(email.body);
//       });
//       setSentimentScores(sentiments);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchReplies = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/replies`, { credentials: "include" });
//       const data = await res.json();
//       setReplies(data.items || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchEmails();
//     fetchReplies();
//   }, []);

//   // ---- Helper Functions ----
//   const toggleEmail = (threadId: string) => {
//     setExpandedEmail(expandedEmail === threadId ? null : threadId);
//   };

//   const analyzeSentiment = (text: string) => {
//     const lower = text.toLowerCase();
//     if (lower.includes("thank") || lower.includes("good") || lower.includes("great")) return "positive";
//     if (lower.includes("sorry") || lower.includes("unfortunately") || lower.includes("bad")) return "negative";
//     return "neutral";
//   };

//   const exportPDF = () => {
//     const doc = new jsPDF();
//     let y = 10;
//     emails.forEach((email) => {
//       if (selectedEmails[email.threadId]) {
//         doc.text(`Subject: ${email.subject}`, 10, y); y += 8;
//         doc.text(`To: ${email.to}`, 10, y); y += 8;
//         doc.text(`Body: ${email.body}`, 10, y); y += 12;
//       }
//     });
//     doc.save("emails.pdf");
//   };

//   const getFilteredEmails = () => {
//     let filtered = emails;
//     if (filterType === "unread") filtered = emails.filter((e) => !replies.find((r) => r.threadId === e.threadId));
//     if (filterType === "replied") filtered = emails.filter((e) => replies.find((r) => r.threadId === e.threadId));
//     if (searchQuery) {
//       filtered = filtered.filter(
//         (e) =>
//           e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           e.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           e.to.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
//     return filtered;
//   };

//   const getContentForSidebar = () => {
//     switch (selectedSidebar) {
//       case "inbox":
//       case "sent":
//         return getFilteredEmails();
//       case "replies":
//         return replies;
//       case "predictor":
//         return [];
//       default:
//         return getFilteredEmails();
//     }
//   };

//   return (
//     <div className="pt-16 flex min-h-screen bg-black text-white">
//       {/* Sidebar */}
//       <div
//         className={`fixed top-0 left-0 bottom-0 z-30 w-64 bg-gradient-to-b from-black/95 via-gray-900/90 to-black/95 backdrop-blur-lg border-r border-white/20 p-8 pt-10 transform transition-transform duration-300 lg:translate-x-0 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } overflow-y-auto`}
//       >
//         <h2 className=" mt-20 text-2xl font-bold mb-8 text-cyan-400">📬 Dashboard</h2>
//         <ul className="space-y-4">
//           {["inbox", "sent", "replies", "predictor"].map((option) => (
//             <li key={option}>
//               <button
//                 className={`w-full text-left px-4 py-2 rounded-lg transition ${
//                   selectedSidebar === option ? "bg-blue-600/40" : "hover:bg-white/10"
//                 }`}
//                 onClick={() => setSelectedSidebar(option as SidebarOption)}
//               >
//                 {option === "inbox"
//                   ? "🏠 Inbox"
//                   : option === "sent"
//                   ? "📩 Sent Emails"
//                   : option === "replies"
//                   ? "💬 Replies"
//                   : "🚀 Predict Inbox"}
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Mobile hamburger */}
//       <div className="fixed top-4 left-4 z-40 lg:hidden">
//         <button
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition"
//         >
//           {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//         </button>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 ml-0 lg:ml-64 relative z-10 px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
//         {selectedSidebar === "predictor" ? (
//           <InboxPredictor />
//         ) : selectedSidebar === "replies" ? (
//           <div>
//             <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 sm:mb-10">
//               💬 Replies
//             </h2>
//             <div className="space-y-6">
//               {replies.slice().reverse().map((rep, idx) => (
//                 <div key={idx} className="bg-white/10 p-4 rounded-xl shadow hover:scale-[1.01] transition">
//                   <p className="text-sm sm:text-base text-gray-300">
//                     <strong>From:</strong> {rep.from} | <strong>Subject:</strong> {rep.subject}
//                   </p>
//                   <p className="text-gray-200 mt-2 whitespace-pre-line">{rep.body}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div>
//             {/* Search & Filters */}
//             <div className="sticky top-0 z-20 bg-black/50 backdrop-blur-lg border border-white/10 rounded-2xl px-4 sm:px-6 py-4 mb-8 flex flex-col lg:flex-row justify-between items-center gap-4 shadow-lg">
//               <input
//                 type="text"
//                 placeholder="🔍 Search emails..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="px-4 py-2 rounded-lg w-full lg:w-1/3 bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none"
//               />
//               <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
//                 {["all", "unread", "replied"].map((type) => (
//                   <button
//                     key={type}
//                     onClick={() => setFilterType(type as any)}
//                     className={`px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base font-medium transition ${
//                       filterType === type
//                         ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
//                         : "bg-white/10 text-gray-300 hover:bg-white/20"
//                     }`}
//                   >
//                     {type === "all" ? "📩 All" : type === "unread" ? "🆕 Unread" : "✅ Replied"}
//                   </button>
//                 ))}
//                 <button
//                   onClick={exportPDF}
//                   className="px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold shadow-lg text-sm sm:text-base"
//                 >
//                   📝 Export PDF
//                 </button>
//               </div>
//             </div>

//             {/* Emails */}
//             <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 sm:mb-10">
//               {selectedSidebar === "inbox" ? "🏠 Inbox" : "📩 Sent Emails"}
//             </h2>
//             <div className="grid gap-6 sm:gap-8">
//               {getContentForSidebar().slice().reverse().map((email: any, idx: number) => {
//                 const emailReplies = replies.filter((r) => r.threadId === email.threadId);
//                 return (
//                   <div
//                     key={idx}
//                     className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-4 sm:p-6 rounded-2xl shadow-lg hover:scale-[1.01] transition"
//                   >
//                     <div className="flex justify-between items-center cursor-pointer gap-2">
//                       <div className="flex-1 min-w-0">
//                         <p className="font-bold text-base sm:text-lg truncate">{email.subject}</p>
//                         <p className="text-xs sm:text-sm text-gray-300 truncate">To: {email.to}</p>
//                         <span
//                           className={`inline-block mt-2 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold ${
//                             sentimentScores[email.threadId] === "positive"
//                               ? "bg-green-500/20 text-green-300"
//                               : sentimentScores[email.threadId] === "negative"
//                               ? "bg-red-500/20 text-red-300"
//                               : "bg-gray-500/20 text-gray-300"
//                           }`}
//                         >
//                           {sentimentScores[email.threadId]?.toUpperCase()}
//                         </span>
//                       </div>
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => toggleEmail(email.threadId)}
//                           className="text-xl sm:text-2xl shrink-0"
//                         >
//                           {expandedEmail === email.threadId ? "▴" : "▾"}
//                         </button>
//                       </div>
//                     </div>

//                     {/* Tags */}
//                     <div className="mt-3 flex gap-2 flex-wrap">
//                       {(["🔥 Hot Lead", "⏰ Follow-up", "❌ No Response"] as Tag[]).map((tag) => (
//                         <button
//                           key={tag}
//                           onClick={() =>
//                             setEmailTags((prev) => {
//                               const current = prev[email.threadId] || [];
//                               if (current.includes(tag))
//                                 return { ...prev, [email.threadId]: current.filter((t) => t !== tag) };
//                               return { ...prev, [email.threadId]: [...current, tag] };
//                             })
//                           }
//                           className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold border transition ${
//                             emailTags[email.threadId]?.includes(tag)
//                               ? "bg-yellow-500/30 border-yellow-400 text-yellow-200"
//                               : "bg-white/10 border-white/20 text-gray-300 hover:bg-white/20"
//                           }`}
//                         >
//                           {tag}
//                         </button>
//                       ))}
//                     </div>

//                     {/* Expanded Content */}
//                     {expandedEmail === email.threadId && (
//                       <div className="mt-4 border-t border-white/20 pt-4 space-y-4">
//                         <p className="text-gray-200 whitespace-pre-line text-sm sm:text-base">{email.body}</p>

//                         {emailReplies.length > 0 && (
//                           <div className="mb-4">
//                             <h4 className="font-semibold mb-2">Replies:</h4>
//                             <div className="relative border-l border-white/20 pl-4 space-y-4">
//                               {emailReplies.map((rep, i) => (
//                                 <div key={i} className="relative">
//                                   <div className="absolute -left-2 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white"></div>
//                                   <p className="text-xs sm:text-sm text-gray-400">
//                                     From: {rep.from} | {rep.subject}
//                                   </p>
//                                   <p className="whitespace-pre-line text-gray-200 text-sm sm:text-base">{rep.body}</p>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}

//                         {/* Reply Box */}
//                         <textarea
//                           rows={4}
//                           placeholder="Write your reply..."
//                           className="w-full border border-white/20 bg-black/30 text-white rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
//                           value={typingReply[email.threadId] || ""}
//                           onChange={(e) =>
//                             setTypingReply({ ...typingReply, [email.threadId]: e.target.value })
//                           }
//                         />
//                         <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
//                           <button
//                             className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:opacity-90 text-sm sm:text-base"
//                           >
//                             ↩️ Send Reply
//                           </button>
//                           <button
//                             className={`flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium shadow text-sm sm:text-base ${
//                               generating[email.threadId] ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
//                             }`}
//                           >
//                             {generating[email.threadId] ? "Generating..." : "🤖 Generate Reply"}
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmailHistory;


// "use client";
// import jsPDF from "jspdf";
// import React, { useEffect, useState } from "react";
// import RepliesUI from "../reply/page";
// import InboxPredictor from "../predictor/page";
// import { Menu, X } from "lucide-react";

// const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// interface Email {
//   to: string;
//   subject: string;
//   body: string;
//   threadId: string;
// }

// interface Reply {
//   from: string;
//   subject: string;
//   body: string;
//   threadId: string;
// }

// type Tag = "🔥 Hot Lead" | "⏰ Follow-up" | "❌ No Response";
// type SidebarOption = "inbox" | "sent" | "replies" | "predictor";

// const EmailHistory: React.FC = () => {
//   const [emails, setEmails] = useState<Email[]>([]);
//   const [replies, setReplies] = useState<Reply[]>([]);
//   const [expandedEmail, setExpandedEmail] = useState<string | null>(null);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [selectedSidebar, setSelectedSidebar] = useState<SidebarOption>("sent");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterType, setFilterType] = useState<"all" | "unread" | "replied">("all");
//   const [emailTags, setEmailTags] = useState<{ [key: string]: Tag[] }>({});
//   const [selectedEmails, setSelectedEmails] = useState<{ [key: string]: boolean }>({});
//   const [sentimentScores, setSentimentScores] = useState<{ [key: string]: string }>({});

//   // ---- Fetch Emails & Replies ----
//   const fetchEmails = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/sent`, { credentials: "include" });
//       const data = await res.json();
//       setEmails(data.items || []);
//       const sentiments: any = {};
//       (data.items || []).forEach((email: Email) => {
//         sentiments[email.threadId] = analyzeSentiment(email.body);
//       });
//       setSentimentScores(sentiments);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchReplies = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/replies`, { credentials: "include" });
//       const data = await res.json();
//       setReplies(data.items || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchEmails();
//     fetchReplies();
//   }, []);

//   // ---- Helper Functions ----
//   const toggleEmail = (threadId: string) => {
//     setExpandedEmail(expandedEmail === threadId ? null : threadId);
//   };

//   const analyzeSentiment = (text: string) => {
//     const lower = text.toLowerCase();
//     if (lower.includes("thank") || lower.includes("good") || lower.includes("great")) return "positive";
//     if (lower.includes("sorry") || lower.includes("unfortunately") || lower.includes("bad")) return "negative";
//     return "neutral";
//   };

//   // ✅ Export only selected emails to PDF
//   const exportPDF = () => {
//     const selected = emails.filter((email) => selectedEmails[email.threadId]);
//     if (selected.length === 0) {
//       alert("Please select at least one email to export to PDF.");
//       return;
//     }

//     const doc = new jsPDF();
//     let y = 10;

//     doc.setFontSize(14);
//     doc.text("MailMorph — Selected Emails Export", 10, y);
//     y += 10;

//     selected.forEach((email) => {
//       if (y > 270) {
//         doc.addPage();
//         y = 10;
//       }

//       doc.setFontSize(12);
//       doc.text(`Subject: ${email.subject}`, 10, y);
//       y += 8;
//       doc.text(`To: ${email.to}`, 10, y);
//       y += 8;

//       const splitBody = doc.splitTextToSize(email.body, 180);
//       doc.text(splitBody, 10, y);
//       y += splitBody.length * 6 + 10;

//       doc.line(10, y, 200, y);
//       y += 8;
//     });

//     doc.save("selected_emails.pdf");
//   };

//   const getFilteredEmails = () => {
//     let filtered = emails;
//     if (filterType === "unread") filtered = emails.filter((e) => !replies.find((r) => r.threadId === e.threadId));
//     if (filterType === "replied") filtered = emails.filter((e) => replies.find((r) => r.threadId === e.threadId));
//     if (searchQuery) {
//       filtered = filtered.filter(
//         (e) =>
//           e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           e.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           e.to.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
//     return filtered;
//   };

//   const getContentForSidebar = () => {
//     switch (selectedSidebar) {
//       case "inbox":
//       case "sent":
//         return getFilteredEmails();
//       case "replies":
//         return replies;
//       case "predictor":
//         return [];
//       default:
//         return getFilteredEmails();
//     }
//   };

//   const handleSidebarClick = (option: SidebarOption) => {
//     setSelectedSidebar(option);
//     setSidebarOpen(false);
//   };

//   return (
//     <div className="pt-16 flex min-h-screen bg-black text-white">
//       {/* Sidebar */}
//       <div
//         className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-gradient-to-b from-black/95 via-gray-900/90 to-black/95 backdrop-blur-lg border-r border-white/20 p-8 pt-10 transform transition-transform duration-300 ease-in-out ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } lg:translate-x-0 overflow-y-auto`}
//       >
//         <h2 className="mt-20 text-2xl font-bold mb-8 text-cyan-400">📬 Dashboard</h2>
//         <ul className="space-y-4">
//           {["inbox", "sent", "replies", "predictor"].map((option) => (
//             <li key={option}>
//               <button
//                 className={`w-full text-left px-4 py-2 rounded-lg transition ${
//                   selectedSidebar === option ? "bg-blue-600/40" : "hover:bg-white/10"
//                 }`}
//                 onClick={() => handleSidebarClick(option as SidebarOption)}
//               >
//                 {option === "inbox"
//                   ? "🏠 Inbox"
//                   : option === "sent"
//                   ? "📩 Sent Emails"
//                   : option === "replies"
//                   ? "💬 Replies"
//                   : "🚀 Predict Inbox"}
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Overlay (Mobile) */}
//       {sidebarOpen && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
//       )}

//       {/* Hamburger Button */}
//       <div className="fixed top-4 left-4 z-50 lg:hidden">
//         <button
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition"
//         >
//           {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//         </button>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 ml-0 lg:ml-64 relative z-10 px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
//         {selectedSidebar === "predictor" ? (
//           <InboxPredictor />
//         ) : selectedSidebar === "replies" ? (
//           <RepliesUI />
//         ) : (
//           <div>
//             {/* Search & Filter */}
//             <div className="sticky top-0 z-20 bg-black/50 backdrop-blur-lg border border-white/10 rounded-2xl px-4 sm:px-6 py-4 mb-8 flex flex-col lg:flex-row justify-between items-center gap-4 shadow-lg">
//               <input
//                 type="text"
//                 placeholder="🔍 Search emails..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="px-4 py-2 rounded-lg w-full lg:w-1/3 bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none"
//               />
//               <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
//                 {["all", "unread", "replied"].map((type) => (
//                   <button
//                     key={type}
//                     onClick={() => setFilterType(type as any)}
//                     className={`px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base font-medium transition ${
//                       filterType === type
//                         ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
//                         : "bg-white/10 text-gray-300 hover:bg-white/20"
//                     }`}
//                   >
//                     {type === "all" ? "📩 All" : type === "unread" ? "🆕 Unread" : "✅ Replied"}
//                   </button>
//                 ))}
//                 <button
//                   onClick={exportPDF}
//                   className="px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold shadow-lg text-sm sm:text-base"
//                 >
//                   📝 Export Selected PDF
//                 </button>
//               </div>
//             </div>

//             {/* Emails List */}
//             <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 sm:mb-10">
//               {selectedSidebar === "inbox" ? "🏠 Inbox" : "📩 Sent Emails"}
//             </h2>
//             <div className="grid gap-6 sm:gap-8">
//               {getContentForSidebar()
//                 .slice()
//                 .reverse()
//                 .map((email: any, idx: number) => {
//                   const emailReplies = replies.filter((r) => r.threadId === email.threadId);
//                   return (
//                     <div
//                       key={idx}
//                       className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-4 sm:p-6 rounded-2xl shadow-lg hover:scale-[1.01] transition"
//                     >
//                       <div className="flex justify-between items-center gap-3">
//                         <input
//                           type="checkbox"
//                           checked={!!selectedEmails[email.threadId]}
//                           onChange={(e) =>
//                             setSelectedEmails((prev) => ({
//                               ...prev,
//                               [email.threadId]: e.target.checked,
//                             }))
//                           }
//                           className="w-4 h-4 accent-green-400 cursor-pointer"
//                         />

//                         <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleEmail(email.threadId)}>
//                           <p className="font-bold text-base sm:text-lg truncate">{email.subject}</p>
//                           <p className="text-xs sm:text-sm text-gray-300 truncate">To: {email.to}</p>
//                           <span
//                             className={`inline-block mt-2 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold ${
//                               sentimentScores[email.threadId] === "positive"
//                                 ? "bg-green-500/20 text-green-300"
//                                 : sentimentScores[email.threadId] === "negative"
//                                 ? "bg-red-500/20 text-red-300"
//                                 : "bg-gray-500/20 text-gray-300"
//                             }`}
//                           >
//                             {sentimentScores[email.threadId]?.toUpperCase()}
//                           </span>
//                         </div>

//                         <button onClick={() => toggleEmail(email.threadId)} className="text-xl sm:text-2xl shrink-0">
//                           {expandedEmail === email.threadId ? "▴" : "▾"}
//                         </button>
//                       </div>

//                       {expandedEmail === email.threadId && (
//                         <div className="mt-4 border-t border-white/20 pt-4 space-y-4">
//                           <p className="text-gray-200 whitespace-pre-line text-sm sm:text-base">{email.body}</p>
//                           {emailReplies.length > 0 && (
//                             <div className="mb-4">
//                               <h4 className="font-semibold mb-2">Replies:</h4>
//                               <div className="relative border-l border-white/20 pl-4 space-y-4">
//                                 {emailReplies.map((rep, i) => (
//                                   <div key={i} className="relative">
//                                     <div className="absolute -left-2 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white"></div>
//                                     <p className="text-xs sm:text-sm text-gray-400">
//                                       From: {rep.from} | {rep.subject}
//                                     </p>
//                                     <p className="whitespace-pre-line text-gray-200 text-sm sm:text-base">{rep.body}</p>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmailHistory;




// "use client";
// import jsPDF from "jspdf";
// import React, { useEffect, useState } from "react";
// import RepliesUI from "../reply/page";
// import InboxPredictor from "../predictor/page";
// import { Menu, X, Trash2 } from "lucide-react";

// const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// interface Email {
//   to: string;
//   subject: string;
//   body: string;
//   threadId: string;
// }

// interface Reply {
//   from: string;
//   subject: string;
//   body: string;
//   threadId: string;
// }

// type Tag = "🔥 Hot Lead" | "⏰ Follow-up" | "❌ No Response";
// type SidebarOption = "inbox" | "sent" | "replies" | "predictor";

// const EmailHistory: React.FC = () => {
//   const [emails, setEmails] = useState<Email[]>([]);
//   const [replies, setReplies] = useState<Reply[]>([]);
//   const [expandedEmail, setExpandedEmail] = useState<string | null>(null);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [selectedSidebar, setSelectedSidebar] = useState<SidebarOption>("sent");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterType, setFilterType] = useState<"all" | "unread" | "replied">("all");
//   const [emailTags, setEmailTags] = useState<{ [key: string]: Tag[] }>({});
//   const [selectedEmails, setSelectedEmails] = useState<{ [key: string]: boolean }>({});
//   const [typingReply, setTypingReply] = useState<{ [key: string]: string }>({});
//   const [generating, setGenerating] = useState<{ [key: string]: boolean }>({});
//   const [sentimentScores, setSentimentScores] = useState<{ [key: string]: string }>({});
//   const [summaries, setSummaries] = useState<{ [key: string]: string }>({});

//   // ---- Fetch Emails & Replies ----
//   const fetchEmails = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/sent`, { credentials: "include" });
//       const data = await res.json();
//       setEmails(data.items || []);
//       const sentiments: any = {};
//       const summariesTemp: any = {};
//       (data.items || []).forEach((email: Email) => {
//         sentiments[email.threadId] = analyzeSentiment(email.body);
//         summariesTemp[email.threadId] = generateSummary(email.body);
//       });
//       setSentimentScores(sentiments);
//       setSummaries(summariesTemp);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchReplies = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/replies`, { credentials: "include" });
//       const data = await res.json();
//       setReplies(data.items || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchEmails();
//     fetchReplies();
//   }, []);

//   // ---- Helpers ----
//   const toggleEmail = (threadId: string) => {
//     setExpandedEmail(expandedEmail === threadId ? null : threadId);
//   };

//   const analyzeSentiment = (text: string) => {
//     const lower = text.toLowerCase();
//     if (lower.includes("thank") || lower.includes("good") || lower.includes("great")) return "positive";
//     if (lower.includes("sorry") || lower.includes("unfortunately") || lower.includes("bad")) return "negative";
//     return "neutral";
//   };

//   const generateSummary = (text: string) => {
//     const words = text.split(" ").slice(0, 20).join(" ");
//     return words.length > 0 ? `${words}...` : "No content";
//   };

//   const handleDeleteSelected = async () => {
//     const ids = Object.keys(selectedEmails).filter((id) => selectedEmails[id]);
//     if (ids.length === 0) {
//       alert("Please select at least one email to delete.");
//       return;
//     }

//     if (!confirm(`Are you sure you want to delete ${ids.length} email(s)?`)) return;

//     for (const id of ids) {
//       try {
//         const res = await fetch(`${API_BASE}/email/delete/${id}`, { method: "DELETE" });
//         if (!res.ok) throw new Error(`Failed to delete email ${id}`);
//       } catch (err) {
//         console.error(err);
//       }
//     }

//     setEmails(emails.filter((e) => !ids.includes(e.threadId)));
//     const updated = { ...selectedEmails };
//     ids.forEach((id) => delete updated[id]);
//     setSelectedEmails(updated);
//   };

//   const exportPDF = () => {
//     const selected = emails.filter((e) => selectedEmails[e.threadId]);
//     if (selected.length === 0) {
//       alert("Please select at least one email to export.");
//       return;
//     }

//     const doc = new jsPDF();
//     let y = 10;
//     doc.setFontSize(14);
//     doc.text("📬 MailMorph - Selected Emails Export", 10, y);
//     y += 10;

//     selected.forEach((email, i) => {
//       if (y > 270) {
//         doc.addPage();
//         y = 10;
//       }

//       doc.setFontSize(12);
//       doc.text(`Subject: ${email.subject}`, 10, y);
//       y += 7;
//       doc.text(`To: ${email.to}`, 10, y);
//       y += 7;
//       doc.setFontSize(10);
//       const splitBody = doc.splitTextToSize(email.body, 180);
//       doc.text(splitBody, 10, y);
//       y += splitBody.length * 5 + 8;
//       doc.line(10, y, 200, y);
//       y += 8;
//     });

//     doc.save("selected_emails.pdf");
//   };

//   const selectAll = () => {
//     const all = emails.reduce((acc, email) => ({ ...acc, [email.threadId]: true }), {});
//     setSelectedEmails(all);
//   };

//   const deselectAll = () => setSelectedEmails({});

//   const getFilteredEmails = () => {
//     let filtered = emails;
//     if (filterType === "unread") filtered = emails.filter((e) => !replies.find((r) => r.threadId === e.threadId));
//     if (filterType === "replied") filtered = emails.filter((e) => replies.find((r) => r.threadId === e.threadId));
//     if (searchQuery) {
//       filtered = filtered.filter(
//         (e) =>
//           e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           e.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           e.to.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
//     return filtered;
//   };

//   const getContentForSidebar = () => {
//     switch (selectedSidebar) {
//       case "inbox":
//       case "sent":
//         return getFilteredEmails();
//       case "replies":
//         return replies;
//       case "predictor":
//         return [];
//       default:
//         return getFilteredEmails();
//     }
//   };

//   return (
//     <div className="pt-16 flex min-h-screen bg-black text-white">
//       {/* Sidebar */}
//       <div
//         className={`fixed top-0 left-0 bottom-0 z-30 w-64 bg-gradient-to-b from-black/95 via-gray-900/90 to-black/95 backdrop-blur-lg border-r border-white/20 p-8 pt-10 transform transition-transform duration-300 lg:translate-x-0 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } overflow-y-auto`}
//       >
//         <h2 className="mt-20 text-2xl font-bold mb-8 text-cyan-400">📬 Dashboard</h2>
//         <ul className="space-y-4">
//           {["inbox", "sent", "replies", "predictor"].map((option) => (
//             <li key={option}>
//               <button
//                 className={`w-full text-left px-4 py-2 rounded-lg transition ${
//                   selectedSidebar === option ? "bg-blue-600/40" : "hover:bg-white/10"
//                 }`}
//                 onClick={() => setSelectedSidebar(option as SidebarOption)}
//               >
//                 {option === "inbox"
//                   ? "🏠 Inbox"
//                   : option === "sent"
//                   ? "📩 Sent Emails"
//                   : option === "replies"
//                   ? "💬 Replies"
//                   : "🚀 Predict Inbox"}
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Mobile hamburger */}
//       <div className="fixed top-4 left-4 z-40 lg:hidden">
//         <button
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition"
//         >
//           {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//         </button>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 ml-0 lg:ml-64 relative z-10 px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
//         {selectedSidebar === "predictor" ? (
//           <InboxPredictor />
//         ) : selectedSidebar === "replies" ? (
//           <RepliesUI />
//         ) : (
//           <>
//             {/* Search & Filters */}
//             <div className="sticky top-0 z-20 bg-black/50 backdrop-blur-lg border border-white/10 rounded-2xl px-4 sm:px-6 py-4 mb-8 flex flex-col lg:flex-row justify-between items-center gap-4 shadow-lg">
//               <input
//                 type="text"
//                 placeholder="🔍 Search emails..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="px-4 py-2 rounded-lg w-full lg:w-1/3 bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none"
//               />
//               <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
//                 {["all", "unread", "replied"].map((type) => (
//                   <button
//                     key={type}
//                     onClick={() => setFilterType(type as any)}
//                     className={`px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base font-medium transition ${
//                       filterType === type
//                         ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
//                         : "bg-white/10 text-gray-300 hover:bg-white/20"
//                     }`}
//                   >
//                     {type === "all" ? "📩 All" : type === "unread" ? "🆕 Unread" : "✅ Replied"}
//                   </button>
//                 ))}
//                 <button
//                   onClick={selectAll}
//                   className="px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-300 rounded-lg text-sm font-semibold"
//                 >
//                   ✅ Select All
//                 </button>
//                 <button
//                   onClick={deselectAll}
//                   className="px-3 py-2 bg-gray-600/20 hover:bg-gray-600/40 text-gray-300 rounded-lg text-sm font-semibold"
//                 >
//                   🚫 Deselect All
//                 </button>
//                 <button
//                   onClick={exportPDF}
//                   className="px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold shadow-lg text-sm sm:text-base"
//                 >
//                   📝 Export PDF
//                 </button>
//                 <button
//                   onClick={handleDeleteSelected}
//                   className="flex items-center gap-1 px-3 sm:px-4 py-2 bg-gradient-to-r from-red-600 to-pink-700 text-white rounded-lg font-semibold shadow-lg text-sm sm:text-base"
//                 >
//                   <Trash2 size={16} /> Delete
//                 </button>
//               </div>
//             </div>

//             {/* Emails List */}
//             <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 sm:mb-10">
//               {selectedSidebar === "inbox" ? "🏠 Inbox" : "📩 Sent Emails"}
//             </h2>
//             <div className="grid gap-6 sm:gap-8">
//               {getContentForSidebar().slice().reverse().map((email, idx) => {
//                 const emailReplies = replies.filter((r) => r.threadId === email.threadId);
//                 return (
//                   <div
//                     key={idx}
//                     className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-4 sm:p-6 rounded-2xl shadow-lg hover:scale-[1.01] transition"
//                   >
//                     <div className="flex justify-between items-center gap-3">
//                       <input
//                         type="checkbox"
//                         checked={!!selectedEmails[email.threadId]}
//                         onChange={(e) =>
//                           setSelectedEmails({
//                             ...selectedEmails,
//                             [email.threadId]: e.target.checked,
//                           })
//                         }
//                         className="w-4 h-4 accent-cyan-400 cursor-pointer"
//                       />

//                       <div
//                         onClick={() => toggleEmail(email.threadId)}
//                         className="flex-1 min-w-0 cursor-pointer"
//                       >
//                         <p className="font-bold text-base sm:text-lg truncate">{email.subject}</p>
//                         <p className="text-xs sm:text-sm text-gray-300 truncate">To: {email.to}</p>
//                         <p className="text-xs text-gray-400 italic mt-1">
//                           🧠 Summary: {summaries[email.threadId]}
//                         </p>
//                         <span
//                           className={`inline-block mt-2 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold ${
//                             sentimentScores[email.threadId] === "positive"
//                               ? "bg-green-500/20 text-green-300"
//                               : sentimentScores[email.threadId] === "negative"
//                               ? "bg-red-500/20 text-red-300"
//                               : "bg-gray-500/20 text-gray-300"
//                           }`}
//                         >
//                           {sentimentScores[email.threadId]?.toUpperCase()}
//                         </span>
//                       </div>

//                       <button
//                         onClick={() => toggleEmail(email.threadId)}
//                         className="text-xl sm:text-2xl shrink-0"
//                       >
//                         {expandedEmail === email.threadId ? "▴" : "▾"}
//                       </button>
//                     </div>

//                     {expandedEmail === email.threadId && (
//                       <div className="mt-4 border-t border-white/20 pt-4 space-y-4">
//                         <p className="text-gray-200 whitespace-pre-line text-sm sm:text-base">{email.body}</p>
//                         {emailReplies.length > 0 && (
//                           <div className="border-l border-white/20 pl-4">
//                             <h4 className="font-semibold mb-2">Replies:</h4>
//                             {emailReplies.map((rep, i) => (
//                               <div key={i}>
//                                 <p className="text-xs text-gray-400">
//                                   From: {rep.from} | {rep.subject}
//                                 </p>
//                                 <p className="whitespace-pre-line text-gray-200 text-sm">{rep.body}</p>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmailHistory;

// "use client";
// import jsPDF from "jspdf";
// import React, { useEffect, useState } from "react";
// import RepliesUI from "../reply/page";
// import InboxPredictor from "../predictor/page";
// import { Menu, X } from "lucide-react";

// const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// interface Email {
//   to: string;
//   subject: string;
//   body: string;
//   threadId: string;
// }

// interface Reply {
//   from: string;
//   subject: string;
//   body: string;
//   threadId: string;
// }

// type SidebarOption = "inbox" | "sent" | "replies" | "predictor";

// const EmailHistory: React.FC = () => {
//   const [emails, setEmails] = useState<Email[]>([]);
//   const [replies, setReplies] = useState<Reply[]>([]);
//   const [expandedEmail, setExpandedEmail] = useState<string | null>(null);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [selectedSidebar, setSelectedSidebar] = useState<SidebarOption>("sent");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterType, setFilterType] = useState<"all" | "unread" | "replied">("all");
//   const [selectedEmails, setSelectedEmails] = useState<{ [key: string]: boolean }>({});
//   const [sentimentScores, setSentimentScores] = useState<{ [key: string]: string }>({});
//   const [summaries, setSummaries] = useState<{ [key: string]: string }>({});

//   // ---- Fetch Emails & Replies ----
//   const fetchEmails = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/sent`, { credentials: "include" });
//       const data = await res.json();
//       setEmails(data.items || []);

//       const sentiments: any = {};
//       const summariesTemp: any = {};

//       (data.items || []).forEach((email: Email) => {
//         sentiments[email.threadId] = analyzeSentiment(email.body);
//         summariesTemp[email.threadId] = generateSummary(email.body);
//       });

//       setSentimentScores(sentiments);
//       setSummaries(summariesTemp);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchReplies = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/replies`, { credentials: "include" });
//       const data = await res.json();
//       setReplies(data.items || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchEmails();
//     fetchReplies();
//   }, []);

//   // ---- Helpers ----
//   const toggleEmail = (threadId: string) => {
//     setExpandedEmail(expandedEmail === threadId ? null : threadId);
//   };

//   const analyzeSentiment = (text: string) => {
//     const lower = text.toLowerCase();
//     if (lower.includes("thank") || lower.includes("good") || lower.includes("great")) return "positive";
//     if (lower.includes("sorry") || lower.includes("unfortunately") || lower.includes("bad")) return "negative";
//     return "neutral";
//   };

//   const generateSummary = (text: string) => {
//     const words = text.split(" ").slice(0, 20).join(" ");
//     return words.length > 0 ? `${words}...` : "No content";
//   };

//   const exportPDF = () => {
//     const selected = emails.filter((e) => selectedEmails[e.threadId]);
//     if (selected.length === 0) {
//       alert("Please select at least one email to export.");
//       return;
//     }

//     const doc = new jsPDF();
//     let y = 10;
//     doc.setFontSize(14);
//     doc.text("📬 MailMorph - Selected Emails Export", 10, y);
//     y += 10;

//     selected.forEach((email, i) => {
//       if (y > 270) {
//         doc.addPage();
//         y = 10;
//       }

//       doc.setFontSize(12);
//       doc.text(`Subject: ${email.subject}`, 10, y);
//       y += 7;
//       doc.text(`To: ${email.to}`, 10, y);
//       y += 7;
//       doc.setFontSize(10);
//       const splitBody = doc.splitTextToSize(email.body, 180);
//       doc.text(splitBody, 10, y);
//       y += splitBody.length * 5 + 8;
//       doc.line(10, y, 200, y);
//       y += 8;
//     });

//     doc.save("selected_emails.pdf");
//   };

//   const selectAll = () => {
//     const all = emails.reduce((acc, email) => ({ ...acc, [email.threadId]: true }), {});
//     setSelectedEmails(all);
//   };

//   const deselectAll = () => setSelectedEmails({});

//   const getFilteredEmails = () => {
//     let filtered = emails;
//     if (filterType === "unread") filtered = emails.filter((e) => !replies.find((r) => r.threadId === e.threadId));
//     if (filterType === "replied") filtered = emails.filter((e) => replies.find((r) => r.threadId === e.threadId));
//     if (searchQuery) {
//       filtered = filtered.filter(
//         (e) =>
//           e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           e.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           e.to.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
//     return filtered;
//   };

//   const getContentForSidebar = () => {
//     switch (selectedSidebar) {
//       case "inbox":
//       case "sent":
//         return getFilteredEmails();
//       case "replies":
//         return replies;
//       case "predictor":
//         return [];
//       default:
//         return getFilteredEmails();
//     }
//   };

//   return (
//     <div className="pt-16 flex min-h-screen bg-black text-white">
//       {/* Sidebar */}
//       <div
//         className={`fixed top-0 left-0 bottom-0 z-30 w-64 bg-gradient-to-b from-black/95 via-gray-900/90 to-black/95 backdrop-blur-lg border-r border-white/20 p-8 pt-10 transform transition-transform duration-300 lg:translate-x-0 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } overflow-y-auto`}
//       >
//         <h2 className="mt-20 text-2xl font-bold mb-8 text-cyan-400">📬 Dashboard</h2>
//         <ul className="space-y-4">
//           {["inbox", "sent", "replies", "predictor"].map((option) => (
//             <li key={option}>
//               <button
//                 className={`w-full text-left px-4 py-2 rounded-lg transition ${
//                   selectedSidebar === option ? "bg-blue-600/40" : "hover:bg-white/10"
//                 }`}
//                 onClick={() => setSelectedSidebar(option as SidebarOption)}
//               >
//                 {option === "inbox"
//                   ? "🏠 Inbox"
//                   : option === "sent"
//                   ? "📩 Sent Emails"
//                   : option === "replies"
//                   ? "💬 Replies"
//                   : "🚀 Predict Inbox"}
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Mobile hamburger */}
//       <div className="fixed top-4 left-4 z-40 lg:hidden">
//         <button
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition"
//         >
//           {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//         </button>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 ml-0 lg:ml-64 relative z-10 px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
//         {selectedSidebar === "predictor" ? (
//           <InboxPredictor />
//         ) : selectedSidebar === "replies" ? (
//           <RepliesUI />
//         ) : (
//           <>
//             {/* Search & Filters */}
//             <div className="sticky top-0 z-20 bg-black/50 backdrop-blur-lg border border-white/10 rounded-2xl px-4 sm:px-6 py-4 mb-8 flex flex-col lg:flex-row justify-between items-center gap-4 shadow-lg">
//               <input
//                 type="text"
//                 placeholder="🔍 Search emails..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="px-4 py-2 rounded-lg w-full lg:w-1/3 bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none"
//               />
//               <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
//                 {["all", "unread", "replied"].map((type) => (
//                   <button
//                     key={type}
//                     onClick={() => setFilterType(type as any)}
//                     className={`px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base font-medium transition ${
//                       filterType === type
//                         ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
//                         : "bg-white/10 text-gray-300 hover:bg-white/20"
//                     }`}
//                   >
//                     {type === "all" ? "📩 All" : type === "unread" ? "🆕 Unread" : "✅ Replied"}
//                   </button>
//                 ))}
//                 <button
//                   onClick={selectAll}
//                   className="px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-300 rounded-lg text-sm font-semibold"
//                 >
//                   ✅ Select All
//                 </button>
//                 <button
//                   onClick={deselectAll}
//                   className="px-3 py-2 bg-gray-600/20 hover:bg-gray-600/40 text-gray-300 rounded-lg text-sm font-semibold"
//                 >
//                   🚫 Deselect All
//                 </button>
//                 <button
//                   onClick={exportPDF}
//                   className="px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold shadow-lg text-sm sm:text-base"
//                 >
//                   📝 Export PDF
//                 </button>
//               </div>
//             </div>

//             {/* Emails List */}
//             <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 sm:mb-10">
//               {selectedSidebar === "inbox" ? "🏠 Inbox" : "📩 Sent Emails"}
//             </h2>
//             <div className="grid gap-6 sm:gap-8">
//               {getContentForSidebar().slice().reverse().map((email, idx) => {
//                 const emailReplies = replies.filter((r) => r.threadId === email.threadId);
//                 return (
//                   <div
//                     key={idx}
//                     className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-4 sm:p-6 rounded-2xl shadow-lg hover:scale-[1.01] transition"
//                   >
//                     <div className="flex justify-between items-center gap-3">
//                       <input
//                         type="checkbox"
//                         checked={!!selectedEmails[email.threadId]}
//                         onChange={(e) =>
//                           setSelectedEmails({
//                             ...selectedEmails,
//                             [email.threadId]: e.target.checked,
//                           })
//                         }
//                         className="w-4 h-4 accent-cyan-400 cursor-pointer"
//                       />

//                       <div
//                         onClick={() => toggleEmail(email.threadId)}
//                         className="flex-1 min-w-0 cursor-pointer"
//                       >
//                         <p className="font-bold text-base sm:text-lg truncate">{email.subject}</p>
//                         <p className="text-xs sm:text-sm text-gray-300 truncate">To: {email.to}</p>
//                         <p className="text-xs text-gray-400 italic mt-1">
//                           🧠 Summary: {summaries[email.threadId]}
//                         </p>
//                         <span
//                           className={`inline-block mt-2 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold ${
//                             sentimentScores[email.threadId] === "positive"
//                               ? "bg-green-500/20 text-green-300"
//                               : sentimentScores[email.threadId] === "negative"
//                               ? "bg-red-500/20 text-red-300"
//                               : "bg-gray-500/20 text-gray-300"
//                           }`}
//                         >
//                           {sentimentScores[email.threadId]?.toUpperCase()}
//                         </span>
//                       </div>

//                       <button
//                         onClick={() => toggleEmail(email.threadId)}
//                         className="text-xl sm:text-2xl shrink-0"
//                       >
//                         {expandedEmail === email.threadId ? "▴" : "▾"}
//                       </button>
//                     </div>

//                     {expandedEmail === email.threadId && (
//                       <div className="mt-4 border-t border-white/20 pt-4 space-y-4">
//                         <p className="text-gray-200 whitespace-pre-line text-sm sm:text-base">{email.body}</p>
//                         {emailReplies.length > 0 && (
//                           <div className="border-l border-white/20 pl-4">
//                             <h4 className="font-semibold mb-2">Replies:</h4>
//                             {emailReplies.map((rep, i) => (
//                               <div key={i}>
//                                 <p className="text-xs text-gray-400">
//                                   From: {rep.from} | {rep.subject}
//                                 </p>
//                                 <p className="whitespace-pre-line text-gray-200 text-sm">{rep.body}</p>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmailHistory;


"use client";
import jsPDF from "jspdf";
import React, { useEffect, useState } from "react";
import RepliesUI from "../reply/page";
import InboxPredictor from "../predictor/page";
import { Menu, X,  } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
