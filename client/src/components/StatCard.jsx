import { motion } from "framer-motion";

const StatCard = ({ icon: Icon, label, value, index = 0, accent = "nude" }) => {
  const accents = {
    nude: "bg-nude/40 text-mocha-dark",
    beige: "bg-beige text-mocha-dark",
    mocha: "bg-mocha-gradient text-cream",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -4 }}
      className="glass-card p-5 flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${accents[accent]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-heading font-bold text-ink">{value}</p>
        <p className="text-xs text-ink/60">{label}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
