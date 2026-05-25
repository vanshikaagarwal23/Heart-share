import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { slideRight } from "../animation";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";

export default function Signup() {
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [role,     setRole]     = useState("donor");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const validate = () => {
    if (!name.trim() || name.trim().length < 2) return "Name must be at least 2 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email";
    if (!password || password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleSignup = async (e) => {
    e?.preventDefault();
    setError("");
    const err = validate();
    if (err) { setError(err); return; }
    try {
      setLoading(true);
      const res = await apiRequest("/auth/register", "POST", { name, email, password, role });
      login(res.data.user, res.data.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <motion.div {...slideRight} className="flex min-h-screen bg-[#f5f0eb]">
      <div className="flex-1 flex flex-col justify-center items-center px-6">
        <div className="mb-4">
          <Link to="/" className="text-sm text-[#aaa] hover:text-[#ff6600] transition">← Back to Home</Link>
        </div>
        <h1 className="text-[#ff6600] text-[38px] font-semibold">Create Account</h1>
        <p className="mb-6 text-[#555] text-sm"><b>Join the kindness movement!</b></p>

        <div className="w-full max-w-[280px] flex flex-col gap-3">
          <input type="text" placeholder="Full Name" value={name}
            onChange={(e) => setName(e.target.value)} disabled={loading} autoComplete="name"
            className="p-3 outline-none border border-black/10 rounded-lg focus:ring-2 focus:ring-[#ff6600]/40 disabled:opacity-60" />

          <input type="email" placeholder="Email address" value={email}
            onChange={(e) => setEmail(e.target.value)} disabled={loading} autoComplete="email"
            className="p-3 outline-none border border-black/10 rounded-lg focus:ring-2 focus:ring-[#ff6600]/40 disabled:opacity-60" />

          <input type="password" placeholder="Password (min 6 chars)" value={password}
            onChange={(e) => setPassword(e.target.value)} disabled={loading}
            onKeyDown={(e) => e.key === "Enter" && handleSignup()} autoComplete="new-password"
            className="p-3 outline-none border border-black/10 rounded-lg focus:ring-2 focus:ring-[#ff6600]/40 disabled:opacity-60" />

          <div className="flex gap-4 justify-center py-1">
            {["donor", "ngo"].map((r) => (
              <label key={r} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="role" value={r} checked={role === r}
                  onChange={() => setRole(r)} disabled={loading} className="accent-[#ff6600]" />
                <span className="text-[#444] text-sm">{r === "ngo" ? "NGO" : "Donor"}</span>
              </label>
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-xs text-center bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
          )}

          <button onClick={handleSignup} disabled={loading}
            className="bg-[#ff6600] hover:bg-[#e65c00] transition text-white p-3 rounded-lg font-medium disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </div>

        <p className="mt-4 text-sm text-[#555]">
          Already have an account?{" "}
          <Link to="/login" className="text-[#ff6600] hover:underline font-medium">Login</Link>
        </p>
      </div>

      <div className="hidden md:flex flex-1 justify-center items-center">
        <img src="/login.avif" className="w-[70%] max-w-md" alt="Heart Share" />
      </div>
    </motion.div>
  );
}