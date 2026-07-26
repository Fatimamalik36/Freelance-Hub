import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import MainLayout from "../layout/MainLayout";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
    setSubmitting(false);
  };

  const contactInfo = [
    { icon: Mail, label: "Email Us", value: "fatimamalikfm044049@gmail.com" },
    { icon: Phone, label: "Call Us", value: "03155039583" },
    { icon: MapPin, label: "Visit Us", value: "Street 7 F7,Islamabad" },
  ];

  return (
    <MainLayout>
      <section className="bg-hero-gradient py-24">
        <div className="section-container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-6xl font-bold text-ink"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-lg text-ink/60 max-w-2xl mx-auto"
          >
            Have a question or need help? Our team is here for you.
          </motion.p>
        </div>
      </section>

      <section className="py-20">
        <div className="section-container grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {contactInfo.map((info) => (
              <div key={info.label} className="glass-card p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-nude/40 flex items-center justify-center shrink-0">
                  <info.icon size={20} className="text-mocha" />
                </div>
                <div>
                  <p className="text-xs text-ink/50">{info.label}</p>
                  <p className="font-heading font-medium text-ink">{info.value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="lg:col-span-2 glass-card p-8 space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-heading font-medium text-ink mb-2 block">
                  Full Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="text-sm font-heading font-medium text-ink mb-2 block">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-heading font-medium text-ink mb-2 block">
                Subject
              </label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label className="text-sm font-heading font-medium text-ink mb-2 block">
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={6}
                className="input-field resize-none"
                placeholder="Tell us more..."
              />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? "Sending..." : "Send Message"} <Send size={16} />
            </button>
          </motion.form>
        </div>
      </section>
    </MainLayout>
  );
};

export default ContactPage;
