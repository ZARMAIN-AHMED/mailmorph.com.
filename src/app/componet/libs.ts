


const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://mailmorph-back-production.up.railway.app/";

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
