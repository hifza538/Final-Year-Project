// src/components/restaurant/ReviewCard.jsx
import React from "react";
import { Star, User } from "lucide-react";

function ReviewCard({ review }) {
  return (
    <div className="flex gap-4 pb-6 border-b border-slate-100 last:border-b-0 last:pb-0">
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
        {review.avatar ? (
          <img
            src={review.avatar}
            alt={review.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-6 h-6 text-slate-500" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center justify-between gap-3">
          <h4 className="font-bold text-slate-900">{review.name}</h4>
          <span className="text-sm text-slate-500 whitespace-nowrap">
            {review.date}
          </span>
        </div>

        <div className="flex mt-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < review.rating
                  ? "text-orange-500 fill-orange-500"
                  : "text-slate-300 fill-slate-300"
              }`}
            />
          ))}
        </div>

        <p className="text-slate-700 leading-7">{review.comment}</p>
      </div>
    </div>
  );
}

export default ReviewCard;