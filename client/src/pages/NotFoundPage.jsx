import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-10 left-[10%] w-72 h-72 rounded-full bg-nude/40 blur-3xl animate-blob" />
      <div className="absolute bottom-0 right-[10%] w-80 h-80 rounded-full bg-mocha/20 blur-3xl animate-blob" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-12 text-center max-w-lg relative z-10"
      >
        <h1 className="font-display text-8xl font-bold text-mocha mb-2">404</h1>
        <h2 className="font-heading text-2xl font-semibold text-ink mb-3">
          Page Not Found
        </h2>
        <p className="text-ink/60 mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/" className="btn-primary">
            <Home size={16} /> Go Home
          </Link>
          <button onClick={() => window.history.back()} className="btn-secondary">
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
