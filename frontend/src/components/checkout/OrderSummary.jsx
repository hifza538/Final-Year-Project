// src/components/checkout/OrderSummary.jsx
import React from "react";
import { ShoppingBag } from "lucide-react";

function OrderSummary({ cartItems, isLoading }) {
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const deliveryFee = cartItems.length > 0 ? 2.99 : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
      <div className="flex items-center gap-3 mb-5">
        <ShoppingBag className="w-5 h-5 text-orange-500" />
        <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
      </div>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 border-b border-gray-100 pb-4"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-14 h-14 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900">{item.name}</h4>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 mt-5 pt-4 space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Delivery Fee</span>
          <span>${deliveryFee.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
          <span>Total</span>
          <span className="text-orange-500">${total.toFixed(2)}</span>
        </div>
      </div>

<button
  type="submit"
  disabled={isLoading}
  className={`w-full mt-6 py-3 rounded-xl font-semibold transition ${
    isLoading
      ? "bg-orange-300 cursor-not-allowed"
      : "bg-orange-500 hover:bg-orange-600 text-white"
  }`}
>
  {isLoading ? "Placing Order..." : "Place Order"}
</button>
    </div>
  );
}

export default OrderSummary;