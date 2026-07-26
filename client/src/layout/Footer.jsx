import { Link } from "react-router-dom";
import { Briefcase, Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Thanks for subscribing to FreelanceHub!");
    setEmail("");
  };

  const columns = [
    {
      title: "For Clients",
      links: [
        { label: "Post a Job", to: "/post-job" },
        { label: "Browse Freelancers", to: "/freelancers" },
        { label: "How It Works", to: "/about" },
        { label: "Pricing", to: "/#pricing" },
      ],
    },
    {
      title: "For Freelancers",
      links: [
        { label: "Browse Jobs", to: "/jobs" },
        { label: "Create Profile", to: "/signup" },
        { label: "Success Stories", to: "/about" },
        { label: "Community", to: "/contact" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", to: "/about" },
        { label: "Contact", to: "/contact" },
        { label: "Careers", to: "/contact" },
        { label: "Blog", to: "/about" },
      ],
    },
  ];

  return (
    <footer className="bg-ink text-cream/80 mt-24">
      <div className="section-container py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-nude flex items-center justify-center">
              <Briefcase size={20} className="text-ink" />
            </div>
            <span className="font-display text-2xl font-bold text-cream">
              Freelance<span className="text-nude">Hub</span>
            </span>
          </Link>
          <p className="text-sm text-cream/60 max-w-sm mb-6">
            The premium marketplace connecting ambitious clients with elite freelance
            talent across design, development, marketing, and beyond.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 rounded-full bg-white/10 border border-white/10 px-4 py-2.5 text-sm placeholder:text-cream/40 outline-none focus:border-nude/60"
            />
            <button
              type="submit"
              className="w-11 h-11 rounded-full bg-nude flex items-center justify-center shrink-0 hover:bg-beige transition-colors"
            >
              <Send size={16} className="text-ink" />
            </button>
          </form>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-heading font-semibold text-cream mb-4">{col.title}</h4>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-cream/60 hover:text-nude transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="section-container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/50">
            © {new Date().getFullYear()} FreelanceHub. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-nude hover:text-ink transition-colors"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
