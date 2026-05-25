import { useState, useEffect } from "react";
import Card from "../components/common/Card";
import StatusBadge from "../components/ui/StatusBadge";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Banner({ message, type }) {
  if (!message) return null;
  const styles = { success: "bg-green-50 border-green-200 text-green-700", error: "bg-red-50 border-red-200 text-red-600" };
  return <div className={`text-xs border rounded px-3 py-2 mb-4 ${styles[type]}`}>{message}</div>;
}

function EmptyState({ filter }) {
  return (
    <tr><td colSpan={6} className="text-center py-10 text-sm text-[#aaa]">
      {filter === "All" ? "No donations yet." : `No ${filter} donations found.`}
    </td></tr>
  );
}

export default function DonationsPage() {
  const { role } = useAuth();
  const [filter, setFilter]       = useState("All");
  const [donations, setDonations] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [banner, setBanner]       = useState({ message: "", type: "success" });
  const [updating, setUpdating]   = useState(null);
  const [form, setForm]           = useState({ title: "", description: "", type: "money", amount: "", quantity: "", pickupAddress: "" });
  const [formError, setFormError]     = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm]       = useState(false);

  const STATUS_FILTERS = ["All", "pending", "accepted", "completed", "rejected"];

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await apiRequest("/donations");
      setDonations(res.data || []);
    } catch (err) {
      showBanner(err.message || "Failed to load donations", "error");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchDonations(); }, []);

  const showBanner = (message, type = "success") => {
    setBanner({ message, type });
    setTimeout(() => setBanner({ message: "", type: "success" }), 4000);
  };

  const handleCreate = async () => {
    setFormError("");
    if (!form.title.trim() || !form.description.trim()) return setFormError("Title and description are required");
    if (form.type === "money" && (!form.amount || Number(form.amount) <= 0)) return setFormError("Enter a valid amount");
    if (form.type === "item" && !form.pickupAddress.trim()) return setFormError("Pickup address is required for item donations");
    try {
      setFormLoading(true);
      await apiRequest("/donations", "POST", {
        title: form.title, description: form.description, type: form.type,
        amount:        form.type === "money" ? Number(form.amount) : 0,
        quantity:      form.type === "item"  ? Number(form.quantity || 1) : 0,
        pickupAddress: form.type === "item"  ? form.pickupAddress : undefined,
      });
      setForm({ title: "", description: "", type: "money", amount: "", quantity: "", pickupAddress: "" });
      setShowForm(false);
      showBanner("Donation created successfully ✓");
      fetchDonations();
    } catch (err) { setFormError(err.message || "Failed to create donation"); }
    finally { setFormLoading(false); }
  };

  const handleStatusUpdate = async (id, status) => {
    if (updating) return;
    try {
      setUpdating(id);
      await apiRequest(`/donations/${id}/status`, "PATCH", { status });
      showBanner(`Donation ${status} successfully ✓`);
      fetchDonations();
    } catch (err) { showBanner(err.message || "Failed to update status", "error"); }
    finally { setUpdating(null); }
  };

  const filtered = filter === "All" ? donations : donations.filter((d) => d.status === filter);
  const totalAmount  = donations.reduce((a, d) => a + (d.amount || 0), 0);
  const avgAmount    = donations.length ? Math.floor(totalAmount / donations.length) : 0;
  const pendingCount = donations.filter((d) => d.status === "pending").length;

  return (
    <div className="flex-1 p-5 md:p-7 flex flex-col overflow-hidden">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-5">
        <div>
          <div className="font-['DM_Serif_Display'] text-[22px] text-[#1a1a1a]">Donations</div>
          <div className="text-[12px] text-[#888] mt-[2px]">All incoming contributions</div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-[12px] px-3 py-[6px] rounded-full border border-black/10 capitalize ${filter === s ? "bg-[#c0453a] text-white" : "bg-[#f4f0ec] text-[#555]"}`}>
              {s}
            </button>
          ))}
          {role === "donor" && (
            <button onClick={() => setShowForm((v) => !v)}
              className="text-[12px] px-3 py-[6px] rounded-full bg-[#ff6600] hover:bg-[#e65c00] transition text-white">
              {showForm ? "Cancel" : "+ New Donation"}
            </button>
          )}
        </div>
      </div>

      <Banner message={banner.message} type={banner.type} />

      {role === "donor" && showForm && (
        <Card className="mb-5">
          <div className="text-[14px] font-medium mb-3">New Donation</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border border-black/10 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#ff6600]/30 text-sm" />
            <input placeholder="Description *" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border border-black/10 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#ff6600]/30 text-sm" />
            <div className="flex gap-4 items-center">
              {["money", "item"].map((t) => (
                <label key={t} className="flex items-center gap-1.5 cursor-pointer text-sm">
                  <input type="radio" name="dtype" value={t} checked={form.type === t}
                    onChange={() => setForm({ ...form, type: t })} className="accent-[#ff6600]" />
                  <span className="capitalize">{t}</span>
                </label>
              ))}
            </div>
            {form.type === "money" && (
              <input placeholder="Amount (₹) *" type="number" min="1" value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="border border-black/10 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#ff6600]/30 text-sm" />
            )}
            {form.type === "item" && (<>
              <input placeholder="Quantity" type="number" min="1" value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="border border-black/10 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#ff6600]/30 text-sm" />
              <input placeholder="Pickup address *" value={form.pickupAddress}
                onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })}
                className="border border-black/10 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#ff6600]/30 text-sm sm:col-span-2" />
            </>)}
          </div>
          {formError && <p className="text-xs text-red-500 mt-2 bg-red-50 border border-red-200 rounded px-3 py-2">{formError}</p>}
          <button onClick={handleCreate} disabled={formLoading}
            className="mt-3 bg-[#c0453a] hover:bg-[#a83830] transition text-white text-sm px-5 py-2 rounded-lg disabled:opacity-60">
            {formLoading ? "Submitting…" : "Submit Donation"}
          </button>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <Card><div className="text-xs text-[#888]">Total Raised</div><div className="text-lg font-semibold mt-1">₹{totalAmount.toLocaleString()}</div></Card>
        <Card><div className="text-xs text-[#888]">Total Entries</div><div className="text-lg font-semibold mt-1">{donations.length}</div></Card>
        <Card>
          <div className="text-xs text-[#888]">{role === "ngo" ? "Pending Approval" : "Avg Donation"}</div>
          <div className="text-lg font-semibold mt-1">{role === "ngo" ? pendingCount : `₹${avgAmount.toLocaleString()}`}</div>
        </Card>
      </div>

      <Card className="flex-1 overflow-auto">
        {loading ? <div className="text-center py-10 text-sm text-[#aaa]">Loading donations…</div> : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-[#999] border-b border-black/5">
                <th className="pb-2 font-medium">Title</th><th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium">Amount</th><th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Status</th>
                {role === "ngo" && <th className="pb-2 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? <EmptyState filter={filter} /> : filtered.map((d) => (
                <tr key={d._id} className="border-b border-black/5 last:border-0">
                  <td className="py-2.5 pr-3 font-medium text-[#333]">{d.title}</td>
                  <td className="py-2.5 pr-3 capitalize text-[#666]">{d.type}</td>
                  <td className="py-2.5 pr-3 text-[#444]">{d.type === "money" ? `₹${d.amount?.toLocaleString()}` : `${d.quantity} item(s)`}</td>
                  <td className="py-2.5 pr-3 text-[#888]">{new Date(d.createdAt).toLocaleDateString()}</td>
                  <td className="py-2.5 pr-3"><StatusBadge status={d.status} /></td>
                  {role === "ngo" && (
                    <td className="py-2.5">
                      {d.status === "pending" && (
                        <div className="flex gap-1.5">
                          <button onClick={() => handleStatusUpdate(d._id, "accepted")} disabled={updating === d._id}
                            className="bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white text-xs px-2.5 py-1 rounded transition">Accept</button>
                          <button onClick={() => handleStatusUpdate(d._id, "rejected")} disabled={updating === d._id}
                            className="bg-red-400 hover:bg-red-500 disabled:opacity-60 text-white text-xs px-2.5 py-1 rounded transition">Reject</button>
                        </div>
                      )}
                      {d.status === "accepted" && (
                        <button onClick={() => handleStatusUpdate(d._id, "completed")} disabled={updating === d._id}
                          className="bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white text-xs px-2.5 py-1 rounded transition">Complete</button>
                      )}
                      {["completed", "rejected"].includes(d.status) && <span className="text-[#aaa] text-xs">—</span>}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}