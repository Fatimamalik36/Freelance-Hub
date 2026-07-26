import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Palette,
  Code2,
  PenTool,
  Megaphone,
  Video,
  Smartphone,
  Music,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import MainLayout from "../layout/MainLayout";

const services = [
  {
    icon: Palette,
    title: "Design & Creative",
    description: "UI/UX design, branding, illustration, and graphic design from top-rated creatives.",
    tags: ["UI/UX", "Branding", "Illustration", "Figma"],
  },
  {
    icon: Code2,
    title: "Development & IT",
    description: "Full stack, frontend, backend, and DevOps engineers ready to ship production code.",
    tags: ["React", "Node.js", "DevOps", "APIs"],
  },
  {
    icon: PenTool,
    title: "Writing & Translation",
    description: "SEO copywriting, technical writing, and multilingual translation services.",
    tags: ["Copywriting", "SEO", "Translation"],
  },
  {
    icon: Megaphone,
    title: "Sales & Marketing",
    description: "Growth marketers, PPC specialists, and social media strategists who drive results.",
    tags: ["SEO", "Ads", "Social Media"],
  },
  {
    icon: Video,
    title: "Video & Animation",
    description: "Video editing, motion graphics, and 2D/3D animation for every kind of content.",
    tags: ["Editing", "Motion Graphics", "3D"],
  },
  {
    icon: Smartphone,
    title: "Mobile Development",
    description: "Native and cross-platform mobile app developers for iOS and Android.",
    tags: ["Flutter", "React Native", "Swift"],
  },
  {
    icon: Music,
    title: "Music & Audio",
    description: "Voiceover artists, sound designers, and music producers for every project.",
    tags: ["Voiceover", "Mixing", "Composition"],
  },
  {
    icon: Briefcase,
    title: "Business & Consulting",
    description: "Business planning, financial analysis, and strategy consultants.",
    tags: ["Strategy", "Finance", "Operations"],
  },
];

const ServicesPage = () => {
  return (
    <MainLayout>
      <section className="bg-hero-gradient py-24">
        <div className="section-container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-6xl font-bold text-ink"
          >
            Services for Every Need
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-lg text-ink/60 max-w-2xl mx-auto"
          >
            From design to development, explore the categories where our top talent excels.
          </motion.p>
        </div>
      </section>

      <section className="py-20">
        <div className="section-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -6 }}
              className="glass-card p-7"
            >
              <div className="w-14 h-14 rounded-2xl bg-nude/40 flex items-center justify-center mb-5">
                <service.icon size={26} className="text-mocha" />
              </div>
              <h3 className="font-heading font-semibold text-xl text-ink mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-ink/60 mb-5">{service.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {service.tags.map((tag) => (
                  <span key={tag} className="badge">
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                to={`/freelancers?skill=${encodeURIComponent(service.tags[0])}`}
                className="text-sm font-heading font-semibold text-mocha flex items-center gap-1 hover:gap-2 transition-all"
              >
                Explore Talent <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
};

export default ServicesPage;
