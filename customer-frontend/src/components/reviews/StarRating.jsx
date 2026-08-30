// customer-frontend/src/components/reviews/StarRating.jsx

import { useState } from "react";
import { Star } from "lucide-react";

// star rating component that can be used in both read-only and interactive modes
const StarRating = ({ value = 0, onChange, interactive = false, size = 18 }) => {
  const [hoverValue, setHoverValue] = useState(0);
  const displayValue = interactive ? (hoverValue || value) : value;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange(star)}
          onMouseEnter={() => interactive && setHoverValue(star)}
          onMouseLeave={() => interactive && setHoverValue(0)}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            size={size}
            className={star <= displayValue ? "fill-primary text-primary" : "fill-gray-200 text-gray-200"}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;