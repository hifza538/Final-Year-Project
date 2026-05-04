// src/components/restaurant/ReviewsSection.jsx
import React, { useState } from "react";
import { Star } from "lucide-react";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";

// Rating bar helper
const RatingBar = ({ stars, count, total }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-slate-600 w-4">{stars}</span>
      <Star className="h-4 w-4 text-slate-400 fill-slate-400" />
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className="bg-orange-500 h-2 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm text-slate-500 w-6 text-right">{count}</span>
    </div>
  );
};

function ReviewsSection({
  reviews,
  isLoggedIn = false,
  onLogin,
  onSubmitReview,
}) {
  const [showForm, setShowForm] = useState(false);

  // NOTE:
  // This distribution is still dummy/static.
  // Best practice: backend se distribution aaye.
  const ratingDistribution = [
    { stars: 5, count: 87 },
    { stars: 4, count: 25 },
    { stars: 3, count: 6 },
    { stars: 2, count: 6 },
    { stars: 1, count: 0 },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 md:p-8">
      {/* ---- 1. Rating Summary ---- */}
      <div className="flex flex-col md:flex-row gap-8 pb-8 border-b border-slate-200">
        {/* Left: Big Rating */}
        <div className="flex flex-col items-center md:items-start">
          <p className="text-6xl md:text-7xl font-extrabold text-orange-500">
            {reviews.average.toFixed(1)}
          </p>

          <div className="flex mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 ${
                  i < Math.round(reviews.average)
                    ? "text-orange-500 fill-orange-500"
                    : "text-slate-300 fill-slate-300"
                }`}
              />
            ))}
          </div>

          <p className="text-slate-500 mt-2">{reviews.total} reviews</p>
        </div>

        {/* Right: Rating bars */}
        <div className="flex-1 space-y-2">
          {ratingDistribution.map((r) => (
            <RatingBar
              key={r.stars}
              stars={r.stars}
              count={r.count}
              total={reviews.total}
            />
          ))}
        </div>
      </div>

      {/* ---- 2. Review Form / Login Gate ---- */}
      <div className="py-8 border-b border-slate-200">
        {!isLoggedIn ? (
          <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-200">
            <p className="text-slate-700 text-lg font-medium">
              Please sign in to leave a review
            </p>
            <button
              onClick={onLogin}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl transition"
            >
              Sign In
            </button>
          </div>
        ) : (
          <>
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition"
              >
                Write a Review
              </button>
            ) : (
              <ReviewForm
                onCancel={() => setShowForm(false)}
                onSubmit={(data) => {
                  onSubmitReview(data);
                  setShowForm(false);
                }}
              />
            )}
          </>
        )}
      </div>

      {/* ---- 3. Reviews List ---- */}
      <div className="pt-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">
          Customer Reviews
        </h3>

        {reviews.items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">
              No reviews yet. Be the first to review!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.items.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewsSection;