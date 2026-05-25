import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { slideLeft } from "../animation";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";

export default function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login } = useAuth();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const validate = () => {
    if (!email.trim())    return "Email is required";
    if (!password.trim()) return "Password is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email";
    return null;
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError("");
    const err = validate();
    if (err) { setError(err); return; }
    try {
      setLoading(true);
      const res = await apiRequest("/auth/login", "POST", { email, password });
      login(res.data.user, res.data.token);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <motion.div {...slideLeft} className="flex min-h-screen bg-[#f5f0eb]">
      <div className="hidden md:flex flex-1 justify-center items-center">
        <img src="/login.avif" className="w-[70%] max-w-md" alt="Heart Share" />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-6">
        <div className="mb-4">
          <Link to="/" className="text-sm text-[#aaa] hover:text-[#ff6600] transition">← Back to Home</Link>
        </div>
        <h1 className="text-[#ff6600] text-[38px] font-semibold">Welcome Back!</h1>
        <p className="mb-6 text-[#555] text-sm"><b>Share food. Spread kindness.</b></p>

        <div className="w-full max-w-[280px] flex flex-col gap-3">
          <input type="email" placeholder="Email address" value={email}
            onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            autoComplete="email" disabled={loading}
            className="p-3 outline-none border border-black/10 rounded-lg focus:ring-2 focus:ring-[#ff6600]/40 disabled:opacity-60" />

          <input type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            autoComplete="current-password" disabled={loading}
            className="p-3 outline-none border border-black/10 rounded-lg focus:ring-2 focus:ring-[#ff6600]/40 disabled:opacity-60" />

          {error && (
            <p className="text-red-500 text-xs text-center bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
          )}

          <button onClick={handleLogin} disabled={loading}
            className="bg-[#ff6600] hover:bg-[#e65c00] transition text-white p-3 rounded-lg font-medium disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? "Logging in…" : "Login"}
          </button>
        </div>

        <p className="mt-4 text-sm text-[#555]">
          New here?{" "}
          <Link to="/signup" className="text-[#ff6600] hover:underline font-medium">Create account</Link>
        </p>
      </div>
    </motion.div>
  );
}