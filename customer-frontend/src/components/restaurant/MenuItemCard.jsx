// customer-frontend/src/components/restaurant/MenuItemCard.jsx

import { Plus, UtensilsCrossed } from "lucide-react";
import { useCart } from "../../context/CartContext";

// Shows one menu item with an Add to Cart button - disabled when out of stock
const MenuItemCard = ({ item, restaurantId }) => {
  const { addToCart } = useCart();

  const handleAdd = () => {
    if (!item.inStock) return;
    addToCart(item, restaurantId);
  };

  return (
    <div
      className={`flex gap-4 bg-white rounded-xl border border-gray-100 p-4
                  ${!item.inStock ? "opacity-60" : ""}`}
    >
      {/* Image */}
      <div className="w-20 h-20 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
        {item.image?.url ? (
          <img src={item.image.url} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary-light">
            <UtensilsCrossed size={20} className="text-primary/40" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-gray-900">{item.name}</h4>
          {!item.inStock && (
            <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full shrink-0">
              Out of Stock
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
        )}

        <div className="flex items-center justify-between mt-3">
          <span className="font-semibold text-gray-900">Rs. {item.price}</span>
          <button
            onClick={handleAdd}
            disabled={!item.inStock}
            className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-sm font-medium
                       rounded-full hover:bg-primary-dark transition-colors duration-200
                       disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;