import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Menu,
  X,
  Bell,
  MessageSquare,
  ChevronDown,
  LayoutDashboard,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import useNotifications from "../hooks/useNotifications";
import Avatar from "../components/Avatar";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Find Talent", to: "/freelancers" },
  { label: "Find Work", to: "/jobs" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-navbar shadow-soft" : "bg-transparent"
      }`}
    >
      <div className="section-container flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-mocha-gradient flex items-center justify-center">
            <Briefcase size={20} className="text-cream" />
          </div>
          <span className="font-display text-2xl font-bold text-ink">
            Freelance<span className="text-mocha">Hub</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `text-sm font-heading font-medium transition-colors ${
                  isActive ? "text-mocha" : "text-ink/70 hover:text-mocha"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <>
              <Link
                to="/notifications"
                className="relative w-10 h-10 rounded-full bg-white/60 flex items-center justify-center hover:bg-white transition-colors"
              >
                <Bell size={18} className="text-mocha" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-mocha text-cream text-[10px] flex items-center justify-center font-bold">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
              <Link
                to="/messages"
                className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center hover:bg-white transition-colors"
              >
                <MessageSquare size={18} className="text-mocha" />
              </Link>

              <div className="relative">
                <button
                  onClick={() => setProfileOpen((p) => !p)}
                  className="flex items-center gap-2"
                >
                  <Avatar src={user.profileImage} name={user.name} size="sm" />
                  <ChevronDown size={14} className="text-ink/60" />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-56 glass-card p-2 z-50"
                    >
                      <p className="px-3 py-2 text-xs text-ink/50">
                        Signed in as <span className="font-semibold text-ink">{user.role}</span>
                      </p>
                      <Link
                        to="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-nude/30 transition-colors"
                      >
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                      <Link
                        to={`/freelancers/${user._id}`}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-nude/30 transition-colors"
                      >
                        <User size={16} /> My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-nude/30 transition-colors text-left text-red-600"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary !px-5 !py-2.5 text-sm">
                Log In
              </Link>
              <Link to="/signup" className="btn-primary !px-5 !py-2.5 text-sm">
                Join Now
              </Link>
            </>
          )}
        </div>

        <button
          className="lg:hidden text-ink"
          onClick={() => setMobileOpen((p) => !p)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden glass-navbar overflow-hidden"
          >
            <div className="section-container py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-heading font-medium text-ink/80 py-2"
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="h-px bg-mocha/10 my-2" />
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="btn-secondary">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="btn-outline">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary">
                    Log In
                  </Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-primary">
                    Join Now
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
