import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, Briefcase, Bookmark } from "lucide-react";
import Avatar from "./Avatar";
import { formatCurrency, timeAgo } from "../utils/helpers";

const JobCard = ({ job, index = 0, onSave, isSaved = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="glass-card p-6 flex flex-col gap-4 group relative"
    >
      {onSave && (
        <button
          onClick={() => onSave(job._id)}
          className="absolute top-5 right-5 text-mocha hover:scale-110 transition-transform"
          aria-label="Save job"
        >
          <Bookmark size={20} className={isSaved ? "fill-mocha" : ""} />
        </button>
      )}

      <div className="flex items-center gap-3">
        <Avatar src={job.client?.profileImage} name={job.client?.name} size="sm" />
        <div>
          <p className="text-sm font-medium text-ink">{job.client?.name}</p>
          <p className="text-xs text-ink/50 flex items-center gap-1">
            <Clock size={11} /> {timeAgo(job.createdAt)}
          </p>
        </div>
      </div>

      <Link to={`/jobs/${job._id}`}>
        <h3 className="font-heading font-semibold text-lg text-ink group-hover:text-mocha transition-colors line-clamp-2">
          {job.title}
        </h3>
      </Link>

      <p className="text-sm text-ink/70 line-clamp-2">{job.description}</p>

      <div className="flex flex-wrap gap-2">
        {(job.skillsRequired || []).slice(0, 3).map((skill) => (
          <span key={skill} className="badge">
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-mocha/10">
        <div>
          <p className="font-heading font-bold text-mocha">
            {formatCurrency(job.budget)}
            {job.budgetType === "hourly" && (
              <span className="text-xs font-normal text-ink/50">/hr</span>
            )}
          </p>
          <p className="text-xs text-ink/50 flex items-center gap-1">
            <Briefcase size={11} /> {job.category}
          </p>
        </div>
        <Link to={`/jobs/${job._id}`} className="btn-secondary !px-4 !py-2 text-sm">
          View Job
        </Link>
      </div>
    </motion.div>
  );
};

export default JobCard;
