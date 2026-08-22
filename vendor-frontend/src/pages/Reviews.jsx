// vendor-frontend/src/pages/Reviews.jsx

import { useEffect, useState, useCallback } from "react";
import { Star } from "lucide-react";
import { getMyReviews } from "../services/reviewService";
import RatingSummary from "../components/reviews/RatingSummary";
import ReviewCard from "../components/reviews/ReviewCard";
import ReviewCardSkeleton from "../components/reviews/ReviewCardSkeleton";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";

const Reviews = () => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getMyReviews();
      setData(result);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          See what customers are saying about your restaurant
        </p>
      </div>

      {error && <ErrorState message={error} onRetry={fetchReviews} />}

      {loading ? (
        <div className="space-y-3">
          <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          {Array(3).fill(0).map((_, i) => <ReviewCardSkeleton key={i} />)}
        </div>
      ) : data && !error ? (
        data.count === 0 ? (
          <EmptyState
            icon={Star}
            title="No reviews yet"
            message="Once customers start ordering and leaving reviews, they'll show up here."
          />
        ) : (
          <>
            <RatingSummary
              averageRating={data.averageRating}
              count={data.count}
              breakdown={data.breakdown}
            />
            <div className="space-y-3">
              {data.reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          </>
        )
      ) : null}
    </div>
  );
};

export default Reviews;