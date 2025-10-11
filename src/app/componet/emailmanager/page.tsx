// "use client";
// import React, { useState, useEffect } from "react";
// import { Copy, Eye, EyeOff, Send, Sparkles, FileText } from "lucide-react";
// import jsPDF from "jspdf";

// const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// interface GenerateResponse {
//   reply: string;
//   suggestions?: string[];
// }

// interface DraftVersion {
//   to: string;
//   company: string;
//   body: string;
//   subject: string;
//   date: string;
// }

// const EmailManager: React.FC = () => {
//   const [to, setTo] = useState("");
//   const [company, setCompany] = useState("");
//   const [serviceOffer, setServiceOffer] = useState("");
//   const [generatedEmail, setGeneratedEmail] = useState("");
//   const [subject, setSubject] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [tone, setTone] = useState("Professional");
//   const [template, setTemplate] = useState("Standard");
//   const [preview, setPreview] = useState(false);
//   const [draftVersions, setDraftVersions] = useState<DraftVersion[]>([]);
//   const [engagementScore, setEngagementScore] = useState(0);
//   const [ctaSuggestions, setCtaSuggestions] = useState<string[]>([]);

//   // Load saved draft
//   useEffect(() => {
//     const draft = localStorage.getItem("coldEmailDraft");
//     const versions = localStorage.getItem("coldEmailDrafts");
//     if (draft) {
//       const { to, company, serviceOffer, generatedEmail, subject } = JSON.parse(draft);
//       setTo(to);
//       setCompany(company);
//       setServiceOffer(serviceOffer);
//       setGeneratedEmail(generatedEmail);
//       setSubject(subject);
//     }
//     if (versions) setDraftVersions(JSON.parse(versions));
//   }, []);

//   // Auto-save draft
//   useEffect(() => {
//     const draft = { to, company, serviceOffer, generatedEmail, subject };
//     localStorage.setItem("coldEmailDraft", JSON.stringify(draft));
//   }, [to, company, serviceOffer, generatedEmail, subject]);

//   // Save versioned draft
//   const saveDraftVersion = () => {
//     const newVersion: DraftVersion = {
//       to,
//       company,
//       body: generatedEmail,
//       subject,
//       date: new Date().toISOString(),
//     };
//     const updatedVersions = [...draftVersions, newVersion];
//     setDraftVersions(updatedVersions);
//     localStorage.setItem("coldEmailDrafts", JSON.stringify(updatedVersions));
//     alert("💾 Draft version saved!");
//   };

//   // Apply personalization tokens
//   const applyTokens = (text: string) => {
//     return text.replace(/{FirstName}/g, to.split("@")[0] || "").replace(/{Company}/g, company);
//   };

//   // Generate engagement score & CTA suggestions
//   const analyzeEmail = (email: string) => {
//     const words = email.split(/\s+/).length;
//     const score = Math.min(100, Math.floor(words + Math.random() * 50));
//     const ctas = ["Schedule a call", "Book a demo", "Reply to this email"];
//     setEngagementScore(score);
//     setCtaSuggestions(ctas);
//   };

