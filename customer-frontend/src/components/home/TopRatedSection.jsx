// customer-frontend/src/components/home/TopRatedSection.jsx

import { Link } from "react-router-dom";
import { Star, Clock, UtensilsCrossed } from "lucide-react";


const MIN_REVIEWS_FOR_TOP_RATED = 3;

const TopRatedSection = ({ restaurants }) => {
  const topRated = restaurants
    .filter((r) => r.averageRating && r.reviewCount >= MIN_REVIEWS_FOR_TOP_RATED)
    .sort((a, b) => {
      // Primary sort: higher rating first
      if (b.averageRating !== a.averageRating) return b.averageRating - a.averageRating;
      // Tiebreaker: if ratings are equal, more reviews wins (more trustworthy)
      return b.reviewCount - a.reviewCount;
    })
    .slice(0, 6);

  if (topRated.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <Star size={18} className="fill-primary text-primary" />
        <h2 className="text-lg font-bold text-secondary">Top Rated Near You</h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
        {topRated.map((restaurant) => (
          <Link
            key={restaurant._id}
            to={`/restaurant/${restaurant._id}`}
            className="shrink-0 w-64 bg-white rounded-2xl border border-gray-100 shadow-sm
                       hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            <div className="h-32 bg-gray-100 relative">
              {restaurant.coverPhoto ? (
                <img src={restaurant.coverPhoto} alt={restaurant.shopName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-light">
                  <UtensilsCrossed size={24} className="text-primary/40" />
                </div>
              )}
              <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm rounded-full
                              px-2 py-1 flex items-center gap-1 text-xs font-semibold text-secondary">
                <Star size={12} className="fill-primary text-primary" />
                {restaurant.averageRating}
                <span className="text-gray-400 font-normal">({restaurant.reviewCount})</span>
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-gray-900 truncate text-sm">{restaurant.shopName}</h3>
              <p className="text-xs text-gray-500 truncate mt-0.5">{restaurant.cuisine}</p>
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-1.5">
                <Clock size={12} />
                {restaurant.minPrepTime}-{restaurant.maxPrepTime} min
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopRatedSection;