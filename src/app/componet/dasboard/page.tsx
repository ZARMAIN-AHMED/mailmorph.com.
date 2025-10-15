


"use client";
import { useEffect, useState } from "react";
import { fetchLeads, addLead, triggerFollowup, deleteLead } from "../libs";

interface Lead {
  id?: number;
  name?: string;
  email: string;
  company?: string;
  role?: string;
  score?: number | string;
  status?: string;
  last_contacted?: string;
}

const Dashboard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
  });

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const data = await fetchLeads();
      setLeads(data.items || []);
    } catch (err) {
      console.error("Error loading leads:", err);
    }
    setLoading(false);
  };

  const handleAddLead = async () => {
    if (!newLead.email) return alert("Email is required");
    try {
      await addLead(newLead);
      setNewLead({ name: "", email: "", company: "", role: "" });
      loadLeads();
    } catch (err: any) {
      alert(err.message || "Failed to add lead");
    }
  };

  const handleDeleteLead = async (id: number) => {
    const confirmed = confirm(`Are you sure you want to delete lead #${id}?`);
    if (!confirmed) return;

    try {
      const result = await deleteLead(id);
      if (result.ok) {
        alert("Lead deleted successfully!");
        loadLeads();
      } else {
        alert(result.message || "Failed to delete lead");
      }
    } catch (err) {
      alert("Error deleting lead");
      console.error(err);
    }
  };

  const handleSingleFollowup = async (lead: Lead) => {
    try {
      const res = await fetch("https://mailmorph-back-production.up.railway.app/lead/followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: lead.email,
          name: lead.name,
          company: lead.company,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`✅ Follow-up email sent to ${lead.email}`);
        loadLeads();
      } else {
        alert(`❌ Failed: ${data.detail}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send follow-up");
    }
  };

  const handleFollowup = async () => {
    try {
      const res = await triggerFollowup();
      alert(`Follow-up triggered: ${res.updated_count} leads updated`);
      loadLeads();
    } catch (err) {
      alert("Failed to trigger follow-up");
      console.error(err);
    }
  };

  const handleUpdateScores = async () => {
    try {
      const res = await fetch("http://localhost:8000/lead/score", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Scores updated!");
        setLeads(data.items || []);
      } else {
        alert("❌ Failed to update scores");
      }
    } catch (err) {
      console.error("Error updating scores:", err);
      alert("Error updating scores");
    }
  };

  const renderScoreBadge = (score?: any) => {
    const s = typeof score === "string" ? score : String(score);
    if (!s) {
      return (
        <span className="px-3 py-1 rounded-full bg-gray-700 text-gray-300 text-sm font-medium">
          —
        </span>
      );
    }
    if (s.includes("Hot")) {
      return (
        <span className="px-4 py-1 rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-semibold shadow-md flex items-center gap-1 hover:scale-105 transition">
          🔥 Hot
        </span>
      );
    }
    if (s.includes("Warm")) {
      return (
        <span className="px-4 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm font-semibold shadow-md flex items-center gap-1 hover:scale-105 transition">
          🙂 Warm
        </span>
      );
    }
    if (s.includes("Cold")) {
      return (
        <span className="px-4 py-1 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-white text-sm font-semibold shadow-md flex items-center gap-1 hover:scale-105 transition">
          ❄️ Cold
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full bg-gray-700 text-gray-300 text-sm font-medium">
        {s}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        🚀 Lead Management Dashboard
      </h1>

      {/* Add Lead Form */}
      <div className="bg-gray-900 p-4 md:p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-lg md:text-xl font-semibold mb-4">➕ Add New Lead</h2>
        <div className="flex flex-col md:flex-row flex-wrap gap-3">
          <input
            type="text"
            placeholder="Name"
            value={newLead.name}
            onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
            className="flex-1 border border-gray-700 bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={newLead.email}
            onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
            className="flex-1 border border-gray-700 bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Company"
            value={newLead.company}
            onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
            className="flex-1 border border-gray-700 bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Role"
            value={newLead.role}
            onChange={(e) => setNewLead({ ...newLead, role: e.target.value })}
            className="flex-1 border border-gray-700 bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddLead}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition w-full md:w-auto"
          >
            Add Lead
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <button
          onClick={handleFollowup}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold transition w-full md:w-auto"
        >
          🔔 Trigger All Follow-ups
        </button>
        <button
          onClick={handleUpdateScores}
          className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg font-semibold transition w-full md:w-auto"
        >
          🚀 Update Lead Scores
        </button>
      </div>

      {/* Leads Table */}
      <div className="bg-gray-900 p-4 md:p-6 rounded-2xl shadow-lg overflow-x-auto">
        <h2 className="text-lg md:text-xl font-semibold mb-4">📋 Leads List</h2>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : leads.length === 0 ? (
          <p className="text-gray-400">No leads found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="hidden md:table w-full border-collapse">
              <thead>
                <tr className="bg-gray-800 text-gray-300">
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Company</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Score</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Last Contacted</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, i) => (
                  <tr
                    key={lead.id}
                    className={`${
                      i % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                    } hover:bg-gray-600 transition`}
                  >
                    <td className="p-3">{lead.id}</td>
                    <td className="p-3">{lead.name}</td>
                    <td className="p-3">{lead.email}</td>
                    <td className="p-3">{lead.company}</td>
                    <td className="p-3">{lead.role}</td>
                    <td className="p-3">{renderScoreBadge(lead.score)}</td>
                    <td className="p-3">{lead.status}</td>
                    <td className="p-3">{lead.last_contacted}</td>
                    <td className="p-3 flex gap-2 justify-center">
                      <button
                        onClick={() => handleSingleFollowup(lead)}
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition"
                      >
                        Follow-up
                      </button>
                      <button
                        onClick={() => handleDeleteLead(lead.id!)}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-gray-800 p-4 rounded-lg shadow-md space-y-2"
                >
                  <p>
                    <strong>Name:</strong> {lead.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {lead.email}
                  </p>
                  <p>
                    <strong>Company:</strong> {lead.company}
                  </p>
                  <p>
                    <strong>Role:</strong> {lead.role}
                  </p>
                  <p>
                    <strong>Score:</strong> {renderScoreBadge(lead.score)}
                  </p>
                  <p>
                    <strong>Status:</strong> {lead.status}
                  </p>
                  <p>
                    <strong>Last Contacted:</strong> {lead.last_contacted}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSingleFollowup(lead)}
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition w-full"
                    >
                      Follow-up
                    </button>
                    <button
                      onClick={() => handleDeleteLead(lead.id!)}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition w-full"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
