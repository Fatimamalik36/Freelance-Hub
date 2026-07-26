import { Star } from "lucide-react";

const StarRating = ({ rating = 0, numReviews, size = 16, showCount = true }) => {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={
              i < Math.round(rating)
                ? "fill-mocha text-mocha"
                : "fill-nude/30 text-nude/30"
            }
          />
        ))}
      </div>
      <span className="text-sm font-heading font-semibold text-ink">
        {rating ? rating.toFixed(1) : "New"}
      </span>
      {showCount && numReviews !== undefined && (
        <span className="text-xs text-ink/50">({numReviews})</span>
      )}
    </div>
  );
};

export default StarRating;
