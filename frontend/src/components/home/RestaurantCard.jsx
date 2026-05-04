// src/components/RestaurantCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Clock3, ArrowRight } from "lucide-react";

const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="group overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
      {/* Image section */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"></div>

        {/* Category badge */}
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 backdrop-blur">
          {restaurant.category || restaurant.cuisine}
        </div>

        {/* Rating badge */}
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-amber-500 backdrop-blur">
          <Star size={14} fill="currentColor" />
          <span>{restaurant.rating || 0}</span>
          <span className="text-slate-500">
            ({restaurant.reviewsCount || restaurant?.reviews?.total || 0})
          </span>
        </div>

        {/* Restaurant title */}
        <div className="absolute bottom-4 left-4">
          <h3 className="text-2xl font-bold text-white">{restaurant.name}</h3>
        </div>
      </div>

      {/* Card content */}
      <div className="p-5">
        <div className="mb-4 flex flex-wrap gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-1.5">
            <MapPin size={15} className="text-pink-500" />
            <span>{restaurant.distance}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock3 size={15} className="text-orange-500" />
            <span>{restaurant.deliveryTime}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-3">
          {/* IMPORTANT: use restaurant._id for backend MongoDB */}
          <Link
            to={`/restaurant/${restaurant._id}`}
            className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            View Menu
          </Link>

          <Link
            to={`/restaurant/${restaurant._id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-orange-500"
          >
            Order Now
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;