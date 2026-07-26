import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, Briefcase, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      const redirectTo = location.state?.from?.pathname || "/dashboard";
      navigate(redirectTo);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === "client") setForm({ email: "sarah@client.com", password: "client123" });
    if (role === "freelancer") setForm({ email: "emma@freelancer.com", password: "freelancer123" });
    if (role === "admin") setForm({ email: "admin@freelancehub.com", password: "admin123" });
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-6 py-16 relative overflow-hidden">
      <div className="absolute top-10 left-[8%] w-72 h-72 rounded-full bg-nude/40 blur-3xl animate-blob" />
      <div className="absolute bottom-0 right-[8%] w-80 h-80 rounded-full bg-mocha/20 blur-3xl animate-blob" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-8 md:p-10 relative z-10"
      >
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-mocha-gradient flex items-center justify-center">
            <Briefcase size={18} className="text-cream" />
          </div>
          <span className="font-display text-xl font-bold text-ink">
            Freelance<span className="text-mocha">Hub</span>
          </span>
        </Link>

        <h1 className="font-heading text-2xl font-bold text-ink text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-sm text-ink/60 text-center mb-8">
          Log in to continue to your dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-mocha/60" />
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email address"
              className="input-field !pl-11"
            />
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-mocha/60" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Password"
              className="input-field !pl-11 !pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-mocha/60"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-mocha font-medium hover:underline">
              Forgot password?
            </Link>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Logging in..." : "Log In"} <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-mocha/10">
          <p className="text-xs text-center text-ink/50 mb-3">Try a demo account</p>
          <div className="flex gap-2">
            <button onClick={() => fillDemo("client")} className="btn-secondary !py-2 !px-3 text-xs flex-1">
              Client
            </button>
            <button onClick={() => fillDemo("freelancer")} className="btn-secondary !py-2 !px-3 text-xs flex-1">
              Freelancer
            </button>
            <button onClick={() => fillDemo("admin")} className="btn-secondary !py-2 !px-3 text-xs flex-1">
              Admin
            </button>
          </div>
        </div>

        <p className="text-sm text-center text-ink/60 mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-mocha font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
