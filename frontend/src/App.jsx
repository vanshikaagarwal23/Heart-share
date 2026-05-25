import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/routing/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import Login       from "./pages/Login";
import Signup      from "./pages/Signup";
import Admin       from "./pages/Admin";
import Sidebar     from "./components/layout/Sidebar";
import RightPanel  from "./components/layout/RightPanel";
import Dashboard   from "./pages/Dashboard";
import Donations   from "./pages/Donations";
import Campaigns   from "./pages/Campaigns";
import Volunteers  from "./pages/Volunteers";
import Reports     from "./pages/Reports";

function DashboardLayout() {
  const [activePage, setActivePage]   = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pages = {
    Dashboard:  <Dashboard />,
    Donations:  <Donations />,
    Campaigns:  <Campaigns />,
    Volunteers: <Volunteers />,
    Reports:    <Reports />,
    Admin:      <Admin />,
  };

  return (
    <div className="font-[DM_Sans] bg-[#f0e6d3] min-h-screen flex items-center justify-center p-4 md:p-6 relative">
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded shadow"
        aria-label="Open menu"
      >☰</button>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex gap-5 w-full max-w-[1040px]">
        <div className={`fixed md:static top-0 left-0 h-full z-40 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
          <Sidebar
            activePage={activePage}
            setActivePage={(page) => { setActivePage(page); setSidebarOpen(false); }}
          />
        </div>

        <div className="flex flex-1 bg-white rounded-[10px] border border-black/10 overflow-hidden shadow-[0_4px_40px_rgba(0,0,0,0.08)]">
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 flex flex-col overflow-y-auto">{pages[activePage]}</div>
            {activePage === "Dashboard" && <div className="hidden lg:block"><RightPanel /></div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* Landing page — always public */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth pages — redirect if already logged in */}
        <Route path="/login"  element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

        {/* Protected dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AnimatedRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}