//   const handleGenerate = async () => {
//     if (!company || !serviceOffer) return alert("Fill company and service offer");
//     setLoading(true);
//     try {
//       const subj = `Cold Email to ${company}`;
//       const res = await fetch(`${API_BASE}/generate-reply`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           subject: subj,
//           body: `${serviceOffer}\n\nTone: ${tone}\nTemplate: ${template}`,
//           to: to || "test@example.com",
//         }),
//       });
//       const data: GenerateResponse = await res.json();
//       const personalized = applyTokens(data.reply);
//       setGeneratedEmail(personalized);
//       setSubject(subj);
//       analyzeEmail(personalized);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to generate email");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSend = async () => {
//     if (!to || !generatedEmail) return alert("Recipient or email body missing");
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/send`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ to, subject, body: generatedEmail }),
//       });
//       if (res.ok) {
//         alert("✅ Email sent successfully!");
//         setTo("");
//         setCompany("");
//         setServiceOffer("");
//         setGeneratedEmail("");
//         setSubject("");
//         localStorage.removeItem("coldEmailDraft");
//       } else {
//         alert("❌ Failed to send email");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Failed to send email");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCopy = () => {
//     navigator.clipboard.writeText(generatedEmail);
//     alert("📋 Copied to clipboard!");
//   };

//   const exportPDF = () => {
//     const doc = new jsPDF();
//     doc.text(generatedEmail, 10, 10);
//     doc.save(`${subject}.pdf`);
//   };

//   return (
//     <section className="relative py-24 px-6 overflow-hidden">
//       {/* 🔹 Background Video */}
//       <video
//         autoPlay
//         loop
//         muted
//         playsInline
//         className="absolute inset-0 w-full h-full object-cover "
//       >
//         <source src="/1.mp4" type="video/mp4" />
//       </video>
//       <div className="absolute inset-0 "></div>

//       <div className="relative max-w-7xl mx-auto">
//         <h1 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">
//           ✉️ Cold Email Generator{" "}
//           <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 text-transparent bg-clip-text">
//             Pro
//           </span>
//         </h1>

//         <div className="grid md:grid-cols-2 gap-8">
//           {/* LEFT: Inputs */}
//           <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 shadow-lg">
//             <h2 className="text-lg font-semibold text-white mb-3">📌 Email Details</h2>

//             <input
//               type="email"
//               placeholder="Recipient Email"
//               value={to}
//               onChange={(e) => setTo(e.target.value)}
//               className="w-full border border-white/20 bg-black/40 text-white p-3 rounded-lg focus:ring-2 focus:ring-cyan-400"
//             />
//             <input
//               type="text"
//               placeholder="Company Name"
//               value={company}
//               onChange={(e) => setCompany(e.target.value)}
//               className="w-full border border-white/20 bg-black/40 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-400"
//             />
//             <textarea
//               placeholder="Your Service / Offer"
//               value={serviceOffer}
//               onChange={(e) => setServiceOffer(e.target.value)}
//               className="w-full border border-white/20 bg-black/40 text-white p-3 rounded-lg focus:ring-2 focus:ring-pink-400"
//             />

//             {/* Tone & Template */}
//             <div className="flex gap-3">
//               <select
//                 value={tone}
//                 onChange={(e) => setTone(e.target.value)}
//                 className="flex-1 border border-white/20 bg-black/40 text-white p-3 rounded-lg focus:ring-2 focus:ring-cyan-400"
//               >
//                 <option>Professional</option>
//                 <option>Friendly</option>
//                 <option>Persuasive</option>
//                 <option>Casual</option>
//               </select>

//               <select
//                 value={template}
//                 onChange={(e) => setTemplate(e.target.value)}
//                 className="flex-1 border border-white/20 bg-black/40 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-400"
//               >
//                 <option>Standard</option>
//                 <option>Short & Punchy</option>
//                 <option>Storytelling</option>
//                 <option>Data-Driven</option>
//               </select>
//             </div>

//             {/* Actions */}
//             <div className="flex flex-wrap gap-3 mt-4">
//               <button
//                 onClick={handleGenerate}
//                 className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:opacity-90"
//                 disabled={loading}
//               >
//                 <Sparkles size={18} />
//                 {loading ? "Generating..." : "Generate"}
//               </button>

//               <button
//                 onClick={handleSend}
//                 className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-md hover:opacity-90"
//                 disabled={loading || !generatedEmail}
//               >
//                 <Send size={18} />
//                 {loading ? "Sending..." : "Send"}
//               </button>

//               <button
//                 onClick={saveDraftVersion}
//                 className="flex items-center gap-2 bg-gray-600/80 text-white px-4 py-2 rounded-lg hover:bg-gray-500/80"
//               >
//                 <FileText size={18} /> Save Version
//               </button>

//               <button
//                 onClick={exportPDF}
//                 className="flex items-center gap-2 bg-purple-600/80 text-white px-4 py-2 rounded-lg hover:bg-purple-500/80"
//               >
//                 Export PDF
//               </button>
//             </div>
//           </div>

//           {/* RIGHT: Generated Email */}
//           <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
//             <h2 className="text-lg font-semibold text-white mb-3">📝 Generated Email</h2>

//             {generatedEmail ? (
//               <>
//                 <div className="flex gap-3 mb-3">
//                   <button
//                     onClick={handleCopy}
//                     className="flex items-center gap-2 bg-gray-700/80 text-white px-3 py-1 rounded-lg hover:bg-gray-600/80"
//                   >
//                     <Copy size={16} /> Copy
//                   </button>
//                   <button
//                     onClick={() => setPreview(!preview)}
//                     className="flex items-center gap-2 bg-purple-600/80 text-white px-3 py-1 rounded-lg hover:bg-purple-500/80"
//                   >
//                     {preview ? <EyeOff size={16} /> : <Eye size={16} />}
//                     {preview ? "Edit" : "Preview"}
//                   </button>
//                 </div>

//                 {preview ? (
//                   <div className="border border-white/10 p-4 rounded-lg bg-black/40 text-white whitespace-pre-wrap">
//                     {generatedEmail}
//                     <div className="mt-3 text-sm text-cyan-300">
//                       <strong>CTA Suggestions:</strong> {ctaSuggestions.join(", ")}
//                     </div>
//                     <div className="mt-1 text-sm text-gray-400">
//                       Engagement Score: {engagementScore}/100
//                     </div>
//                   </div>
//                 ) : (
//                   <textarea
//                     value={generatedEmail}
//                     onChange={(e) => setGeneratedEmail(e.target.value)}
//                     className="w-full border border-white/20 bg-black/40 text-white p-3 rounded-lg"
//                     rows={10}
//                   />
//                 )}

//                 <p className="text-sm text-gray-400 mt-2">
//                   Word Count: {generatedEmail.split(/\s+/).length}
//                 </p>
//               </>
//             ) : (
//               <p className="text-gray-400">⚡ Generate an email to see it here.</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default EmailManager;






// "use client";
// import React, { useState, useEffect } from "react";
// import { Copy, Eye, EyeOff, Send, Sparkles, FileText } from "lucide-react";
// import jsPDF from "jspdf";

// const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// interface GenerateResponse {
//   reply: string;
//   suggestions?: string[];
// }

// interface DraftVersion {
//   to: string;
//   company: string;
//   body: string;
//   subject: string;
//   date: string;
// }

// const EmailManager: React.FC = () => {
//   const [to, setTo] = useState("");
//   const [company, setCompany] = useState("");
//   const [serviceOffer, setServiceOffer] = useState("");
//   const [generatedEmail, setGeneratedEmail] = useState("");
//   const [subject, setSubject] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [tone, setTone] = useState("Professional");
//   const [template, setTemplate] = useState("Standard");
//   const [preview, setPreview] = useState(false);
//   const [draftVersions, setDraftVersions] = useState<DraftVersion[]>([]);
//   const [engagementScore, setEngagementScore] = useState(0);
//   const [ctaSuggestions, setCtaSuggestions] = useState<string[]>([]);

//   useEffect(() => {
//     const draft = localStorage.getItem("coldEmailDraft");
//     const versions = localStorage.getItem("coldEmailDrafts");
//     if (draft) {
//       const { to, company, serviceOffer, generatedEmail, subject } = JSON.parse(draft);
//       setTo(to);
//       setCompany(company);
//       setServiceOffer(serviceOffer);
//       setGeneratedEmail(generatedEmail);
//       setSubject(subject);
//     }
//     if (versions) setDraftVersions(JSON.parse(versions));
//   }, []);

//   useEffect(() => {
//     const draft = { to, company, serviceOffer, generatedEmail, subject };
//     localStorage.setItem("coldEmailDraft", JSON.stringify(draft));
//   }, [to, company, serviceOffer, generatedEmail, subject]);

//   const saveDraftVersion = () => {
//     const newVersion: DraftVersion = {
//       to,
//       company,
//       body: generatedEmail,
//       subject,
//       date: new Date().toISOString(),
//     };
//     const updatedVersions = [...draftVersions, newVersion];
//     setDraftVersions(updatedVersions);
//     localStorage.setItem("coldEmailDrafts", JSON.stringify(updatedVersions));
//     alert("💾 Draft version saved!");
//   };

//   const applyTokens = (text: string) => {
//     return text.replace(/{FirstName}/g, to.split("@")[0] || "").replace(/{Company}/g, company);
//   };

//   const analyzeEmail = (email: string) => {
//     const words = email.split(/\s+/).length;
//     const score = Math.min(100, Math.floor(words + Math.random() * 50));
//     const ctas = ["Schedule a call", "Book a demo", "Reply to this email"];
//     setEngagementScore(score);
//     setCtaSuggestions(ctas);
//   };

//   const handleGenerate = async () => {
//     if (!company || !serviceOffer) return alert("Fill company and service offer");
//     setLoading(true);
//     try {
//       const subj = `Cold Email to ${company}`;
//       const res = await fetch(`${API_BASE}/generate-reply`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           subject: subj,
//           body: `${serviceOffer}\n\nTone: ${tone}\nTemplate: ${template}`,
//           to: to || "test@example.com",
//         }),
//       });
//       const data: GenerateResponse = await res.json();
//       const personalized = applyTokens(data.reply);
//       setGeneratedEmail(personalized);
//       setSubject(subj);
//       analyzeEmail(personalized);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to generate email");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSend = async () => {
//     if (!to || !generatedEmail) return alert("Recipient or email body missing");
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/send`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ to, subject, body: generatedEmail }),
//       });
//       if (res.ok) {
//         alert("✅ Email sent successfully!");
//         setTo("");
//         setCompany("");
//         setServiceOffer("");
//         setGeneratedEmail("");
//         setSubject("");
//         localStorage.removeItem("coldEmailDraft");
//       } else {
//         const errData = await res.json();
//         alert("❌ Failed to send email: " + (errData.detail || "unknown error"));
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Failed to send email");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCopy = () => {
//     navigator.clipboard.writeText(generatedEmail);
//     alert("📋 Copied to clipboard!");
//   };

