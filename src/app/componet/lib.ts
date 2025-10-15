
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
