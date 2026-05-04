// src/components/restaurant/MenuItemCard.jsx
import React from "react";
import { Plus } from "lucide-react";

function MenuItemCard({ item, restaurant, onAddToCart }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition p-4 md:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left Side */}
        <div className="flex gap-4 flex-1">
          {/* Item image */}
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Item info */}
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900">
              {item.name}
            </h3>

            <p className="text-slate-600 text-sm md:text-base mt-1 leading-6 max-w-xl">
              {item.description}
            </p>

            <p className="text-xl font-bold text-slate-900 mt-3">
              ${item.price.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex sm:block justify-end">
          <button
            onClick={() => onAddToCart({id: `${restaurant._id}-${item.name}`,
    restaurantId: restaurant._id,
    restaurantName: restaurant.name,
    name: item.name,
    description: item.description,
    image: item.image,
    price: item.price,
    quantity: 1,
  })}
            className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100 px-5 py-2.5 rounded-xl text-base font-semibold transition"
          >
            <Plus size={18} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuItemCard;