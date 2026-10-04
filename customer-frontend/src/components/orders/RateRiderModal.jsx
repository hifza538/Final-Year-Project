// customer-frontend/src/components/orders/RateRiderModal.jsx
import { useState } from "react";
import { Star, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

const RateRiderModal = ({ orderId, onClose, onSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post("/customer/rider-review", { orderId, rating, comment });
      toast.success("Thanks for rating your rider!");
      onSubmitted?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit rating.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Rate Your Rider</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="flex justify-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              <Star
                size={32}
                className={
                  star <= (hoverRating || rating)
                    ? "fill-primary text-primary"
                    : "text-gray-200"
                }
              />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment (optional)"
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none
            focus:outline-none focus:ring-2 focus:ring-primary/30 mb-4"
        />

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-2.5 bg-primary text-white font-semibold rounded-full
            hover:bg-primary-dark transition-colors duration-200 disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Submit Rating"}
        </button>
      </div>
    </div>
  );
};

export default RateRiderModal;