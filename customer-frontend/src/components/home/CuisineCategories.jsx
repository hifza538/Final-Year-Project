// customer-frontend/src/components/home/CuisineCategories.jsx

import {
  UtensilsCrossed, Pizza, Soup, Salad, Coffee, Sandwich,
  Beef, IceCream, Fish, Croissant,
} from "lucide-react";
import HorizontalScroller from "./HorizontalScroller";

const CUISINE_ICONS = {
  pakistani: Soup,
  desi: Soup,
  bbq: Beef,
  "fast food": Sandwich,
  fastfood: Sandwich,
  pizza: Pizza,
  chinese: Soup,
  italian: Pizza,
  continental: Beef,
  desserts: IceCream,
  beverages: Coffee,
  bakery: Croissant,
  seafood: Fish,
  "healthy food": Salad,
  biryani: Soup,
};

const getIconFor = (name) => CUISINE_ICONS[name?.toLowerCase().trim()] || UtensilsCrossed;

const CuisineCategories = ({ cuisines, activeCuisine, onSelect }) => {
  if (cuisines.length === 0) return null;

  const options = [{ name: "All", image: "" }, ...cuisines];

  return (
    <HorizontalScroller>
      {options.map((cuisine) => {
        const isActive = activeCuisine === cuisine.name;
        const Icon = cuisine.name === "All" ? UtensilsCrossed : getIconFor(cuisine.name);

        return (
          <button
            key={cuisine.name}
            onClick={() => onSelect(cuisine.name)}
            aria-pressed={isActive}
            className="snap-start flex flex-col items-center gap-1.5 shrink-0 w-[76px] group"
          >
            <div
              className={`relative w-[64px] h-[64px] rounded-full transition-transform duration-200
                ${isActive ? "scale-105" : "group-hover:scale-[1.03]"}`}
            >
              {cuisine.image ? (
                <img
                  src={cuisine.image}
                  alt=""
                  loading="lazy"
                  className={`w-full h-full rounded-full object-cover transition-all duration-200
                    ${isActive
                      ? "ring-2 ring-primary ring-offset-2"
                      : "ring-1 ring-gray-100 group-hover:ring-primary/30"}`}
                />
              ) : (
                <div
                  className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-200
                    ${isActive
                      ? "bg-gradient-to-br from-primary to-primary-dark shadow-md shadow-primary/30"
                      : "bg-primary-light group-hover:bg-primary/15"}`}
                >
                  <Icon size={24} strokeWidth={1.75} className={isActive ? "text-white" : "text-primary"} />
                </div>
              )}

              {/* Small dot under the active avatar - quieter than a full pill background */}
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </div>

            <span
              className={`text-xs text-center leading-tight truncate w-full transition-colors
                ${isActive ? "text-secondary font-semibold" : "text-gray-500 font-medium"}`}
            >
              {cuisine.name}
            </span>
          </button>
        );
      })}
    </HorizontalScroller>
  );
};

export default CuisineCategories;