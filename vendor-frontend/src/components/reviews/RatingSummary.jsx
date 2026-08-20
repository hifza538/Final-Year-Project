// vendor-frontend/src/components/reviews/RatingSummary.jsx

import { Star } from "lucide-react";

const RatingSummary = ({ averageRating, count, breakdown }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-start gap-6 flex-wrap">
    <div className="text-center shrink-0">
      <p className="text-4xl font-bold text-gray-900">{averageRating ?? "—"}</p>
      <div className="flex justify-center gap-0.5 mt-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={16}
            className={
              averageRating && s <= Math.round(averageRating)
                ? "fill-primary text-primary"
                : "fill-gray-200 text-gray-200"
            }
          />
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-1">{count} rating{count !== 1 ? "s" : ""}</p>
    </div>

    <div className="flex-1 space-y-1.5 min-w-[200px]">
      {[5, 4, 3, 2, 1].map((star) => {
        const starCount = breakdown[star] || 0;
        const percent = count > 0 ? (starCount / count) * 100 : 0;
        return (
          <div key={star} className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-6 shrink-0">{star} ★</span>
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${percent}%` }} />
            </div>
            <span className="w-6 text-right shrink-0">{starCount}</span>
          </div>
        );
      })}
    </div>
  </div>
);

export default RatingSummary;