//   const exportPDF = () => {
//     const doc = new jsPDF();
//     doc.text(generatedEmail, 10, 10);
//     doc.save(`${subject}.pdf`);
//   };

//   return (
//     <section className="relative py-24 px-6 overflow-hidden">
//       <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover ">
//         <source src="/1.mp4" type="video/mp4" />
//       </video>
//       <div className="absolute inset-0 "></div>

//       <div className="relative max-w-7xl mx-auto">
//         <h1 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">
//           ✉️ Cold Email Generator{" "}
//           <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 text-transparent bg-clip-text">
//             Pro
//           </span>
//         </h1>

//         <div className="grid md:grid-cols-2 gap-8">
//           <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 shadow-lg">
//             <h2 className="text-lg font-semibold text-white mb-3">📌 Email Details</h2>
//             <input type="email" placeholder="Recipient Email" value={to} onChange={(e) => setTo(e.target.value)} className="w-full border border-white/20 bg-black/40 text-white p-3 rounded-lg focus:ring-2 focus:ring-cyan-400" />
//             <input type="text" placeholder="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full border border-white/20 bg-black/40 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-400" />
//             <textarea placeholder="Your Service / Offer" value={serviceOffer} onChange={(e) => setServiceOffer(e.target.value)} className="w-full border border-white/20 bg-black/40 text-white p-3 rounded-lg focus:ring-2 focus:ring-pink-400" />

//             <div className="flex gap-3">
//               <select value={tone} onChange={(e) => setTone(e.target.value)} className="flex-1 border border-white/20 bg-black/40 text-white p-3 rounded-lg focus:ring-2 focus:ring-cyan-400">
//                 <option>Professional</option>
//                 <option>Friendly</option>
//                 <option>Persuasive</option>
//                 <option>Casual</option>
//               </select>
//               <select value={template} onChange={(e) => setTemplate(e.target.value)} className="flex-1 border border-white/20 bg-black/40 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-400">
//                 <option>Standard</option>
//                 <option>Short & Punchy</option>
//                 <option>Storytelling</option>
//                 <option>Data-Driven</option>
//               </select>
//             </div>

