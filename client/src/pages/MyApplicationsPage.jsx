import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FileText, X } from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import applicationService from "../services/applicationService";
import { formatCurrency, formatDate } from "../utils/helpers";

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const data = await applicationService.getMyApplications();
      setApplications(data.applications);
    } catch (err) {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (id) => {
    if (!window.confirm("Withdraw this application?")) return;
    try {
      await applicationService.withdrawApplication(id);
      setApplications((prev) => prev.filter((a) => a._id !== id));
      toast.success("Application withdrawn");
    } catch (err) {
      toast.error("Failed to withdraw application");
    }
  };

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl font-bold text-ink mb-8">My Applications</h1>

      {applications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No applications yet"
          description="Browse open jobs and submit your first proposal."
          action={
            <Link to="/jobs" className="btn-primary">
              Browse Jobs
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="glass-card p-6 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Link
                    to={`/jobs/${app.job._id}`}
                    className="font-heading font-semibold text-ink hover:text-mocha"
                  >
                    {app.job.title}
                  </Link>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                      app.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : app.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-nude/40 text-mocha-dark"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
                <p className="text-sm text-ink/60">
                  Bid: {formatCurrency(app.bidAmount)} · Client: {app.job.client?.name} · Applied {formatDate(app.createdAt)}
                </p>
              </div>
              {app.status === "pending" && (
                <button
                  onClick={() => handleWithdraw(app._id)}
                  className="btn-secondary !py-2 !px-3 !text-red-600 shrink-0"
                >
                  <X size={15} /> Withdraw
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyApplicationsPage;
