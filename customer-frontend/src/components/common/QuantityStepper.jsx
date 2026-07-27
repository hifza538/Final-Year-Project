// customer-frontend/src/components/common/QuantityStepper.jsx

import { Minus, Plus } from "lucide-react";

// Reusable +/- quantity control — used in Cart, and later in Checkout/Order review
const QuantityStepper = ({ quantity, onIncrease, onDecrease, min = 1 }) => {
  return (
    <div className="flex items-center gap-3 bg-gray-100 rounded-full px-2 py-1">
      <button
        onClick={onDecrease}
        disabled={quantity <= min}
        className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-gray-600
                   hover:bg-gray-200 transition-colors duration-200
                   disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        <Minus size={14} />
      </button>
      <span className="text-sm font-medium w-4 text-center">{quantity}</span>
      <button
        onClick={onIncrease}
        className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-gray-600
                   hover:bg-gray-200 transition-colors duration-200"
        aria-label="Increase quantity"
      >
        <Plus size={14} />
      </button>
    </div>
  );
};

export default QuantityStepper;