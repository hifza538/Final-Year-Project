// customer-frontend/src/components/reviews/ReviewFormModal.jsx

import { useState } from "react";
import { X } from "lucide-react";
import StarRating from "./StarRating";

const ReviewFormModal = ({ order, onClose, onSubmit, isSubmitting }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    setError("");
    onSubmit({ orderId: order._id, rating, comment });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Rate Your Order</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5">
          <p className="text-sm text-gray-500 mb-1">{order.vendor?.shopName}</p>
          <p className="text-xs text-gray-400 mb-4">
            {order.orderItems.map((item) => item.name).join(", ")}
          </p>

          <div className="flex justify-center mb-1">
            <StarRating value={rating} onChange={setRating} interactive size={32} />
          </div>
          {error && <p className="text-sm text-red-500 text-center mb-3">{error}</p>}

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience (optional)"
            rows={3}
            maxLength={500}
            className="w-full px-3 py-2.5 mt-3 text-sm rounded-lg border border-gray-200
                       focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                       resize-none"
          />

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-full border border-gray-200 text-sm text-gray-600
                         hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-full bg-primary text-white text-sm font-semibold
                         hover:bg-primary-dark transition-colors duration-200
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewFormModal;