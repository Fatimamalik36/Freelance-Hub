import { motion } from "framer-motion";
import { Inbox } from "lucide-react";

const EmptyState = ({ icon: Icon = Inbox, title, description, action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card flex flex-col items-center justify-center text-center py-16 px-6"
    >
      <div className="w-16 h-16 rounded-full bg-nude/40 flex items-center justify-center mb-4">
        <Icon size={28} className="text-mocha" />
      </div>
      <h3 className="font-heading font-semibold text-lg text-ink mb-1">{title}</h3>
      {description && <p className="text-sm text-ink/60 max-w-sm mb-4">{description}</p>}
      {action}
    </motion.div>
  );
};

export default EmptyState;
