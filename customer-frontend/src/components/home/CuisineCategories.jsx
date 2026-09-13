// customer-frontend/src/components/home/CuisineCategories.jsx

import {
  UtensilsCrossed, Pizza, Soup, Salad, Coffee, Sandwich,
  Beef, IceCream, Fish, Croissant,
} from "lucide-react";

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

const getIconFor = (cuisine) => CUISINE_ICONS[cuisine?.toLowerCase().trim()] || UtensilsCrossed;

const CuisineCategories = ({ cuisines, activeCuisine, onSelect }) => {
  if (cuisines.length === 0) return null;

  const options = ["All", ...cuisines];

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
      {options.map((cuisine) => {
        const Icon = cuisine === "All" ? UtensilsCrossed : getIconFor(cuisine);
        const isActive = activeCuisine === cuisine;

        return (
          <button
            key={cuisine}
            onClick={() => onSelect(cuisine)}
            className="flex flex-col items-center gap-1.5 shrink-0 w-[76px] group"
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200
                ${isActive ? "bg-primary shadow-md shadow-primary/25" : "bg-primary-light group-hover:bg-primary/15"}`}
            >
              <Icon size={24} className={isActive ? "text-white" : "text-primary"} />
            </div>
            <span
              className={`text-xs font-medium text-center leading-tight truncate w-full
                ${isActive ? "text-secondary font-semibold" : "text-gray-500"}`}
            >
              {cuisine}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CuisineCategories;