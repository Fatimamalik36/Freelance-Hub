import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  ArrowRight,
  Palette,
  Code2,
  PenTool,
  Megaphone,
  Video,
  Smartphone,
  Music,
  Briefcase,
  Star,
  Users,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Clock,
  ChevronDown,
} from "lucide-react";
import MainLayout from "../layout/MainLayout";
import FreelancerCard from "../components/FreelancerCard";
import JobCard from "../components/JobCard";
import { GridSkeleton } from "../components/Skeletons";
import userService from "../services/userService";
import jobService from "../services/jobService";
import { CATEGORIES } from "../utils/helpers";

const categoryIcons = {
  Design: Palette,
  Development: Code2,
  Writing: PenTool,
  Marketing: Megaphone,
  "Video & Animation": Video,
  "Mobile Development": Smartphone,
  "Music & Audio": Music,
  Business: Briefcase,
};

const stats = [
  { label: "Active Freelancers", value: "25,000+", icon: Users },
  { label: "Jobs Completed", value: "48,000+", icon: CheckCircle2 },
  { label: "Client Satisfaction", value: "98%", icon: Star },
  { label: "Countries Served", value: "120+", icon: TrendingUp },
];

const steps = [
  {
    title: "Create Your Account",
    description: "Sign up as a client or freelancer in under a minute — completely free.",
    icon: Users,
  },
  {
    title: "Post or Browse",
    description: "Clients post jobs, freelancers browse and apply with tailored proposals.",
    icon: Search,
  },
  {
    title: "Collaborate Securely",
    description: "Chat in real-time, share files, and track progress inside your dashboard.",
    icon: ShieldCheck,
  },
  {
    title: "Get Paid Safely",
    description: "Secure milestone-based payments protect both clients and freelancers.",
    icon: Clock,
  },
];