//             <div className="flex flex-wrap gap-3 mt-4">
//               <button onClick={handleGenerate} className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:opacity-90" disabled={loading}>
//                 <Sparkles size={18} /> {loading ? "Generating..." : "Generate"}
//               </button>
//               <button onClick={handleSend} className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-md hover:opacity-90" disabled={loading || !generatedEmail}>
//                 <Send size={18} /> {loading ? "Sending..." : "Send"}
//               </button>
//               <button onClick={saveDraftVersion} className="flex items-center gap-2 bg-gray-600/80 text-white px-4 py-2 rounded-lg hover:bg-gray-500/80">
//                 <FileText size={18} /> Save Version
//               </button>
//               <button onClick={exportPDF} className="flex items-center gap-2 bg-purple-600/80 text-white px-4 py-2 rounded-lg hover:bg-purple-500/80">
//                 Export PDF
//               </button>
//             </div>
//           </div>

//           <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
//             <h2 className="text-lg font-semibold text-white mb-3">📝 Generated Email</h2>
//             {generatedEmail ? (
//               <>
//                 <div className="flex gap-3 mb-3">
//                   <button onClick={handleCopy} className="flex items-center gap-2 bg-gray-700/80 text-white px-3 py-1 rounded-lg hover:bg-gray-600/80"><Copy size={16} /> Copy</button>
//                   <button onClick={() => setPreview(!preview)} className="flex items-center gap-2 bg-purple-600/80 text-white px-3 py-1 rounded-lg hover:bg-purple-500/80">{preview ? <EyeOff size={16} /> : <Eye size={16} />} {preview ? "Edit" : "Preview"}</button>
//                 </div>
//                 {preview ? (
//                   <div className="border border-white/10 p-4 rounded-lg bg-black/40 text-white whitespace-pre-wrap">
//                     {generatedEmail}
//                     <div className="mt-3 text-sm text-cyan-300"><strong>CTA Suggestions:</strong> {ctaSuggestions.join(", ")}</div>
//                     <div className="mt-1 text-sm text-gray-400">Engagement Score: {engagementScore}/100</div>
//                   </div>
//                 ) : (
//                   <textarea value={generatedEmail} onChange={(e) => setGeneratedEmail(e.target.value)} className="w-full border border-white/20 bg-black/40 text-white p-3 rounded-lg" rows={10} />
//                 )}
//                 <p className="text-sm text-gray-400 mt-2">Word Count: {generatedEmail.split(/\s+/).length}</p>
//               </>
//             ) : (
//               <p className="text-gray-400">⚡ Generate an email to see it here.</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default EmailManager;








// "use client";
// import React, { useState, useEffect } from "react";
// import { Copy, Eye, EyeOff, Send, Sparkles, FileText } from "lucide-react";
// import jsPDF from "jspdf";

// const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// interface GenerateResponse {
//   reply: string;
//   suggestions?: string[];
// }

// interface DraftVersion {
//   to: string;
//   company: string;
//   body: string;
//   subject: string;
//   date: string;
// }

// const EmailManager: React.FC = () => {
//   const [to, setTo] = useState(""); // single or multiple emails (comma-separated)
//   const [company, setCompany] = useState("");
//   const [serviceOffer, setServiceOffer] = useState("");
//   const [generatedEmail, setGeneratedEmail] = useState("");
//   const [subject, setSubject] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [tone, setTone] = useState("Professional");
//   const [template, setTemplate] = useState("Standard");
//   const [preview, setPreview] = useState(false);
//   const [draftVersions, setDraftVersions] = useState<DraftVersion[]>([]);
//   const [engagementScore, setEngagementScore] = useState(0);
//   const [ctaSuggestions, setCtaSuggestions] = useState<string[]>([]);

//   // ------------------- Draft Restore -------------------
//   useEffect(() => {
//     const draft = localStorage.getItem("coldEmailDraft");
//     const versions = localStorage.getItem("coldEmailDrafts");
//     if (draft) {
//       const { to, company, serviceOffer, generatedEmail, subject } = JSON.parse(draft);
//       setTo(to);
//       setCompany(company);
//       setServiceOffer(serviceOffer);
//       setGeneratedEmail(generatedEmail);
//       setSubject(subject);
//     }
//     if (versions) setDraftVersions(JSON.parse(versions));
//   }, []);

//   useEffect(() => {
//     const draft = { to, company, serviceOffer, generatedEmail, subject };
//     localStorage.setItem("coldEmailDraft", JSON.stringify(draft));
//   }, [to, company, serviceOffer, generatedEmail, subject]);

//   const saveDraftVersion = () => {
//     const newVersion: DraftVersion = {
//       to,
//       company,
//       body: generatedEmail,
//       subject,
//       date: new Date().toISOString(),
//     };
//     const updatedVersions = [...draftVersions, newVersion];
//     setDraftVersions(updatedVersions);
//     localStorage.setItem("coldEmailDrafts", JSON.stringify(updatedVersions));
//     alert("💾 Draft version saved!");
//   };

//   const applyTokens = (text: string) => {
//     return text.replace(/{FirstName}/g, to.split("@")[0] || "").replace(/{Company}/g, company);
//   };

//   const analyzeEmail = (email: string) => {
//     const words = email.split(/\s+/).length;
//     const score = Math.min(100, Math.floor(words + Math.random() * 50));
//     const ctas = ["Schedule a call", "Book a demo", "Reply to this email"];
//     setEngagementScore(score);
//     setCtaSuggestions(ctas);
//   };

//   // ------------------- Generate Email -------------------
//   const handleGenerate = async () => {
//     if (!company || !serviceOffer) return alert("Fill company and service offer");
//     setLoading(true);
//     try {
//       const subj = `Cold Email to ${company}`;
//       const res = await fetch(`${API_BASE}/generate-reply`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           subject: subj,
//           body: `${serviceOffer}\n\nTone: ${tone}\nTemplate: ${template}`,
//           to: to || "test@example.com",
//         }),
//       });
//       const data: GenerateResponse = await res.json();
//       const personalized = applyTokens(data.reply);
//       setGeneratedEmail(personalized);
//       setSubject(subj);
//       analyzeEmail(personalized);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to generate email");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ------------------- Send Single Email -------------------
//   const handleSend = async () => {
//     if (!to || !generatedEmail) return alert("Recipient or email body missing");
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/send`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ to, subject, body: generatedEmail }),
//       });
//       if (res.ok) {
//         alert("✅ Email sent successfully!");
//         resetForm();
//       } else {
//         const errData = await res.json();
//         alert("❌ Failed to send email: " + (errData.detail || "unknown error"));
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Failed to send email");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ------------------- Send Bulk Emails -------------------
//   const handleBulkSend = async () => {
//     if (!to || !generatedEmail) return alert("Recipients or email body missing");

//     // split comma-separated emails into array
//     const recipients = to.split(",").map(email => email.trim()).filter(email => email.length > 0);

//     if (recipients.length < 2) {
//       return alert("⚠️ For bulk send, enter at least 2 emails separated by commas.");
//     }

//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/send-bulk`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ to: recipients, subject, body: generatedEmail }),
//       });
//       if (res.ok) {
//         const data = await res.json();
//         alert(`✅ Bulk email sent to ${data.sent.length} recipients!`);
//         resetForm();
//       } else {
//         const errData = await res.json();
//         alert("❌ Bulk send failed: " + (errData.detail || "unknown error"));
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Failed to send bulk emails");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setTo("");
//     setCompany("");
//     setServiceOffer("");
//     setGeneratedEmail("");
//     setSubject("");
//     localStorage.removeItem("coldEmailDraft");
//   };

//   const handleCopy = () => {
//     navigator.clipboard.writeText(generatedEmail);
//     alert("📋 Copied to clipboard!");
//   };

//   const exportPDF = () => {
//     const doc = new jsPDF();
//     doc.text(generatedEmail, 10, 10);
//     doc.save(`${subject}.pdf`);
//   };

//   return (
//     <section className=" relative py-24 px-6 overflow-hidden">
//       <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover ">
//         <source src="/1.mp4" type="video/mp4" />
//       </video>
//       <div className="absolute inset-0 "></div>

//       <div className="relative max-w-7xl mx-auto">
//         <h1 className="text-3xl md:text-5xl font-extrabold text-center mb-12 text-white">
//   ✉️ Cold Email{" "}
//   <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 text-transparent bg-clip-text">
//     Generator
//   </span>
// </h1>


//         <div className="grid md:grid-cols-2 gap-8">
//           <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 shadow-lg">
//             <h2 className="text-lg font-semibold text-white mb-3">📌 Email Details</h2>
//             <input
//               type="text"
//               placeholder="Recipient Email(s) — use commas for multiple"
//               value={to}
//               onChange={(e) => setTo(e.target.value)}
//               className="w-full border border-white/20 bg-black/40 text-white p-3 rounded-lg focus:ring-2 focus:ring-cyan-400"
//             />
//             <input
//               type="text"
//               placeholder="Company Name"
//               value={company}
//               onChange={(e) => setCompany(e.target.value)}
//               className="w-full border border-white/20 bg-black/40 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-400"
//             />
//             <textarea
//               placeholder="Your Service / Offer"
//               value={serviceOffer}
//               onChange={(e) => setServiceOffer(e.target.value)}
//               className="w-full border border-white/20 bg-black/40 text-white p-3 rounded-lg focus:ring-2 focus:ring-pink-400"
//             />

//             <div className="flex gap-3">
//               <select
//                 value={tone}
//                 onChange={(e) => setTone(e.target.value)}
//                 className="flex-1 border border-white/20 bg-black/40 text-white p-3 rounded-lg focus:ring-2 focus:ring-cyan-400"
//               >
//                 <option>Professional</option>
//                 <option>Friendly</option>
//                 <option>Persuasive</option>
//                 <option>Casual</option>
//               </select>
//               <select
//                 value={template}
//                 onChange={(e) => setTemplate(e.target.value)}
//                 className="flex-1 border border-white/20 bg-black/40 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-400"
//               >
//                 <option>Standard</option>
//                 <option>Short & Punchy</option>
//                 <option>Storytelling</option>
//                 <option>Data-Driven</option>
//               </select>
//             </div>

//             <div className="flex flex-wrap gap-3 mt-4">
//               <button
//                 onClick={handleGenerate}
//                 className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:opacity-90"
//                 disabled={loading}
//               >
//                 <Sparkles size={18} /> {loading ? "Generating..." : "Generate"}
//               </button>
//               <button
//                 onClick={handleSend}
//                 className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-md hover:opacity-90"
//                 disabled={loading || !generatedEmail}
//               >
//                 <Send size={18} /> {loading ? "Sending..." : "Send"}
//               </button>
//               <button
//                 onClick={handleBulkSend}
//                 className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:opacity-90"
//                 disabled={loading || !generatedEmail}
//               >
//                 <Send size={18} /> {loading ? "Sending..." : "Send Bulk"}
//               </button>
//               <button
//                 onClick={saveDraftVersion}
//                 className="flex items-center gap-2 bg-gray-600/80 text-white px-4 py-2 rounded-lg hover:bg-gray-500/80"
//               >
//                 <FileText size={18} /> Save Version
//               </button>
//               <button
//                 onClick={exportPDF}
//                 className="flex items-center gap-2 bg-purple-600/80 text-white px-4 py-2 rounded-lg hover:bg-purple-500/80"
//               >
//                 Export PDF
//               </button>
//             </div>
//           </div>

