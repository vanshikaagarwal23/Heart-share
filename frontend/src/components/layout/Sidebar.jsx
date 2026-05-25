import { useNavigate } from "react-router-dom";
import Avatar from "../ui/Avatar";
import { useAuth } from "../../context/AuthContext";

function getInitials(name = "") {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U";
}

const ROLE_LABELS = {
  donor: "Donor",
  ngo:   "NGO Manager",
  admin: "Administrator",
};

export default function Sidebar({ activePage, setActivePage }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const NAV = [
    "Dashboard",
    "Donations",
    "Campaigns",
    "Volunteers",
    "Reports",
    ...(role === "admin" ? ["Admin"] : []),
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const displayName = user?.name || "User";
  const roleLabel   = ROLE_LABELS[role] || "Member";
  const initials    = getInitials(displayName);

  return (
    <div className="w-[200px] lg:w-[220px] bg-[#faf6f1] px-4 lg:px-5 py-6 flex flex-col h-screen rounded-[10px] border border-black/10 shadow-[0_4px_40px_rgba(0,0,0,0.08)]">

      <div className="flex items-center gap-2 text-[17px] font-['DM_Serif_Display'] mb-5">
        <div className="w-[10px] h-[10px] bg-[#c0453a] rounded-full" />
        Heart Share
      </div>

      <div className="flex gap-[10px] p-3 bg-[#f0ebe4] rounded-[10px] mb-6">
        <Avatar initials={initials} bg="#e8c1a0" text="#7a4a2a" size={34} />
        <div className="overflow-hidden">
          <div className="text-sm font-medium truncate" title={displayName}>
            {displayName}
          </div>
          <div className="text-xs text-gray-500">{roleLabel}</div>
        </div>
      </div>

      <nav className="flex flex-col gap-[6px]">
        {NAV.map((item) => (
          <div
            key={item}
            onClick={() => setActivePage(item)}
            className={`px-[10px] py-[10px] rounded-[8px] cursor-pointer text-[#555] hover:bg-[#f3ecea] transition-colors ${
              activePage === item ? "bg-[#efe7e5] text-[#c0453a] font-medium" : ""
            }`}
          >
            {item}
          </div>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto text-[12px] text-[#aaa] hover:text-[#c0453a] transition-colors text-left cursor-pointer"
      >
        Log out
      </button>

    </div>
  );
}