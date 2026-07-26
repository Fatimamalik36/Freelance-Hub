import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Trash2, Eye } from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";
import Loader from "../components/Loader";
import adminService from "../services/adminService";
import { formatCurrency, formatDate } from "../utils/helpers";

const AdminManageJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const data = await adminService.getAllJobs();
      setJobs(data.jobs);
    } catch (err) {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job permanently?")) return;
    try {
      await adminService.deleteJob(id);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      toast.success("Job deleted");
    } catch (err) {
      toast.error("Failed to delete job");
    }
  };

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl font-bold text-ink mb-6">Manage Jobs</h1>

      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-nude/20 text-left">
            <tr>
              <th className="p-4 font-heading font-semibold text-ink">Title</th>
              <th className="p-4 font-heading font-semibold text-ink">Client</th>
              <th className="p-4 font-heading font-semibold text-ink">Budget</th>
              <th className="p-4 font-heading font-semibold text-ink">Status</th>
              <th className="p-4 font-heading font-semibold text-ink">Posted</th>
              <th className="p-4 font-heading font-semibold text-ink">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id} className="border-t border-mocha/10">
                <td className="p-4 text-ink font-medium">{job.title}</td>
                <td className="p-4 text-ink/60">{job.client?.name}</td>
                <td className="p-4 text-mocha font-heading font-semibold">
                  {formatCurrency(job.budget)}
                </td>
                <td className="p-4 capitalize text-ink/60">{job.status.replace("-", " ")}</td>
                <td className="p-4 text-ink/50">{formatDate(job.createdAt)}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Link to={`/jobs/${job._id}`} className="btn-secondary !py-1.5 !px-2.5">
                      <Eye size={14} />
                    </Link>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="btn-secondary !py-1.5 !px-2.5 !text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default AdminManageJobsPage;
