// delivery-frontend/src/components/common/RatingBadge.jsx
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { getMyRating } from "../../services/ratingService";

const RatingBadge = () => {
  const [rating, setRating] = useState(null);

  useEffect(() => {
    getMyRating().then(setRating).catch(() => {});
  }, []);

  if (!rating || !rating.averageRating) return null;

  return (
    <div className="flex items-center gap-1 bg-primary-light text-primary-dark px-2.5 py-1 rounded-full text-xs font-semibold">
      <Star size={12} className="fill-primary-dark text-primary-dark" />
      {rating.averageRating} ({rating.totalReviews})
    </div>
  );
};

export default RatingBadge;