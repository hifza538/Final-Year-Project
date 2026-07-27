// customer-frontend/src/pages/Cart.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { getRestaurantById } from "../services/restaurantService";
import CartItemRow from "../components/cart/CartItemRow";
import EmptyState from "../components/common/EmptyState";

const Cart = () => {
  const { cartItems, cartTotal, clearCart, restaurantId } = useCart();
  const navigate = useNavigate();

    // Delivery fee now comes from the actual restaurant the cart belongs to(not a flat number)
  const [deliveryFee, setDeliveryFee] = useState(0);

    useEffect(() => {
    if (!restaurantId) return;
        const fetchDeliveryFee = async () => {
      try {
        const data = await getRestaurantById(restaurantId);
        setDeliveryFee(data.restaurant.deliveryFee ?? 50);
      } catch (err) {
        console.error("Failed to fetch restaurant delivery fee:", err);
        setDeliveryFee(50); // Fallback so checkout math still works even if this fetch fails
      }
    };

    fetchDeliveryFee();
  }, [restaurantId]);


  const grandTotal = cartItems.length > 0 ? cartTotal + deliveryFee : 0;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <EmptyState
          title="Your cart is empty"
          message="Looks like you haven't added anything yet. Browse restaurants and find something delicious."
        />
        <div className="flex justify-center mt-6">
          <Link
            to="/"
            className="px-6 py-2.5 bg-primary text-white font-semibold rounded-full
                       hover:bg-primary-dark transition-colors duration-200"
          >
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingBag size={24} />
          Your Cart
        </h1>
        <button
          onClick={clearCart}
          className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors duration-200"
        >
          Clear Cart
        </button>
      </div>

      {/* Cart items */}
      <div className="space-y-3">
        {cartItems.map((item) => (
          <CartItemRow key={item._id} item={item} />
        ))}
      </div>

      {/* Order summary */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mt-6 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>Rs. {cartTotal}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Delivery Fee</span>
          <span>Rs. {deliveryFee}</span>
        </div>
        <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between font-semibold text-gray-900">
          <span>Total</span>
          <span>Rs. {grandTotal}</span>
        </div>
      </div>

      {/* Checkout button - placeholder until Checkout feature is built */}
      <button
        onClick={() => navigate("/checkout")}
        className="w-full mt-6 py-3 bg-primary text-white font-semibold rounded-full
                   hover:bg-primary-dark transition-colors duration-200
                   flex items-center justify-center gap-2"
      >
        Proceed to Checkout
        <ArrowRight size={18} />
      </button>
    </div>
  );
};

export default Cart;