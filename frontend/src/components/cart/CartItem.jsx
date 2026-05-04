// src/components/cart/CartItem.jsx
import React from "react";
import { Plus, Minus, Trash2 } from "lucide-react";

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <div className="border-b border-slate-200 pb-4 mb-4 last:border-b-0 last:mb-0 last:pb-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="text-[16px] font-semibold text-slate-900">
            {item.name}
          </h4>
          <p className="text-sm text-slate-500 mt-1">
            Qty: {item.quantity} × ${item.price.toFixed(2)}
          </p>
        </div>

        <div className="text-[16px] font-semibold text-orange-500">
          ${(item.price * item.quantity).toFixed(2)}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        {/* Quantity controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDecrease(item.id)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
          >
            <Minus size={16} />
          </button>

          <span className="min-w-[20px] text-center font-medium">
            {item.quantity}
          </span>

          <button
            onClick={() => onIncrease(item.id)}
            className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Remove action */}
        <button
          onClick={() => onRemove(item.id)}
          className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm font-medium"
        >
          <Trash2 size={16} />
          Remove
        </button>
      </div>
    </div>
  );
}

export default CartItem;