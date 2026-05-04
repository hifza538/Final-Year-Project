// src/components/restaurant/RestaurantBanner.jsx
import React from "react";

function RestaurantBanner({ image, name }) {
  return (
    <div className="relative w-full h-[280px] md:h-[340px] overflow-hidden">
      {/* Banner image */}
      <img
        src={image}
        alt={name || "Restaurant Banner"}
        className="w-full h-full object-cover"
      />

      {/* Dark gradient overlay for better readability and premium look */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
    </div>
  );
}

export default RestaurantBanner;