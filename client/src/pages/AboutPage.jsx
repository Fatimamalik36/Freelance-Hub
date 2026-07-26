import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Target, Heart, Globe2, Sparkles, ArrowRight } from "lucide-react";
import MainLayout from "../layout/MainLayout";

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To create the world's most trusted freelance marketplace, where quality talent and ambitious businesses find each other effortlessly.",
  },
  {
    icon: Heart,
    title: "Built With Care",
    description:
      "Every feature we ship is designed around real feedback from our community of clients and freelancers.",
  },
  {
    icon: Globe2,
    title: "Global Reach",
    description:
      "We connect people across 120+ countries, breaking down geographic barriers to great work.",
  },
  {
    icon: Sparkles,
    title: "Premium Quality",
    description:
      "Our verification and rating systems ensure only the best talent rises to the top.",
  },
];

const team = [
  { name: "Laura Bennett", role: "CEO & Co-Founder" },
  { name: "Marcus Webb", role: "CTO & Co-Founder" },
  { name: "Nina Torres", role: "Head of Design" },
  { name: "Samuel Okafor", role: "Head of Growth" },
];

const AboutPage = () => {
  return (
    <MainLayout>
      <section className="relative bg-hero-gradient py-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-nude/30 blur-3xl rounded-full" />
        <div className="section-container text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-6xl font-bold text-ink"
          >
            About <span className="text-mocha">FreelanceHub</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-lg text-ink/60 max-w-2xl mx-auto"
          >
            We're building the premium marketplace where exceptional talent and
            ambitious companies come together to do their best work.
          </motion.p>
        </div>
      </section>

      <section className="py-24">
        <div className="section-container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="badge mb-4">Our Story</span>
            <h2 className="section-title mb-6">
              Founded on a Simple Belief: Great Work Deserves Great Platforms
            </h2>
            <p className="text-ink/60 mb-4">
              FreelanceHub was born from frustration with clunky, impersonal freelance
              platforms that treated talent as a commodity. We set out to build something
              different — a marketplace with the polish of a premium product and the
              substance of a serious business tool.
            </p>
            <p className="text-ink/60">
              Today, we're proud to host tens of thousands of freelancers and clients
              who trust FreelanceHub to power their most important projects.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-2 aspect-video flex items-center justify-center bg-nude-gradient"
          >
            <span className="font-display text-6xl">💼</span>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white/40">
        <div className="section-container">
          <div className="text-center mb-14">
            <h2 className="section-title">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-nude/40 flex items-center justify-center mb-4">
                  <v.icon size={24} className="text-mocha" />
                </div>
                <h3 className="font-heading font-semibold text-ink mb-2">{v.title}</h3>
                <p className="text-sm text-ink/60">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="section-container">
          <div className="text-center mb-14">
            <h2 className="section-title">Meet the Team</h2>
            <p className="text-ink/60 mt-3">The people building FreelanceHub every day.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-mocha-gradient flex items-center justify-center text-cream font-heading font-bold text-xl mb-4">
                  {member.name[0]}
                </div>
                <h3 className="font-heading font-semibold text-ink text-sm">{member.name}</h3>
                <p className="text-xs text-ink/50">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="section-container">
          <div className="rounded-xl3 bg-mocha-gradient p-12 text-center">
            <h2 className="font-display text-3xl font-bold text-cream mb-4">
              Join the FreelanceHub Community
            </h2>
            <Link to="/signup" className="btn-secondary !bg-white !text-mocha mt-4">
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default AboutPage;
