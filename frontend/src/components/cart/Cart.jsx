// src/components/cart/Cart.jsx
import React from "react";
import CartItem from "./CartItem";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Cart({ cartItems, onIncrease, onDecrease, onRemove }) {
  const navigate = useNavigate();

  // Calculate cart summary
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const deliveryFee = cartItems.length > 0 ? 2.99 : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate("/checkout");
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-5 sticky top-24">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <ShoppingCart className="text-orange-500" size={24} />
        <h2 className="text-2xl font-bold text-slate-900">Your Order</h2>
      </div>

      {cartItems.length === 0 ? (
        // Empty cart state
        <div className="text-center py-10">
          <div className="w-14 h-14 mx-auto rounded-full bg-orange-50 flex items-center justify-center mb-4">
            <ShoppingCart className="text-orange-500" size={24} />
          </div>

          <p className="text-slate-600 font-medium">Your cart is empty</p>
          <p className="text-slate-400 text-sm mt-1">
            Add items from menu to start your order
          </p>
        </div>
      ) : (
        <>
          {/* Cart items list */}
          <div className="max-h-[420px] overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={onIncrease}
                onDecrease={onDecrease}
                onRemove={onRemove}
              />
            ))}
          </div>

          {/* Price summary */}
          <div className="border-t border-slate-200 mt-5 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-lg font-bold text-slate-900 pt-2">
              <span>Total</span>
              <span className="text-orange-500">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout button */}
          <button
            onClick={handleCheckout}
            className="w-full mt-5 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition"
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;