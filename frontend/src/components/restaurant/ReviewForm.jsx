// src/components/restaurant/ReviewForm.jsx
import React, { useState } from "react";
import { Star } from "lucide-react";

function ReviewForm({ onSubmit, onCancel }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating === 0 || comment.trim() === "") {
      alert("Please give rating and write a comment");
      return;
    }

    onSubmit({ rating, comment });
    setRating(0);
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
      <h4 className="font-bold text-lg mb-3 text-slate-900">Write your review</h4>

      {/* Star Rating Input */}
      <div className="flex mb-4 gap-1">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;

          return (
            <button
              type="button"
              key={index}
              onClick={() => setRating(ratingValue)}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
            >
              <Star
                className={`h-8 w-8 transition-colors ${
                  ratingValue <= (hover || rating)
                    ? "text-orange-500 fill-orange-500"
                    : "text-slate-300 fill-slate-300"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Comment textarea */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience..."
        rows={4}
        className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
      />

      {/* Buttons */}
      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl transition"
        >
          Submit Review
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold px-6 py-2.5 rounded-xl transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ReviewForm;