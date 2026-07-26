import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Users } from "lucide-react";
import MainLayout from "../layout/MainLayout";
import FreelancerCard from "../components/FreelancerCard";
import { GridSkeleton } from "../components/Skeletons";
import EmptyState from "../components/EmptyState";
import userService from "../services/userService";
import useDebounce from "../hooks/useDebounce";

const skillOptions = [
  "UI Design",
  "React",
  "Node.js",
  "Copywriting",
  "SEO",
  "Flutter",
  "Video Editing",
  "Figma",
];

const BrowseFreelancersPage = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [skill, setSkill] = useState(searchParams.get("skill") || "");
  const [minRate, setMinRate] = useState("");
  const [maxRate, setMaxRate] = useState("");
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(search);

  const fetchFreelancers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userService.getFreelancers({
        search: debouncedSearch,
        skill,
        minRate,
        maxRate,
        page,
        limit: 9,
      });
      setFreelancers(data.freelancers);
      setPages(data.pages || 1);
    } catch (err) {
      // fail silently, empty state shows
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, skill, minRate, maxRate, page]);

  useEffect(() => {
    fetchFreelancers();
  }, [fetchFreelancers]);

  return (
    <MainLayout>
      <section className="bg-hero-gradient py-20">
        <div className="section-container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl md:text-5xl font-bold text-ink"
          >
            Discover Top Freelance Talent
          </motion.h1>
          <p className="text-ink/60 mt-4 max-w-xl mx-auto">
            Browse thousands of verified professionals ready for your next project.
          </p>

          <div className="mt-8 max-w-xl mx-auto glass-card p-2 flex items-center gap-2">
            <Search size={20} className="text-mocha ml-3 shrink-0" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, title, or skill..."
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
                value={skill}
                onChange={(e) => {
                  setSkill(e.target.value);
                  setPage(1);
                }}
                className="input-field !w-auto text-sm"
              >
                <option value="">All Skills</option>
                {skillOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Min rate"
                value={minRate}
                onChange={(e) => {
                  setMinRate(e.target.value);
                  setPage(1);
                }}
                className="input-field !w-28 text-sm"
              />
              <input
                type="number"
                placeholder="Max rate"
                value={maxRate}
                onChange={(e) => {
                  setMaxRate(e.target.value);
                  setPage(1);
                }}
                className="input-field !w-28 text-sm"
              />
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="section-container">
          {loading ? (
            <GridSkeleton count={9} />
          ) : freelancers.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No freelancers found"
              description="Try adjusting your search or filters to find more talent."
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {freelancers.map((f, i) => (
                  <FreelancerCard freelancer={f} key={f._id} index={i} />
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

export default BrowseFreelancersPage;