const testimonials = [
  {
    name: "Rachel Adams",
    role: "Founder, Bloom Skincare",
    quote:
      "FreelanceHub helped us find a designer who completely transformed our brand identity within two weeks. The quality bar here is unmatched.",
    avatar: "",
  },
  {
    name: "Tom Becker",
    role: "CTO, Northwind Labs",
    quote:
      "We've hired 6 developers through this platform. The vetting and communication tools make remote collaboration genuinely effortless.",
    avatar: "",
  },
  {
    name: "Priya Sharma",
    role: "Freelance Copywriter",
    quote:
      "As a freelancer, the dashboard and secure payments give me total peace of mind. I've doubled my client base in 3 months.",
    avatar: "",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    description: "For clients posting occasional projects",
    features: ["Post up to 2 jobs/month", "Basic messaging", "Standard support", "Freelancer browsing"],
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$49",
    period: "/month",
    description: "For growing teams hiring regularly",
    features: [
      "Unlimited job posts",
      "Priority support",
      "Advanced filters & analytics",
      "Featured job listings",
      "Dedicated account manager",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For agencies & large organizations",
    features: [
      "Everything in Professional",
      "Custom contracts & invoicing",
      "API access",
      "SLA guarantees",
      "White-glove onboarding",
    ],
    highlighted: false,
  },
];

const faqs = [
  {
    q: "How does FreelanceHub verify freelancers?",
    a: "Every freelancer undergoes identity verification, and top talent earns a verified badge after completing skills assessments and receiving strong client reviews.",
  },
  {
    q: "What fees does FreelanceHub charge?",
    a: "Clients can post jobs for free. Freelancers pay a small service fee only on completed, paid contracts — there are no hidden charges.",
  },
  {
    q: "Is payment protection included?",
    a: "Yes. All contract payments are held securely and released based on agreed milestones, protecting both clients and freelancers.",
  },
  {
    q: "Can I hire internationally?",
    a: "Absolutely — FreelanceHub connects you with talent and clients in over 120 countries, with support for multiple currencies.",
  },
];

const trustedCompanies = ["NORTHWIND", "BLOOM", "VERTEX", "LUMINA", "ORBIT", "ATLAS"];

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [freelancers, setFreelancers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [freelancerData, jobData] = await Promise.all([
          userService.getFreelancers({ limit: 4 }),
          jobService.getJobs({ limit: 4 }),
        ]);
        setFreelancers(freelancerData.freelancers);
        setJobs(jobData.jobs);
      } catch (err) {
        // fail silently — sections just won't render data
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/freelancers?search=${encodeURIComponent(search)}`);
  };

  return (
    <MainLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero-gradient pt-16 pb-28">
        <motion.div
          className="absolute top-10 left-[10%] w-72 h-72 rounded-full bg-nude/40 blur-3xl animate-blob"
          aria-hidden
        />
        <motion.div
          className="absolute bottom-0 right-[5%] w-96 h-96 rounded-full bg-mocha/20 blur-3xl animate-blob"
          style={{ animationDelay: "2s" }}
          aria-hidden
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-beige/60 blur-2xl animate-float"
          aria-hidden
        />

        <div className="section-container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 badge mb-6"
          >
            <Star size={12} className="fill-mocha" /> Trusted by 25,000+ freelancers worldwide
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-ink leading-tight max-w-4xl mx-auto"
          >
            Hire Elite Talent.
            <br />
            <span className="text-mocha">Build Something Great.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-lg text-ink/60 max-w-2xl mx-auto"
          >
            FreelanceHub is the premium marketplace where ambitious clients meet
            world-class freelancers across design, development, marketing, and more.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            onSubmit={handleSearch}
            className="mt-10 max-w-xl mx-auto glass-card p-2 flex items-center gap-2"
          >
            <Search size={20} className="text-mocha ml-3 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Try 'UI Designer' or 'React Developer'"
              className="flex-1 bg-transparent outline-none px-2 py-2 text-ink placeholder:text-ink/40"
            />
            <button type="submit" className="btn-primary !py-2.5">
              Search <ArrowRight size={16} />
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-8 flex items-center justify-center gap-3"
          >
            <Link to="/signup" className="btn-primary">
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link to="/jobs" className="btn-secondary">
              Browse Jobs
            </Link>
          </motion.div>
        </div>
      </section>

      {/* TRUSTED COMPANIES */}
      <section className="py-10 border-y border-mocha/10 bg-white/40">
        <div className="section-container">
          <p className="text-center text-xs uppercase tracking-widest text-ink/40 mb-6 font-heading">
            Trusted by innovative teams around the world
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {trustedCompanies.map((name) => (
              <span key={name} className="font-display text-xl font-bold text-ink/25 tracking-widest">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-24">
        <div className="section-container">
          <div className="text-center mb-14">
            <h2 className="section-title">Explore Popular Categories</h2>
            <p className="text-ink/60 mt-3 max-w-xl mx-auto">
              Find specialized freelancers across every domain your business needs.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {CATEGORIES.map((cat, i) => {
              const Icon = categoryIcons[cat] || Briefcase;
              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                >
                  <Link
                    to={`/jobs?category=${encodeURIComponent(cat)}`}
                    className="glass-card p-6 flex flex-col items-center text-center gap-3 h-full"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-nude/40 flex items-center justify-center">
                      <Icon size={24} className="text-mocha" />
                    </div>
                    <span className="font-heading font-medium text-ink text-sm">{cat}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TOP FREELANCERS */}
      <section className="py-16 bg-white/40">
        <div className="section-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title">Top Freelancers</h2>
              <p className="text-ink/60 mt-2">Meet the highest-rated talent on FreelanceHub.</p>
            </div>
            <Link to="/freelancers" className="btn-outline hidden sm:inline-flex">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          {loading ? (
            <GridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {freelancers.map((f, i) => (
                <FreelancerCard freelancer={f} key={f._id} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* LATEST JOBS */}
      <section className="py-24">
        <div className="section-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title">Latest Jobs</h2>
              <p className="text-ink/60 mt-2">Fresh opportunities posted by top clients.</p>
            </div>
            <Link to="/jobs" className="btn-outline hidden sm:inline-flex">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          {loading ? (
            <GridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {jobs.map((j, i) => (
                <JobCard job={j} key={j._id} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-mocha-gradient">
        <div className="section-container">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-cream">How It Works</h2>
            <p className="text-cream/70 mt-3 max-w-xl mx-auto">
              Getting started on FreelanceHub takes just four simple steps.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 backdrop-blur border border-white/10 rounded-xl2 p-6 text-center"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-nude flex items-center justify-center mb-4">
                  <step.icon size={24} className="text-ink" />
                </div>
                <span className="text-cream/50 text-xs font-heading">STEP {i + 1}</span>
                <h3 className="font-heading font-semibold text-cream text-lg mt-1 mb-2">
                  {step.title}
                </h3>
                <p className="text-cream/60 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20">
        <div className="section-container grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 text-center"
            >
              <stat.icon size={26} className="text-mocha mx-auto mb-3" />
              <p className="font-display text-3xl font-bold text-ink">{stat.value}</p>
              <p className="text-xs text-ink/50 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-white/40">
        <div className="section-container">
          <div className="text-center mb-14">
            <h2 className="section-title">What Our Community Says</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={16} className="fill-mocha text-mocha" />
                  ))}
                </div>
                <p className="text-ink/70 text-sm mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-mocha-gradient flex items-center justify-center text-cream font-heading font-semibold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-ink text-sm">{t.name}</p>
                    <p className="text-xs text-ink/50">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24">
        <div className="section-container">
          <div className="text-center mb-14">
            <h2 className="section-title">Simple, Transparent Pricing</h2>
            <p className="text-ink/60 mt-3 max-w-xl mx-auto">
              Choose the plan that fits how you hire.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-xl3 p-8 ${
                  plan.highlighted
                    ? "bg-mocha-gradient text-cream shadow-soft-lg scale-105"
                    : "glass-card text-ink"
                }`}
              >
                <h3 className="font-heading font-semibold text-lg">{plan.name}</h3>
                <p className={`text-sm mt-1 ${plan.highlighted ? "text-cream/70" : "text-ink/60"}`}>
                  {plan.description}
                </p>
                <div className="mt-6 mb-6">
                  <span className="font-display text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-sm opacity-70">{plan.period}</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 size={16} className={plan.highlighted ? "text-nude" : "text-mocha"} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className={plan.highlighted ? "btn-secondary !bg-white !text-mocha w-full" : "btn-primary w-full"}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white/40">
        <div className="section-container max-w-3xl">
          <div className="text-center mb-14">
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={faq.q} className="glass-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-heading font-medium text-ink">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-mocha shrink-0 transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="px-5 pb-5 text-sm text-ink/60"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER / CTA */}
      <section className="py-24">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-xl3 bg-mocha-gradient p-12 md:p-16 text-center"
          >
            <div className="absolute top-0 left-0 w-64 h-64 bg-nude/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-cream/70 max-w-xl mx-auto mb-8">
                Join thousands of clients and freelancers building great things together on
                FreelanceHub today.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link to="/signup" className="btn-secondary !bg-white !text-mocha">
                  Join as Freelancer
                </Link>
                <Link to="/post-job" className="btn-outline !border-cream !text-cream hover:!bg-cream hover:!text-mocha">
                  Post a Job
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
