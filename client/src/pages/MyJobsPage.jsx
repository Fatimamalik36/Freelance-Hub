import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Edit, Trash2, Eye, Briefcase } from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import jobService from "../services/jobService";
import { formatCurrency, formatDate } from "../utils/helpers";

const MyJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const data = await jobService.getMyJobs();
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
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await jobService.deleteJob(id);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      toast.success("Job deleted successfully");
    } catch (err) {
      toast.error("Failed to delete job");
    }
  };

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-ink">My Jobs</h1>
        <Link to="/post-job" className="btn-primary">
          <Plus size={16} /> Post New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs posted yet"
          description="Post your first job to start receiving proposals from talented freelancers."
          action={
            <Link to="/post-job" className="btn-primary">
              Post a Job
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job._id} className="glass-card p-6 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Link to={`/jobs/${job._id}`} className="font-heading font-semibold text-ink hover:text-mocha">
                    {job.title}
                  </Link>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                      job.status === "open"
                        ? "bg-green-100 text-green-700"
                        : job.status === "in-progress"
                        ? "bg-nude/40 text-mocha-dark"
                        : job.status === "completed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {job.status.replace("-", " ")}
                  </span>
                </div>
                <p className="text-sm text-ink/60">
                  {formatCurrency(job.budget)} {job.budgetType === "hourly" && "/hr"} · {job.applicantsCount} proposals · Posted {formatDate(job.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/jobs/${job._id}`} className="btn-secondary !py-2 !px-3">
                  <Eye size={15} />
                </Link>
                <button onClick={() => handleDelete(job._id)} className="btn-secondary !py-2 !px-3 !text-red-600">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyJobsPage;
