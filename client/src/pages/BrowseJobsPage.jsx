import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Briefcase } from "lucide-react";
import MainLayout from "../layout/MainLayout";
import JobCard from "../components/JobCard";
import { GridSkeleton } from "../components/Skeletons";
import EmptyState from "../components/EmptyState";
import jobService from "../services/jobService";
import userService from "../services/userService";
import useDebounce from "../hooks/useDebounce";
import { CATEGORIES } from "../utils/helpers";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const BrowseJobsPage = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [budgetType, setBudgetType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [jobs, setJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(search);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await jobService.getJobs({
        search: debouncedSearch,
        category,
        budgetType,
        experienceLevel,
        page,
        limit: 9,
      });
      setJobs(data.jobs);
      setPages(data.pages || 1);
    } catch (err) {
      // fail silently, empty state shows
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, budgetType, experienceLevel, page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    if (user?.role === "freelancer") {
      userService
        .getSavedJobs()
        .then((data) => setSavedJobIds(data.savedJobs.map((j) => j._id)))
        .catch(() => {});
    }
  }, [user]);

  const handleSave = async (jobId) => {
    if (!user) {
      toast.error("Please log in to save jobs");
      return;
    }
    try {
      const data = await userService.toggleSaveJob(jobId);
      setSavedJobIds(data.savedJobs);
      toast.success(data.saved ? "Job saved" : "Job removed from saved");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <MainLayout>
      <section className="bg-hero-gradient py-20">
        <div className="section-container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl md:text-5xl font-bold text-ink"
          >
            Find Your Next Project
          </motion.h1>
          <p className="text-ink/60 mt-4 max-w-xl mx-auto">
            Explore thousands of jobs posted by clients around the world.
          </p>

          <div className="mt-8 max-w-xl mx-auto glass-card p-2 flex items-center gap-2">
            <Search size={20} className="text-mocha ml-3 shrink-0" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search jobs by title, skill, or keyword..."
              className="flex-1 bg-transparent outline-none px-2 py-2 text-ink placeholder:text-ink/40"
            />
            <button
              onClick={() => setShowFilters((p) => !p)}
              className="btn-secondary !py-2.5 !px-4"
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 max-w-2xl mx-auto glass-card p-4 flex flex-wrap items-center gap-3 justify-center"
            >
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="input-field !w-auto text-sm"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                value={budgetType}
                onChange={(e) => {
                  setBudgetType(e.target.value);
                  setPage(1);
                }}
                className="input-field !w-auto text-sm"
              >
                <option value="">Any Budget Type</option>
                <option value="fixed">Fixed Price</option>
                <option value="hourly">Hourly</option>
              </select>
              <select
                value={experienceLevel}
                onChange={(e) => {
                  setExperienceLevel(e.target.value);
                  setPage(1);
                }}
                className="input-field !w-auto text-sm"
              >
                <option value="">Any Experience</option>
                <option value="entry">Entry Level</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="section-container">
          {loading ? (
            <GridSkeleton count={9} />
          ) : jobs.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No jobs found"
              description="Try adjusting your search or filters to find more opportunities."
              action={
                <Link to="/post-job" className="btn-primary">
                  Post a Job
                </Link>
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job, i) => (
                  <JobCard
                    job={job}
                    key={job._id}
                    index={i}
                    onSave={user?.role === "freelancer" ? handleSave : null}
                    isSaved={savedJobIds.includes(job._id)}
                  />
                ))}
              </div>

              {pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  {Array.from({ length: pages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-full font-heading text-sm font-semibold transition-colors ${
                        page === i + 1
                          ? "bg-mocha-gradient text-cream"
                          : "bg-white/60 text-ink hover:bg-white"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default BrowseJobsPage;
