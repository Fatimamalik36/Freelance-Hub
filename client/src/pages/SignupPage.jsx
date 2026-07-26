import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Mail, Lock, User, Briefcase, ArrowRight, Palette, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const SignupPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "client" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await signup(form);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
          Create Your Account
        </h1>
        <p className="text-sm text-ink/60 text-center mb-8">
          Join thousands building great things together
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setForm({ ...form, role: "client" })}
            className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
              form.role === "client"
                ? "border-mocha bg-nude/30"
                : "border-mocha/10 bg-white/50"
            }`}
          >
            <Briefcase size={22} className="text-mocha" />
            <span className="text-sm font-heading font-semibold text-ink">I'm a Client</span>
            <span className="text-xs text-ink/50 text-center">I want to hire talent</span>
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, role: "freelancer" })}
            className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
              form.role === "freelancer"
                ? "border-mocha bg-nude/30"
                : "border-mocha/10 bg-white/50"
            }`}
          >
            <Palette size={22} className="text-mocha" />
            <span className="text-sm font-heading font-semibold text-ink">I'm a Freelancer</span>
            <span className="text-xs text-ink/50 text-center">I want to find work</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-mocha/60" />
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Full name"
              className="input-field !pl-11"
            />
          </div>
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
              placeholder="Password (min 6 characters)"
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

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account..." : "Create Account"} <ArrowRight size={16} />
          </button>
        </form>

        <p className="text-sm text-center text-ink/60 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-mocha font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignupPage;
