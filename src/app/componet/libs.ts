// // lib.ts
// const API_BASE = "http://localhost:8000"; // ⚡ Backend ka URL (Vercel/AWS pe deploy karoge to update karna hoga)

// // ✅ Lead type
// export interface Lead {
//   name?: string;
//   email: string;
//   company?: string;
//   role?: string;
//   score?: number;
//   status?: string;
//   last_contacted?: string;
// }

// // ✅ Fetch all leads
// export async function fetchLeads(): Promise<{ items: Lead[] }> {
//   const res = await fetch(`${API_BASE}/lead/list`, {
//     method: "GET",
//   });
//   if (!res.ok) throw new Error("Failed to fetch leads");
//   return await res.json();
// }

// // ✅ Add a new lead
// export async function addLead(lead: Partial<Lead>) {
//   const res = await fetch(`${API_BASE}/lead/add`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(lead),
//   });
//   if (!res.ok) throw new Error("Failed to add lead");
//   return await res.json();
// }

// // ✅ Delete a lead (by email)
// export async function deleteLead(email: string) {
//   const res = await fetch(`${API_BASE}/lead/delete`, {
//     method: "POST", // backend POST expect karta hai
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email }),
//   });
//   if (!res.ok) throw new Error("Failed to delete lead");
//   return await res.json();
// }

// // ✅ Trigger AI follow-up emails
// export async function triggerFollowup() {
//   const res = await fetch(`${API_BASE}/lead/followup`, {
//     method: "POST",
//   });
//   if (!res.ok) throw new Error("Failed to trigger follow-up");
//   return await res.json();
// }

// // (Optional) ✅ AI generated email preview (agar future me add karna chaho)
// export async function generateEmail(subject: string, body: string) {
//   const res = await fetch(`${API_BASE}/email/generate`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ subject, body }),
//   });
//   if (!res.ok) throw new Error("Failed to generate email");
//   return await res.json();
// }

// // (Optional) ✅ Send email manually (agar add karna ho)
// export async function sendEmail(to: string, subject: string, body: string) {
//   const res = await fetch(`${API_BASE}/email/send`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ to, subject, body }),
//   });
//   if (!res.ok) throw new Error("Failed to send email");
//   return await res.json();
// }












// const API_BASE = "http://localhost:8000"; // ⚡ Backend ka URL (deploy karne ke baad update karna hoga)

// // ✅ Lead type
// export interface Lead {
//   id?: number; // 🔑 backend se aa raha hai
//   name?: string;
//   email: string;
//   company?: string;
//   role?: string;
//   score?: number;
//   status?: string;
//   last_contacted?: string;
// }

// // ✅ Fetch all leads
// export async function fetchLeads(): Promise<{ items: Lead[] }> {
//   const res = await fetch(`${API_BASE}/lead/list`, {
//     method: "GET",
//   });
//   if (!res.ok) throw new Error("Failed to fetch leads");
//   return await res.json();
// }

// // ✅ Add a new lead
// export async function addLead(lead: Partial<Lead>) {
//   const res = await fetch(`${API_BASE}/lead/add`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(lead),
//   });
//   if (!res.ok) throw new Error("Failed to add lead");
//   return await res.json();
// }

// // ✅ Delete a lead (by ID instead of email)
// export async function deleteLead(id: number) {
//   const res = await fetch(`${API_BASE}/lead/delete`, {
//     method: "POST", // backend POST expect karta hai
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ id }), // ✅ ab ID bhejna hai
//   });
//   if (!res.ok) throw new Error("Failed to delete lead");
//   return await res.json();
// }

// // ✅ Trigger AI follow-up emails
// export async function triggerFollowup() {
//   const res = await fetch(`${API_BASE}/lead/followup`, {
//     method: "POST",
//   });
//   if (!res.ok) throw new Error("Failed to trigger follow-up");
//   return await res.json();
// }

// // (Optional) ✅ AI generated email preview
// export async function generateEmail(subject: string, body: string) {
//   const res = await fetch(`${API_BASE}/email/generate`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ subject, body }),
//   });
//   if (!res.ok) throw new Error("Failed to generate email");
//   return await res.json();
// }

// // (Optional) ✅ Send email manually
// export async function sendEmail(to: string, subject: string, body: string) {
//   const res = await fetch(`${API_BASE}/email/send`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ to, subject, body }),
//   });
//   if (!res.ok) throw new Error("Failed to send email");
//   return await res.json();
// }



const API_BASE = "http://localhost:8000"; // ⚡ Update if deployed

export interface Lead {
  id?: number;
  name?: string;
  email: string;
  company?: string;
  role?: string;
  score?: number;
  status?: string;
  last_contacted?: string;
}

export async function fetchLeads(): Promise<{ items: Lead[] }> {
  const res = await fetch(`${API_BASE}/lead/list`);
  if (!res.ok) throw new Error("Failed to fetch leads");
  return res.json();
}

export async function addLead(lead: Partial<Lead>) {
  const res = await fetch(`${API_BASE}/lead/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
  });
  if (!res.ok) throw new Error("Failed to add lead");
  return res.json();
}

export async function deleteLead(id: number) {
  const res = await fetch(`${API_BASE}/lead/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("Failed to delete lead");
  return res.json();
}

export async function triggerFollowup() {
  const res = await fetch(`${API_BASE}/lead/followup`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to trigger follow-up");
  return res.json();
}
