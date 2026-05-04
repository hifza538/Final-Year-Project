// src/components/restaurant/FavoriteButton.jsx
import React from "react";
import { Heart } from "lucide-react";

function FavoriteButton({ isFavorited, onToggle }) {
  return (
    <div className="mt-4 md:mt-0">
      {/* 
        Favorite button
        - active state when restaurant is favorited
        - cleaner rounded premium style
      */}
      <button
        onClick={onToggle}
        className={`flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3.5 rounded-2xl text-base font-semibold border transition-all duration-200 shadow-sm
          ${
            isFavorited
              ? "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100"
              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
          }
        `}
      >
        <Heart
          className={`h-5 w-5 transition-all ${
            isFavorited ? "fill-current" : ""
          }`}
        />
        {isFavorited ? "Favorited" : "Add to Favorites"}
      </button>
    </div>
  );
}

export default FavoriteButton;