// customer-frontend/src/components/restaurant/RestaurantCard.jsx

import { Link } from "react-router-dom";
import { Clock, MapPin, UtensilsCrossed, Star } from "lucide-react";

/* Shows one restaurant's summary - used on the Home page listing grid.
Rating is intentionally not shown yet since no review system exists yet */
const RestaurantCard = ({ restaurant }) => {
  const {
    _id,
    shopName,
    cuisine,
    city,
    zone,
    coverPhoto,
    logo,
    isOpen,
    minPrepTime,
    maxPrepTime,
    averageRating,
    reviewCount,
  } = restaurant;

  return (
    <Link
      to={`/restaurant/${_id}`}
      className="block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden
                 hover:shadow-md transition-shadow duration-200 group"
    >
      {/* Cover photo */}
      <div className="relative h-40 bg-gray-100">
        {coverPhoto ? (
          <img
            src={coverPhoto}
            alt={shopName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary-light">
            <UtensilsCrossed size={32} className="text-primary/40" />
          </div>
        )}

        {/* Closed overlay badge - restaurant is still visible, just marked as unavailable right now */}
        {!isOpen && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-secondary text-xs font-semibold px-3 py-1.5 rounded-full">
              Currently Closed
            </span>
          </div>
        )}

        {/* Logo overlapping the cover photo, bottom-left */}
        {logo && (
          <div className="absolute -bottom-5 left-4 w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-sm bg-white">
            <img src={logo} alt={`${shopName} logo`} className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4 pt-6">
        <h3 className="font-semibold text-gray-900 truncate">{shopName}</h3>
        <p className="text-sm text-gray-500 mt-0.5 truncate">{cuisine}</p>

        {averageRating && (
          <span className="flex items-center gap-1 text-xs font-medium text-gray-700 shrink-0">
            <Star size={12} className="fill-primary text-primary" />
            {averageRating} <span className="text-gray-400">({reviewCount})</span>
          </span>
        )}

        <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {minPrepTime}-{maxPrepTime} min
          </span>
          <span className="flex items-center gap-1 truncate">
            <MapPin size={14} className="shrink-0" />
            {zone}, {city}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;