//           <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
//             <h2 className="text-lg font-semibold text-white mb-3">📝 Generated Email</h2>
//             {generatedEmail ? (
//               <>
//                 <div className="flex gap-3 mb-3">
//                   <button
//                     onClick={handleCopy}
//                     className="flex items-center gap-2 bg-gray-700/80 text-white px-3 py-1 rounded-lg hover:bg-gray-600/80"
//                   >
//                     <Copy size={16} /> Copy
//                   </button>
//                   <button
//                     onClick={() => setPreview(!preview)}
//                     className="flex items-center gap-2 bg-purple-600/80 text-white px-3 py-1 rounded-lg hover:bg-purple-500/80"
//                   >
//                     {preview ? <EyeOff size={16} /> : <Eye size={16} />}{" "}
//                     {preview ? "Edit" : "Preview"}
//                   </button>
//                 </div>
//                 {preview ? (
//                   <div className="border border-white/10 p-4 rounded-lg bg-black/40 text-white whitespace-pre-wrap">
//                     {generatedEmail}
//                     <div className="mt-3 text-sm text-cyan-300">
//                       <strong>CTA Suggestions:</strong> {ctaSuggestions.join(", ")}
//                     </div>
//                     <div className="mt-1 text-sm text-gray-400">
//                       Engagement Score: {engagementScore}/100
//                     </div>
//                   </div>
//                 ) : (
//                   <textarea
//                     value={generatedEmail}
//                     onChange={(e) => setGeneratedEmail(e.target.value)}
//                     className="w-full border border-white/20 bg-black/40 text-white p-3 rounded-lg"
//                     rows={10}
//                   />
//                 )}
//                 <p className="text-sm text-gray-400 mt-2">
//                   Word Count: {generatedEmail.split(/\s+/).length}
//                 </p>
//               </>
//             ) : (
//               <p className="text-gray-400">⚡ Generate an email to see it here.</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default EmailManager;

"use client";
import React, { useState, useEffect } from "react";
import { Copy, Eye, EyeOff, Send, Sparkles, FileText, Calendar, Tag, List } from "lucide-react";
import jsPDF from "jspdf";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface GenerateResponse {
  reply: string;
  suggestions?: string[];
}

interface DraftVersion {
  to: string;
  company: string;
  body: string;
  subject: string;
  date: string;
  tags?: string[];
  scheduledAt?: string;
}

interface EmailHistory {
  to: string;
  subject: string;
  body: string;
  sentAt: string;
}

