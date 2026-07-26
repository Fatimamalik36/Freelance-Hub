import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Briefcase,
  FileText,
  Handshake,
  CheckCircle2,
  Clock,
  MessageSquare,
  Bell,
  BarChart3,
  Users,
  DollarSign,
  Plus,
} from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";
import StatCard from "../components/StatCard";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import userService from "../services/userService";
import adminService from "../services/adminService";
import { formatCurrency } from "../utils/helpers";

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user.role === "admin") {
          const data = await adminService.getAnalytics();
          setAnalytics(data.analytics);
        } else {
          const data = await userService.getDashboardStats();
          setStats(data.stats);
        }
      } catch (err) {
        // fail silently
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-ink">
          Welcome back, {user.name.split(" ")[0]} 👋
        </h1>
        <p className="text-ink/60 mt-1">
          Here's what's happening with your {user.role === "client" ? "projects" : user.role === "admin" ? "platform" : "work"} today.
        </p>
      </motion.div>

      {user.role === "admin" && analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard icon={Users} label="Total Users" value={analytics.totalUsers} index={0} />
          <StatCard icon={Briefcase} label="Total Jobs Posted" value={analytics.totalJobs} index={1} />
          <StatCard icon={CheckCircle2} label="Jobs Completed" value={analytics.completedJobs} index={2} />
          <StatCard icon={FileText} label="Total Applications" value={analytics.totalApplications} index={3} />
          <StatCard icon={DollarSign} label="Total Revenue" value={formatCurrency(analytics.totalRevenue)} index={4} accent="mocha" />
          <StatCard icon={Users} label="Clients" value={analytics.totalClients} index={5} />
          <StatCard icon={Users} label="Freelancers" value={analytics.totalFreelancers} index={6} />
          <StatCard icon={BarChart3} label="Open Jobs" value={analytics.openJobs} index={7} />
        </div>
      )}

      {user.role === "client" && stats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatCard icon={Briefcase} label="Jobs Posted" value={stats.jobsPosted} index={0} />
            <StatCard icon={Handshake} label="Active Contracts" value={stats.activeContracts} index={1} />
            <StatCard icon={CheckCircle2} label="Completed Projects" value={stats.completedProjects} index={2} />
            <StatCard icon={Clock} label="Pending Payments" value={stats.pendingPayments} index={3} accent="mocha" />
          </div>
          <div className="glass-card p-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-semibold text-lg text-ink">Ready to hire?</h3>
              <p className="text-sm text-ink/60">Post a new job and start receiving proposals today.</p>
            </div>
            <Link to="/post-job" className="btn-primary">
              <Plus size={16} /> Post a Job
            </Link>
          </div>
        </>
      )}

      {user.role === "freelancer" && stats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatCard icon={FileText} label="Jobs Applied" value={stats.jobsApplied} index={0} />
            <StatCard icon={Handshake} label="Active Contracts" value={stats.activeContracts} index={1} />
            <StatCard icon={CheckCircle2} label="Completed Projects" value={stats.completedProjects} index={2} />
            <StatCard icon={Clock} label="Pending Payments" value={stats.pendingPayments} index={3} accent="mocha" />
          </div>
          <div className="glass-card p-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-semibold text-lg text-ink">Find your next project</h3>
              <p className="text-sm text-ink/60">Browse open jobs that match your skills.</p>
            </div>
            <Link to="/jobs" className="btn-primary">
              Browse Jobs
            </Link>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;
