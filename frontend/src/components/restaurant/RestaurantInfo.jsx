// src/components/restaurant/RestaurantInfo.jsx
import React from "react";
import { Star, MapPin, Clock, Info } from "lucide-react";

function RestaurantInfo({ data }) {
  return (
    <div className="flex-1">
      {/* Cuisine badge */}
      <p className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600">
        {data.cuisine}
      </p>

      {/* Restaurant name */}
      <h1 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
        {data.name}
      </h1>

      {/* Main quick info row */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-slate-600">
        <div className="flex items-center gap-1.5">
          <Star className="h-5 w-5 text-yellow-500 fill-current" />
          <span className="font-semibold text-slate-900">
            {Number(data.rating).toFixed(1)}
          </span>
          <span>({data.reviewsCount} reviews)</span>
        </div>

        <span className="hidden sm:inline">•</span>

        <div className="flex items-center gap-1.5">
          <MapPin className="h-5 w-5 text-slate-500" />
          <span>{data.distance}</span>
        </div>

        <span className="hidden sm:inline">•</span>

        <div className="flex items-center gap-1.5">
          <Clock className="h-5 w-5 text-slate-500" />
          <span>{data.deliveryTime}</span>
        </div>
      </div>

      {/* Description */}
      <p className="mt-6 max-w-3xl text-base md:text-lg leading-8 text-slate-600">
        {data.description}
      </p>

      {/* Secondary details */}
      <div className="mt-7 space-y-3 text-slate-700">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 text-slate-500" />
          <span>{data.address}</span>
        </div>

        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 text-slate-500" />
          <span>{data.hours}</span>
        </div>
      </div>
    </div>
  );
}

export default RestaurantInfo;