import { motion } from "framer-motion";

const Loader = ({ fullScreen = false, size = "md" }) => {
  const sizes = { sm: "w-5 h-5", md: "w-10 h-10", lg: "w-16 h-16" };

  const spinner = (
    <motion.div
      className={`${sizes[size]} rounded-full border-4 border-nude border-t-mocha`}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
    />
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-nude-gradient">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-10">{spinner}</div>;
};

export default Loader;
