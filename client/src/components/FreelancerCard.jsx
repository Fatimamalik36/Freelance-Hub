import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, BadgeCheck } from "lucide-react";
import Avatar from "./Avatar";
import StarRating from "./StarRating";
import { formatCurrency } from "../utils/helpers";

const FreelancerCard = ({ freelancer, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="glass-card p-6 flex flex-col gap-4 group"
    >
      <div className="flex items-start gap-4">
        <Avatar src={freelancer.profileImage} name={freelancer.name} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <h3 className="font-heading font-semibold text-lg text-ink truncate">
              {freelancer.name}
            </h3>
            {freelancer.isVerified && (
              <BadgeCheck size={16} className="text-mocha shrink-0" />
            )}
          </div>
          <p className="text-sm text-mocha-dark font-medium truncate">
            {freelancer.title || "Freelancer"}
          </p>
          {freelancer.location && (
            <p className="text-xs text-ink/50 flex items-center gap-1 mt-1">
              <MapPin size={12} /> {freelancer.location}
            </p>
          )}
        </div>
      </div>

      <StarRating rating={freelancer.rating} numReviews={freelancer.numReviews} />

      <p className="text-sm text-ink/70 line-clamp-2">{freelancer.bio}</p>

      <div className="flex flex-wrap gap-2">
        {(freelancer.skills || []).slice(0, 3).map((skill) => (
          <span key={skill} className="badge">
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-mocha/10">
        <div>
          <span className="text-xs text-ink/50">Starting at</span>
          <p className="font-heading font-bold text-mocha">
            {formatCurrency(freelancer.hourlyRate)}
            <span className="text-xs font-normal text-ink/50">/hr</span>
          </p>
        </div>
        <Link to={`/freelancers/${freelancer._id}`} className="btn-secondary !px-4 !py-2 text-sm">
          View Profile
        </Link>
      </div>
    </motion.div>
  );
};

export default FreelancerCard;
