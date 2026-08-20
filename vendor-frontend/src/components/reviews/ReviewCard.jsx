// vendor-frontend/src/components/reviews/ReviewCard.jsx

import { Star } from "lucide-react";

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const ReviewCard = ({ review }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-4">
    <div className="flex items-center justify-between">
      <span className="font-medium text-gray-800 text-sm">
        {review.customer?.fullName || "Customer"}
      </span>
      <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
    </div>
    <div className="flex gap-0.5 mt-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={s <= review.rating ? "fill-primary text-primary" : "fill-gray-200 text-gray-200"}
        />
      ))}
    </div>
    {review.comment && (
      <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
    )}
  </div>
);

export default ReviewCard;