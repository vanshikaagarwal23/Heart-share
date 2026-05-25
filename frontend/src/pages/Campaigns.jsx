import { useState, useEffect } from "react";
import StatusBadge from "../components/ui/StatusBadge";
import ProgressBar from "../components/ui/ProgressBar";
import Card from "../components/common/Card";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Banner({ message, type }) {
  if (!message) return null;
  const styles = { success: "bg-green-50 border-green-200 text-green-700", error: "bg-red-50 border-red-200 text-red-600" };
  return <div className={`text-xs border rounded px-3 py-2 mb-4 ${styles[type]}`}>{message}</div>;
}

export default function CampaignsPage() {
  const { role } = useAuth();
  const [campaigns, setCampaigns]               = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [volunteerStatus, setVolunteerStatus]   = useState(null);
  const [loadingApply, setLoadingApply]         = useState(false);
  const [showCreateModal, setShowCreateModal]   = useState(false);
  const [banner, setBanner]                     = useState({ message: "", type: "success" });
  const [createForm, setCreateForm]             = useState({ title: "", description: "", goalAmount: "" });
  const [createFormError, setCreateFormError]   = useState("");
  const [createFormLoading, setCreateFormLoading] = useState(false);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await apiRequest("/campaigns");
      const data = (res.data || []).map((c) => ({
        ...c,
        pct: Math.min(Math.floor(((c.raised || 0) / c.goalAmount) * 100), 100),
        color: "#c0453a",
      }));
      setCampaigns(data);
    } catch (err) { showBanner(err.message || "Failed to load campaigns", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCampaigns(); }, []);

  useEffect(() => {
    if (!selectedCampaign || role !== "donor") return;
    setVolunteerStatus(null);
    const checkStatus = async () => {
      try {
        const res = await apiRequest("/volunteers/my");
        const match = (res.data || []).find(
          (v) => v.campaign?._id?.toString() === selectedCampaign._id?.toString()
        );
        setVolunteerStatus(match ? match.status : null);
      } catch { setVolunteerStatus(null); }
    };
    checkStatus();
  }, [selectedCampaign, role]);

  const showBanner = (message, type = "success") => {
    setBanner({ message, type });
    setTimeout(() => setBanner({ message: "", type: "success" }), 4000);
  };

  const handleCreate = async () => {
    setCreateFormError("");
    const { title, description, goalAmount } = createForm;
    if (!title.trim() || title.trim().length < 3) return setCreateFormError("Title must be at least 3 characters");
    if (!description.trim() || description.trim().length < 10) return setCreateFormError("Description must be at least 10 characters");
    if (!goalAmount || Number(goalAmount) < 1) return setCreateFormError("Goal amount must be greater than 0");
    try {
      setCreateFormLoading(true);
      await apiRequest("/campaigns/create", "POST", { title: title.trim(), description: description.trim(), goalAmount: Number(goalAmount) });
      setShowCreateModal(false);
      setCreateForm({ title: "", description: "", goalAmount: "" });
      showBanner("Campaign created successfully ✓");
      fetchCampaigns();
    } catch (err) { setCreateFormError(err.message || "Failed to create campaign"); }
    finally { setCreateFormLoading(false); }
  };

  const handleApply = async () => {
    if (!selectedCampaign || loadingApply) return;
    try {
      setLoadingApply(true);
      await apiRequest("/volunteers/apply", "POST", { campaignId: selectedCampaign._id });
      setVolunteerStatus("pending");
      showBanner("Volunteer application submitted ✓");
    } catch (err) { showBanner(err.message || "Failed to apply", "error"); }
    finally { setLoadingApply(false); }
  };

  const closeDetail = () => { setSelectedCampaign(null); setVolunteerStatus(null); };

  const volunteerBtnLabel = () => {
    if (loadingApply)                   return "Applying…";
    if (volunteerStatus === "approved") return "✓ Approved";
    if (volunteerStatus === "rejected") return "✕ Rejected";
    if (volunteerStatus === "pending")  return "⏳ Pending";
    return "Volunteer Myself";
  };

  return (
    <div className="flex-1 p-4 md:p-7 flex flex-col">
      <div className="mb-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <div className="font-['DM_Serif_Display'] text-[22px] text-[#1a1a1a]">Campaigns</div>
          <div className="text-xs text-[#888]">All active fundraising campaigns</div>
        </div>
        {(role === "ngo" || role === "admin") && (
          <button onClick={() => setShowCreateModal(true)}
            className="bg-[#ff6600] hover:bg-[#e65c00] transition text-white px-4 py-2 rounded text-sm shadow-sm">
            + Create Campaign
          </button>
        )}
      </div>

      <Banner message={banner.message} type={banner.type} />

      {loading ? <div className="text-center py-16 text-sm text-[#aaa]">Loading campaigns…</div>
      : campaigns.length === 0 ? <div className="text-center py-16 text-sm text-[#aaa]">No campaigns yet.</div>
      : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
          {campaigns.map((c) => (
            <Card key={c._id} onClick={() => setSelectedCampaign(c)} className="cursor-pointer hover:shadow-md transition">
              <div className="flex justify-between mb-2">
                <div className="font-medium text-sm">{c.title}</div>
                <StatusBadge status={c.isActive ? "Active" : "Inactive"} />
              </div>
              <div className="flex justify-between text-xs mb-2 text-[#666]">
                <span>₹{(c.raised || 0).toLocaleString()} raised</span>
                <span>Goal: ₹{c.goalAmount?.toLocaleString()}</span>
              </div>
              <ProgressBar pct={c.pct} color={c.color} />
              <div className="flex justify-between text-xs mt-2 text-[#888]">
                <span>{c.pct}% funded</span><span>{c.donationsCount || 0} donations</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedCampaign && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-3">
          <div className="bg-white w-full max-w-md p-5 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <div className="text-lg font-semibold">{selectedCampaign.title}</div>
              <button onClick={closeDetail} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
            </div>
            <StatusBadge status={selectedCampaign.isActive ? "Active" : "Inactive"} />
            <div className="mt-3 text-sm text-[#666] leading-relaxed">{selectedCampaign.description || "No description available"}</div>
            <div className="mt-4 text-sm text-[#444] space-y-1.5">
              <div className="flex justify-between"><span className="text-[#888]">Goal</span><span className="font-medium">₹{selectedCampaign.goalAmount?.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-[#888]">Raised</span><span className="font-medium">₹{(selectedCampaign.raised || 0).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-[#888]">Donations</span><span className="font-medium">{selectedCampaign.donationsCount || 0}</span></div>
              <div className="flex justify-between"><span className="text-[#888]">Created</span><span className="font-medium">{new Date(selectedCampaign.createdAt).toLocaleDateString()}</span></div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1 text-[#888]"><span>Progress</span><span>{selectedCampaign.pct}%</span></div>
              <ProgressBar pct={selectedCampaign.pct} color={selectedCampaign.color} />
            </div>
            {role === "donor" && (
              <div className="mt-5">
                <button onClick={handleApply} disabled={!!volunteerStatus || loadingApply}
                  className={`w-full py-2 rounded text-white text-sm transition ${volunteerStatus ? "bg-gray-400 cursor-not-allowed" : "bg-[#ff6600] hover:bg-[#e65c00]"}`}>
                  {volunteerBtnLabel()}
                </button>
                {volunteerStatus && <p className="text-xs text-center text-[#888] mt-2">Application status: <span className="capitalize font-medium">{volunteerStatus}</span></p>}
              </div>
            )}
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-3">
          <div className="bg-white p-5 md:p-6 rounded-xl w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-semibold">Create Campaign</div>
              <button onClick={() => { setShowCreateModal(false); setCreateFormError(""); }} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
            </div>
            <input placeholder="Campaign title *" value={createForm.title} onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
              className="w-full mb-3 p-2.5 border border-black/10 rounded-lg outline-none focus:ring-2 focus:ring-[#ff6600]/40 text-sm" />
            <textarea placeholder="Description (min 10 chars) *" rows={3} value={createForm.description} onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              className="w-full mb-3 p-2.5 border border-black/10 rounded-lg outline-none focus:ring-2 focus:ring-[#ff6600]/40 text-sm resize-none" />
            <input placeholder="Goal amount (₹) *" type="number" min="1" value={createForm.goalAmount} onChange={(e) => setCreateForm({ ...createForm, goalAmount: e.target.value })}
              className="w-full mb-3 p-2.5 border border-black/10 rounded-lg outline-none focus:ring-2 focus:ring-[#ff6600]/40 text-sm" />
            {createFormError && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2 mb-3">{createFormError}</p>}
            <div className="flex justify-end gap-2">
              <button onClick={() => { setShowCreateModal(false); setCreateFormError(""); }} className="px-3 py-1.5 text-sm hover:bg-gray-100 rounded transition">Cancel</button>
              <button onClick={handleCreate} disabled={createFormLoading}
                className="bg-[#ff6600] hover:bg-[#e65c00] transition text-white px-4 py-1.5 rounded text-sm disabled:opacity-60">
                {createFormLoading ? "Creating…" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}