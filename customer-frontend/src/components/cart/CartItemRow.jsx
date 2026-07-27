// customer-frontend/src/components/cart/CartItemRow.jsx

import { Trash2, UtensilsCrossed } from "lucide-react";
import { useCart } from "../../context/CartContext";
import QuantityStepper from "../common/QuantityStepper";

const CartItemRow = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-4">
      {/* Image */}
      <div className="w-16 h-16 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
        {item.image?.url ? (
          <img src={item.image.url} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary-light">
            <UtensilsCrossed size={18} className="text-primary/40" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
        <p className="text-sm text-gray-500 mt-0.5">Rs. {item.price} each</p>
      </div>

      {/* Quantity control */}
      <QuantityStepper
        quantity={item.quantity}
        onIncrease={() => updateQuantity(item._id, item.quantity + 1)}
        onDecrease={() => updateQuantity(item._id, item.quantity - 1)}
      />

      {/* Line total */}
      <span className="font-semibold text-gray-900 w-16 text-right shrink-0">
        Rs. {item.price * item.quantity}
      </span>

      {/* Remove button */}
      <button
        onClick={() => removeFromCart(item._id)}
        className="text-gray-400 hover:text-red-500 transition-colors duration-200 shrink-0"
        aria-label={`Remove ${item.name}`}
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default CartItemRow;