const EmailManager: React.FC = () => {
  const [to, setTo] = useState(""); 
  const [company, setCompany] = useState("");
  const [serviceOffer, setServiceOffer] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState("Professional");
  const [template, setTemplate] = useState("Standard");
  const [preview, setPreview] = useState(false);
  const [draftVersions, setDraftVersions] = useState<DraftVersion[]>([]);
  const [engagementScore, setEngagementScore] = useState(0);
  const [ctaSuggestions, setCtaSuggestions] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [scheduledAt, setScheduledAt] = useState<string>("");
  const [emailHistory, setEmailHistory] = useState<EmailHistory[]>([]);
  const [templatesLibrary, setTemplatesLibrary] = useState<DraftVersion[]>([]);
  const [analytics, setAnalytics] = useState({
    totalGenerated: 0,
    totalSent: 0,
    totalBulkSent: 0,
    avgEngagement: 0,
  });
  const [attachments, setAttachments] = useState<File[]>([]);

  // Load drafts, versions, templates, history
  useEffect(() => {
    const draft = localStorage.getItem("coldEmailDraft");
    const versions = localStorage.getItem("coldEmailDrafts");
    const history = localStorage.getItem("emailHistory");
    const templates = localStorage.getItem("templatesLibrary");

    if (draft) {
      const { to, company, serviceOffer, generatedEmail, subject, tags, scheduledAt } = JSON.parse(draft);
      setTo(to); setCompany(company); setServiceOffer(serviceOffer); setGeneratedEmail(generatedEmail); setSubject(subject);
      if (tags) setTags(tags);
      if (scheduledAt) setScheduledAt(scheduledAt);
    }
    if (versions) setDraftVersions(JSON.parse(versions));
    if (history) setEmailHistory(JSON.parse(history));
    if (templates) setTemplatesLibrary(JSON.parse(templates));
  }, []);

  useEffect(() => {
    const draft = { to, company, serviceOffer, generatedEmail, subject, tags, scheduledAt };
    localStorage.setItem("coldEmailDraft", JSON.stringify(draft));
  }, [to, company, serviceOffer, generatedEmail, subject, tags, scheduledAt]);

  // ------------------- Draft Versions -------------------
  const saveDraftVersion = () => {
    const newVersion: DraftVersion = { to, company, body: generatedEmail, subject, date: new Date().toISOString(), tags, scheduledAt };
    const updatedVersions = [...draftVersions, newVersion];
    setDraftVersions(updatedVersions);
    localStorage.setItem("coldEmailDrafts", JSON.stringify(updatedVersions));
    alert("💾 Draft version saved!");
  };

  // const restoreDraft = (version: DraftVersion) => {
  //   setTo(version.to);
  //   setCompany(version.company);
  //   setGeneratedEmail(version.body);
  //   setSubject(version.subject);
    // setTags(version.tags || []);
    // setScheduledAt(version.scheduledAt || "");
  //   alert("♻️ Draft restored!");
  // };

  // ------------------- Templates -------------------
  const saveTemplate = () => {
    const newTemplate: DraftVersion = { to, company, body: generatedEmail, subject, date: new Date().toISOString(), tags, scheduledAt };
    const updatedTemplates = [...templatesLibrary, newTemplate];
    setTemplatesLibrary(updatedTemplates);
    localStorage.setItem("templatesLibrary", JSON.stringify(updatedTemplates));
    alert("💾 Template saved!");
  };

  // const applyTemplate = (template: DraftVersion) => {
  //   setGeneratedEmail(template.body);
  //   setSubject(template.subject);
  //   setCompany(template.company);
  //   setTo(template.to);
  //   setTags(template.tags || []);
  //   setScheduledAt(template.scheduledAt || "");
  //   alert("📄 Template applied!");
  // };

  // ------------------- Tokens -------------------
  const applyTokens = (text: string) => text.replace(/{FirstName}/g, to.split("@")[0] || "").replace(/{Company}/g, company);

  // ------------------- Analytics -------------------
  const updateAnalytics = () => {
    const avgEngagement = emailHistory.length ? Math.floor(emailHistory.reduce((sum, h) => sum + h.body.split(/\s+/).length, 0) / emailHistory.length) : 0;
    setAnalytics({ ...analytics, avgEngagement });
  };

  // ------------------- Email Analysis -------------------
  const analyzeEmail = (email: string) => {
    const words = email.split(/\s+/).length;
    const score = Math.min(100, Math.floor(words + Math.random() * 50));
    const ctas = ["Schedule a call", "Book a demo", "Reply to this email"];
    setEngagementScore(score);
    setCtaSuggestions(ctas);
  };

  // ------------------- Generate Email -------------------
  const handleGenerate = async () => {
    if (!company || !serviceOffer) return alert("Fill company and service offer");
    setLoading(true);
    try {
      const subj = `Cold Email to ${company}`;
      const res = await fetch(`${API_BASE}/generate-reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: subj, body: `${serviceOffer}\nTone: ${tone}`, to: to || "test@example.com" }),
      });
      const data: GenerateResponse = await res.json();
      const personalized = applyTokens(data.reply);
      setGeneratedEmail(personalized);
      setSubject(subj);
      analyzeEmail(personalized);
      setAnalytics({...analytics, totalGenerated: analytics.totalGenerated + 1});
    } catch (err) { console.error(err); alert("Failed to generate email"); }
    finally { setLoading(false); }
  };

  // ------------------- Send Email -------------------
  const handleSend = async () => {
    if (!to || !generatedEmail) return alert("Recipient or email body missing");
    setLoading(true);
    try {
      const payload = { to, subject, body: generatedEmail, tags, scheduledAt, attachments };
      const res = await fetch(`${API_BASE}/send`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) {
        alert("✅ Email sent successfully!");
        const newHistory: EmailHistory = { to, subject, body: generatedEmail, sentAt: new Date().toISOString() };
        const updatedHistory = [...emailHistory, newHistory];
        setEmailHistory(updatedHistory);
        localStorage.setItem("emailHistory", JSON.stringify(updatedHistory));
        setAnalytics({...analytics, totalSent: analytics.totalSent + 1});
        resetForm();
      } else {
        const errData = await res.json();
        alert("❌ Failed to send email: " + (errData.detail || "unknown error"));
      }
    } catch (err) { console.error(err); alert("Failed to send email"); }
    finally { setLoading(false); updateAnalytics(); }
  };

  const handleBulkSend = async () => {
    const recipients = to.split(",").map(e => e.trim()).filter(e => e);
    if (recipients.length < 2) return alert("⚠️ Enter at least 2 emails for bulk send");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/send-bulk`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: recipients, subject, body: generatedEmail, tags, scheduledAt, attachments }) });
      if (res.ok) {
        const data = await res.json();
        alert(`✅ Bulk email sent to ${data.sent.length} recipients!`);
        setAnalytics({...analytics, totalBulkSent: analytics.totalBulkSent + data.sent.length});
        resetForm();
      } else {
        const errData = await res.json();
        alert("❌ Bulk send failed: " + (errData.detail || "unknown error"));
      }
    } catch (err) { console.error(err); alert("Failed to send bulk emails"); }
    finally { setLoading(false); updateAnalytics(); }
  };

  const resetForm = () => {
    setTo(""); setCompany(""); setServiceOffer(""); setGeneratedEmail(""); setSubject(""); setTags([]); setScheduledAt(""); setAttachments([]);
    localStorage.removeItem("coldEmailDraft");
  };

  const handleCopy = () => { navigator.clipboard.writeText(generatedEmail); alert("📋 Copied to clipboard!"); };
  const exportPDF = () => { const doc = new jsPDF(); doc.text(generatedEmail, 10, 10); doc.save(`${subject}.pdf`); };

  // ------------------- Attachments -------------------
  const handleAttachment = (files: FileList | null) => { if (files) setAttachments([...attachments, ...Array.from(files)]); };

  // ------------------- Tag Handling -------------------
  const toggleTag = (tag: string) => tags.includes(tag) ? setTags(tags.filter(t => t !== tag)) : setTags([...tags, tag]);

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="/1.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0"></div>
      <div className="relative max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-extrabold text-center mb-12 text-white">
          ✉️ Cold Email <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 text-transparent bg-clip-text">Generator</span>
        </h1>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Left Panel */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-3">📌 Email Details</h2>
            <input type="text" placeholder="Recipient Email(s)" value={to} onChange={e => setTo(e.target.value)} className="w-full border border-white/20 bg-black/40 text-white p-3 rounded-lg focus:ring-2 focus:ring-cyan-400" />
            <input type="text" placeholder="Company Name" value={company} onChange={e => setCompany(e.target.value)} className="w-full border border-white/20 bg-black/40 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-400" />
            <textarea placeholder="Your Service / Offer" value={serviceOffer} onChange={e => setServiceOffer(e.target.value)} className="w-full border border-white/20 bg-black/40 text-white p-3 rounded-lg focus:ring-2 focus:ring-pink-400" rows={3} />

            {/* Tone + Template */}
            <div className="flex gap-3">
              <select value={tone} onChange={e => setTone(e.target.value)} className="flex-1 border border-white/20 bg-black/40 text-white p-3 rounded-lg focus:ring-2 focus:ring-cyan-400">
                <option>Professional</option><option>Friendly</option><option>Persuasive</option><option>Casual</option>
              </select>
              <select value={template} onChange={e => setTemplate(e.target.value)} className="flex-1 border border-white/20 bg-black/40 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-400">
                <option>Standard</option><option>Short & Punchy</option><option>Storytelling</option><option>Data-Driven</option>
              </select>
            </div>

            {/* Tags */}
            <div className="flex gap-2 flex-wrap mt-2">
              {["VIP","Prospect","Partner"].map(tag => (
                <button key={tag} onClick={() => toggleTag(tag)} className={`px-3 py-1 rounded-full text-sm ${tags.includes(tag) ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"}`}>{tag}</button>
              ))}
            </div>

            {/* Scheduled Send */}
          

            {/* Attachments */}
            <div className="mt-3">
              <input type="file" multiple onChange={e => handleAttachment(e.target.files)} className="text-sm text-white" />
              {attachments.length > 0 && <p className="text-gray-300 mt-1">{attachments.map(f => f.name).join(", ")}</p>}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 mt-4">
              <button onClick={handleGenerate} className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:opacity-90" disabled={loading}><Sparkles size={18} /> {loading ? "Generating..." : "Generate"}</button>
              <button onClick={handleSend} className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-md hover:opacity-90" disabled={loading || !generatedEmail}><Send size={18} /> Send</button>
              <button onClick={handleBulkSend} className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:opacity-90" disabled={loading || !generatedEmail}><Send size={18} /> Send Bulk</button>
              <button onClick={saveDraftVersion} className="flex items-center gap-2 bg-gray-600/80 text-white px-4 py-2 rounded-lg hover:bg-gray-500/80"><FileText size={18} /> Save Version</button>
              <button onClick={saveTemplate} className="flex items-center gap-2 bg-gray-700/80 text-white px-4 py-2 rounded-lg hover:bg-gray-600/80"><List size={16} /> Save Template</button>
              <button onClick={exportPDF} className="flex items-center gap-2 bg-purple-600/80 text-white px-4 py-2 rounded-lg hover:bg-purple-500/80">Export PDF</button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-3">📝 Generated Email</h2>
            {generatedEmail ? (
              <>
                <div className="flex gap-3 mb-3">
                  <button onClick={handleCopy} className="flex items-center gap-2 bg-gray-700/80 text-white px-3 py-1 rounded-lg hover:bg-gray-600/80"><Copy size={16} /> Copy</button>
                  <button onClick={() => setPreview(!preview)} className="flex items-center gap-2 bg-purple-600/80 text-white px-3 py-1 rounded-lg hover:bg-purple-500/80">{preview ? <EyeOff size={16} /> : <Eye size={16} />} {preview ? "Edit" : "Preview"}</button>
                </div>
                {preview ? (
                  <div className="border border-white/10 p-4 rounded-lg bg-black/40 text-white whitespace-pre-wrap">
                    {generatedEmail}
                    <div className="mt-3 text-sm text-cyan-300"><strong>CTA Suggestions:</strong> {ctaSuggestions.join(", ")}</div>
                    <div className="mt-1 text-sm text-gray-400">Engagement Score: {engagementScore}/100</div>
                  </div>
                ) : (
                  <textarea value={generatedEmail} onChange={e => setGeneratedEmail(e.target.value)} className="w-full border border-white/20 bg-black/40 text-white p-3 rounded-lg" rows={10} />
                )}
                <p className="text-sm text-gray-400 mt-2">Word Count: {generatedEmail.split(/\s+/).length}</p>
              </>
            ) : (<p className="text-gray-400">⚡ Generate an email to see it here.</p>)}

            {/* Analytics Summary */}
            <div className="mt-6 text-gray-300 space-y-1 text-sm">
              <p>Total Generated: {analytics.totalGenerated}</p>
              <p>Total Sent: {analytics.totalSent}</p>
              <p>Total Bulk Sent: {analytics.totalBulkSent}</p>
              <p>Avg Engagement Score: {analytics.avgEngagement}</p>
            </div>

            {/* Email History */}
           
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmailManager;
