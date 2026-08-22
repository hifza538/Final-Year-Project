// customer-frontend/src/components/reviews/ReviewsModal.jsx

import { useState, useMemo } from "react";
import { X, Star } from "lucide-react";

const SORT_OPTIONS = ["Newest", "Highest Rating", "Lowest Rating"];

const ReviewsModal = ({ restaurantName, reviews, averageRating, onClose }) => {
  const [activeSort, setActiveSort] = useState("Newest");

  // Compute the count of reviews for each star rating (1-5)
  const ratingBreakdown = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      counts[r.rating] = (counts[r.rating] || 0) + 1;
    });
    return counts;
  }, [reviews]);

  const sortedReviews = useMemo(() => {
    const copy = [...reviews];
    if (activeSort === "Newest") {
      return copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    if (activeSort === "Highest Rating") {
      return copy.sort((a, b) => b.rating - a.rating);
    }
    return copy.sort((a, b) => a.rating - b.rating); // Lowest Rating
  }, [reviews, activeSort]);

  const formatDate = (isoString) => {
    const diffDays = Math.floor((Date.now() - new Date(isoString)) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 30) return `${diffDays} days ago`;
    return new Date(isoString).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <div>
            <h3 className="font-bold text-gray-900">{restaurantName}</h3>
            <p className="text-sm text-gray-500">Reviews</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5">
          {/* Rating summary + breakdown bars */}
          <div className="flex items-start gap-6 mb-6">
            <div className="text-center shrink-0">
              <p className="text-4xl font-bold text-gray-900">{averageRating}</p>
              <div className="flex justify-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    className={s <= Math.round(averageRating) ? "fill-primary text-primary" : "fill-gray-200 text-gray-200"}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">{reviews.length} ratings</p>
            </div>

            <div className="flex-1 space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingBreakdown[star];
                const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-6 shrink-0">{star} ★</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sort tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setActiveSort(option)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-200
                  ${
                    activeSort === option
                      ? "bg-secondary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Review list */}
          <div className="space-y-4">
            {sortedReviews.map((review) => (
              <div key={review._id} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800 text-sm">{review.customer?.fullName}</span>
                  <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                </div>
                <div className="flex gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={13}
                      className={s <= review.rating ? "fill-primary text-primary" : "fill-gray-200 text-gray-200"}
                    />
                  ))}
                </div>
                {review.comment && <p className="text-sm text-gray-600 mt-2">{review.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsModal;