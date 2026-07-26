import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Bookmark } from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import JobCard from "../components/JobCard";
import userService from "../services/userService";

const SavedJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = async () => {
    try {
      const data = await userService.getSavedJobs();
      setJobs(data.savedJobs);
    } catch (err) {
      toast.error("Failed to load saved jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleUnsave = async (jobId) => {
    await userService.toggleSaveJob(jobId);
    setJobs((prev) => prev.filter((j) => j._id !== jobId));
    toast.success("Removed from saved jobs");
  };

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl font-bold text-ink mb-8">Saved Jobs</h1>

      {jobs.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved jobs"
          description="Save jobs you're interested in to easily find them later."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {jobs.map((job, i) => (
            <JobCard job={job} key={job._id} index={i} onSave={handleUnsave} isSaved={true} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default SavedJobsPage;
