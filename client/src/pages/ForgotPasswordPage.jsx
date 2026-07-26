import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Mail, Briefcase, ArrowRight, CheckCircle2 } from "lucide-react";
import authService from "../services/authService";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success("Reset instructions sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
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

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-nude/40 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} className="text-mocha" />
            </div>
            <h1 className="font-heading text-xl font-bold text-ink mb-2">Check Your Email</h1>
            <p className="text-sm text-ink/60 mb-6">
              If an account exists for {email}, you'll receive password reset instructions
              shortly.
            </p>
            <Link to="/login" className="btn-primary w-full">
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-heading text-2xl font-bold text-ink text-center mb-2">
              Forgot Password?
            </h1>
            <p className="text-sm text-ink/60 text-center mb-8">
              Enter your email and we'll send you reset instructions
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-mocha/60" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="input-field !pl-11"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Sending..." : "Send Reset Instructions"} <ArrowRight size={16} />
              </button>
            </form>
          </>
        )}

        <p className="text-sm text-center text-ink/60 mt-6">
          Remember your password?{" "}
          <Link to="/login" className="text-mocha font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
