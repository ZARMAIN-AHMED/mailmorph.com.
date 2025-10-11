// const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// // ---------------- Email API ----------------
// export const generateEmail = async (company: string, service_offer: string) => {
//   const res = await fetch(`${API_BASE}/generate`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include", // include cookies for session
//     body: JSON.stringify({ company, service_offer }),
//   });
//   return res.json();
// };

// export const sendEmail = async (to: string, subject: string, body: string) => {
//   const res = await fetch(`${API_BASE}/send`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify({ to, subject, body }),
//   });
//   return res.json();
// };

// export const getSentEmails = async () => {
//   const res = await fetch(`${API_BASE}/sent`, { credentials: "include" });
//   return res.json();
// };

// export const replyEmail = async (threadId: string, to: string, body: string) => {
//   const res = await fetch(`${API_BASE}/reply`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify({ threadId, to, body }),
//   });
//   return res.json();
// };

// // ---------------- Auth API ----------------
// export const getMe = async () => {
//   const res = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
//   return res.json();
// };

// export const login = () => {
//   // Redirect to backend Google OAuth
//   window.location.href = `${API_BASE}/auth/google`;
// };

// export const logout = async () => {
//   const res = await fetch(`${API_BASE}/auth/logout`, {
//     method: "POST",
//     credentials: "include",
//   });
//   return res.json();
// };

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ---------------- Lead APIs ----------------
export async function fetchLeads() {
  const res = await fetch(`${API_BASE}/lead/list`);
  return res.json();
}

export async function addLead(lead: { name?: string; email: string; company?: string; role?: string }) {
  const res = await fetch(`${API_BASE}/lead/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
  });
  return res.json();
}

export async function scoreLead(lead: { name?: string; email?: string; company?: string; role?: string }) {
  const res = await fetch(`${API_BASE}/lead/score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
  });
  return res.json();
}

export async function triggerFollowup() {
  const res = await fetch(`${API_BASE}/lead/followup`, { method: "POST" });
  return res.json();
}

// Delete Lead
export async function deleteLead(email: string) {
  const res = await fetch(`${API_BASE}/lead/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
}

// ---------------- Email APIs ----------------
export async function generateEmail(company: string, service_offer: string) {
  const res = await fetch(`${API_BASE}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ company, service_offer }),
  });
  return res.json();
}

export async function sendEmail(to: string, subject: string, body: string) {
  const res = await fetch(`${API_BASE}/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, subject, body }),
  });
  return res.json();
}
