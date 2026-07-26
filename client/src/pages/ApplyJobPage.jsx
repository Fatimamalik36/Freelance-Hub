import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Send } from "lucide-react";
import MainLayout from "../layout/MainLayout";
import Loader from "../components/Loader";
import jobService from "../services/jobService";
import applicationService from "../services/applicationService";
import { formatCurrency } from "../utils/helpers";

const ApplyJobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ proposal: "", bidAmount: "", duration: "" });

  useEffect(() => {
    jobService
      .getJobById(id)
      .then((data) => {
        setJob(data.job);
        setForm((f) => ({ ...f, bidAmount: data.job.budget }));
      })
      .catch(() => {
        toast.error("Job not found");
        navigate("/jobs");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await applicationService.applyToJob(id, form);
      toast.success("Application submitted successfully!");
      navigate("/dashboard/applications");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (!job) return null;

  return (
    <MainLayout>
      <section className="bg-hero-gradient py-16">
        <div className="section-container max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
            <span className="badge mb-3">Applying to</span>
            <h1 className="font-display text-2xl font-bold text-ink mb-2">{job.title}</h1>
            <p className="text-sm text-ink/60 mb-6">
              Client's budget: {formatCurrency(job.budget)}
              {job.budgetType === "hourly" && "/hr"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-heading font-medium text-ink mb-2 block">
                  Cover Letter / Proposal
                </label>
                <textarea
                  required
                  rows={8}
                  value={form.proposal}
                  onChange={(e) => setForm({ ...form, proposal: e.target.value })}
                  placeholder="Explain why you're the right fit for this project..."
                  className="input-field resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-heading font-medium text-ink mb-2 block">
                    Your Bid ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={form.bidAmount}
                    onChange={(e) => setForm({ ...form, bidAmount: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="text-sm font-heading font-medium text-ink mb-2 block">
                    Estimated Duration
                  </label>
                  <input
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="e.g. 1 week"
                    className="input-field"
                  />
                </div>
              </div>

              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? "Submitting..." : "Submit Application"} <Send size={16} />
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default ApplyJobPage;
