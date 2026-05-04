// src/components/restaurant/MenuSection.jsx
import React, { useState } from "react";
import MenuItemCard from "./MenuItemCard";

function MenuSection({ menu, restaurant, onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState("All Items");

    // Safety check
  if (!menu) {
    return (
      <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 md:p-8">
        <p className="text-slate-500">No menu available.</p>
      </div>
    );
  }

  // Filter menu items by active category
  const filteredItems =
    activeCategory === "All Items"
      ? menu.items
      : menu.items.filter((item) => item.category === activeCategory);

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 md:p-8">
      {/* Category Tabs */}
      <div className="flex gap-4 overflow-x-auto border-b border-slate-200 pb-4 mb-6">
        {menu.categories.map((category) => {
          const count =
            category === "All Items"
              ? menu.items.length
              : menu.items.filter((item) => item.category === category).length;

          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap text-lg font-semibold pb-2 border-b-2 transition ${
                activeCategory === category
                  ? "text-orange-500 border-orange-500"
                  : "text-slate-600 border-transparent hover:text-orange-500"
              }`}
            >
              {category} ({count})
            </button>
          );
        })}
      </div>

      {/* Menu Cards */}
      {filteredItems.length > 0 ? (
        <div className="space-y-5">
          {filteredItems.map((item, index) => (
            <MenuItemCard
              key={index}
              item={item}
              restaurant={restaurant}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-slate-500">
          No items available in this category.
        </div>
      )}
    </div>
  );
}

export default MenuSection;