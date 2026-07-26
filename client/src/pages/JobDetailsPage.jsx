import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  MapPin,
  Clock,
  Briefcase,
  DollarSign,
  BarChart3,
  Users,
  CheckCircle2,
} from "lucide-react";
import MainLayout from "../layout/MainLayout";
import Loader from "../components/Loader";
import Avatar from "../components/Avatar";
import StarRating from "../components/StarRating";
import jobService from "../services/jobService";
import applicationService from "../services/applicationService";
import { formatCurrency, formatDate } from "../utils/helpers";
import { useAuth } from "../context/AuthContext";

const JobDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hiring, setHiring] = useState(null);

  const isOwner = user && job && job.client?._id === user._id;

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const data = await jobService.getJobById(id);
        setJob(data.job);
      } catch (err) {
        toast.error("Job not found");
        navigate("/jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  useEffect(() => {
    if (isOwner) {
      applicationService
        .getApplicationsForJob(id)
        .then((data) => setApplications(data.applications))
        .catch(() => {});
    }
  }, [isOwner, id]);

  const handleHire = async (freelancerId) => {
    setHiring(freelancerId);
    try {
      const data = await jobService.hireFreelancer(id, freelancerId);
      setJob(data.job);
      toast.success("Freelancer hired successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to hire freelancer");
    } finally {
      setHiring(null);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (!job) return null;

  return (
    <MainLayout>
      <section className="bg-hero-gradient py-16">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="glass-card p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="badge capitalize">{job.status.replace("-", " ")}</span>
                  <span className="text-xs text-ink/50 flex items-center gap-1">
                    <Clock size={12} /> Posted {formatDate(job.createdAt)}
                  </span>
                </div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-ink mb-4">
                  {job.title}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-ink/60 mb-6">
                  <span className="flex items-center gap-1">
                    <DollarSign size={15} className="text-mocha" />
                    {formatCurrency(job.budget)}
                    {job.budgetType === "hourly" ? "/hr" : " fixed"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase size={15} className="text-mocha" /> {job.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart3 size={15} className="text-mocha" /> {job.experienceLevel}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={15} className="text-mocha" /> {job.applicantsCount} proposals
                  </span>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="text-ink/70 whitespace-pre-line leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-mocha/10">
                  <h3 className="font-heading font-semibold text-ink mb-3">Skills Required</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skillsRequired.map((skill) => (
                      <span key={skill} className="badge">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {isOwner && (
                <div className="glass-card p-8">
                  <h2 className="font-heading font-semibold text-xl text-ink mb-6">
                    Applications ({applications.length})
                  </h2>
                  {applications.length === 0 ? (
                    <p className="text-sm text-ink/50">No applications received yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((app) => (
                        <div
                          key={app._id}
                          className="p-5 rounded-2xl bg-white/50 border border-mocha/10 flex flex-col sm:flex-row sm:items-center gap-4"
                        >
                          <Avatar
                            src={app.freelancer.profileImage}
                            name={app.freelancer.name}
                            size="md"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Link
                                to={`/freelancers/${app.freelancer._id}`}
                                className="font-heading font-semibold text-ink hover:text-mocha"
                              >
                                {app.freelancer.name}
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
                            <StarRating
                              rating={app.freelancer.rating}
                              numReviews={app.freelancer.numReviews}
                              size={12}
                            />
                            <p className="text-sm text-ink/60 mt-2 line-clamp-2">
                              {app.proposal}
                            </p>
                            <p className="text-sm font-heading font-semibold text-mocha mt-1">
                              Bid: {formatCurrency(app.bidAmount)}
                            </p>
                          </div>
                          {job.status === "open" && app.status === "pending" && (
                            <button
                              onClick={() => handleHire(app.freelancer._id)}
                              disabled={hiring === app.freelancer._id}
                              className="btn-primary !py-2 !px-4 text-sm shrink-0"
                            >
                              {hiring === app.freelancer._id ? "Hiring..." : "Hire"}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <h3 className="font-heading font-semibold text-ink mb-4">About the Client</h3>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar src={job.client?.profileImage} name={job.client?.name} size="md" />
                  <div>
                    <p className="font-heading font-semibold text-ink">{job.client?.name}</p>
                    {job.client?.location && (
                      <p className="text-xs text-ink/50 flex items-center gap-1">
                        <MapPin size={11} /> {job.client.location}
                      </p>
                    )}
                  </div>
                </div>
                <StarRating rating={job.client?.rating} numReviews={job.client?.numReviews} />
              </div>

              {user?.role === "freelancer" && job.status === "open" && (
                <Link to={`/apply/${job._id}`} className="btn-primary w-full">
                  <CheckCircle2 size={16} /> Apply Now
                </Link>
              )}

              {!user && (
                <Link to="/login" className="btn-primary w-full">
                  Log In to Apply
                </Link>
              )}

              {isOwner && (
                <Link to={`/dashboard/jobs`} className="btn-secondary w-full">
                  Manage This Job
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default JobDetailsPage;
