import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  Bell,
  User,
  CreditCard,
  Users,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

const DashboardLayout = ({ children }) => {
  const { user } = useAuth();

  const clientLinks = [
    { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
    { label: "My Jobs", to: "/dashboard/jobs", icon: Briefcase },
    { label: "Messages", to: "/messages", icon: MessageSquare },
    { label: "Notifications", to: "/notifications", icon: Bell },
    { label: "Payments", to: "/dashboard/payments", icon: CreditCard },
  ];

  const freelancerLinks = [
    { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
    { label: "My Applications", to: "/dashboard/applications", icon: FileText },
    { label: "Saved Jobs", to: "/dashboard/saved-jobs", icon: Briefcase },
    { label: "Messages", to: "/messages", icon: MessageSquare },
    { label: "Notifications", to: "/notifications", icon: Bell },
    { label: "Payments", to: "/dashboard/payments", icon: CreditCard },
  ];

  const adminLinks = [
    { label: "Overview", to: "/dashboard", icon: BarChart3 },
    { label: "Manage Users", to: "/dashboard/users", icon: Users },
    { label: "Manage Jobs", to: "/dashboard/manage-jobs", icon: Briefcase },
  ];

  const links =
    user?.role === "admin"
      ? adminLinks
      : user?.role === "client"
      ? clientLinks
      : freelancerLinks;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 pt-20">
        <div className="section-container py-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside className="glass-card p-4 h-fit lg:sticky lg:top-28">
            <div className="flex items-center gap-3 p-3 mb-2">
              <User size={18} className="text-mocha" />
              <div>
                <p className="text-sm font-heading font-semibold text-ink">{user?.name}</p>
                <p className="text-xs text-ink/50 capitalize">{user?.role}</p>
              </div>
            </div>
            <nav className="flex flex-col gap-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/dashboard"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-heading font-medium transition-colors ${
                      isActive
                        ? "bg-mocha-gradient text-cream shadow-soft"
                        : "text-ink/70 hover:bg-nude/30"
                    }`
                  }
                >
                  <link.icon size={17} />
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </aside>

          <div className="min-w-0">{children}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
