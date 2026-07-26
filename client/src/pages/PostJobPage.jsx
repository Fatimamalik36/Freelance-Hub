import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Briefcase, ArrowRight } from "lucide-react";
import MainLayout from "../layout/MainLayout";
import jobService from "../services/jobService";
import { CATEGORIES } from "../utils/helpers";

const PostJobPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: CATEGORIES[0],
    skillsRequired: "",
    budgetType: "fixed",
    budget: "",
    duration: "",
    experienceLevel: "intermediate",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await jobService.createJob(form);
      toast.success("Job posted successfully!");
      navigate(`/jobs/${data.job._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <section className="bg-hero-gradient py-16">
        <div className="section-container max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-mocha-gradient flex items-center justify-center mx-auto mb-4">
              <Briefcase size={24} className="text-cream" />
            </div>
            <h1 className="font-display text-3xl font-bold text-ink">Post a New Job</h1>
            <p className="text-ink/60 mt-2">
              Describe your project and start receiving proposals from top freelancers.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="glass-card p-8 space-y-5"
          >
            <div>
              <label className="text-sm font-heading font-medium text-ink mb-2 block">Job Title</label>
              <input
                name="title"
                required
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Design a modern logo for my startup"
                className="input-field"
              />
            </div>

            <div>
              <label className="text-sm font-heading font-medium text-ink mb-2 block">
                Job Description
              </label>
              <textarea
                name="description"
                required
                rows={6}
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the project scope, deliverables, and requirements..."
                className="input-field resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-heading font-medium text-ink mb-2 block">Category</label>
                <select name="category" value={form.category} onChange={handleChange} className="input-field">
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-heading font-medium text-ink mb-2 block">
                  Experience Level
                </label>
                <select
                  name="experienceLevel"
                  value={form.experienceLevel}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="entry">Entry Level</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-heading font-medium text-ink mb-2 block">
                Skills Required (comma separated)
              </label>
              <input
                name="skillsRequired"
                value={form.skillsRequired}
                onChange={handleChange}
                placeholder="e.g. React, Node.js, MongoDB"
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="text-sm font-heading font-medium text-ink mb-2 block">Budget Type</label>
                <select name="budgetType" value={form.budgetType} onChange={handleChange} className="input-field">
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Hourly Rate</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-heading font-medium text-ink mb-2 block">
                  Budget ($)
                </label>
                <input
                  type="number"
                  name="budget"
                  required
                  min="1"
                  value={form.budget}
                  onChange={handleChange}
                  placeholder="500"
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-sm font-heading font-medium text-ink mb-2 block">Duration</label>
                <input
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="e.g. 2 weeks"
                  className="input-field"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Posting..." : "Post Job"} <ArrowRight size={16} />
            </button>
          </motion.form>
        </div>
      </section>
    </MainLayout>
  );
};

export default PostJobPage;
