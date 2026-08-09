// customer-frontend/src/pages/Checkout.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Truck } from "lucide-react";
import { checkoutSchema } from "../utils/validationSchemas";
import { placeOrder } from "../services/orderService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getRestaurantById } from "../services/restaurantService";
import FormInput from "../components/common/FormInput";
import { showSuccessToast, showErrorToast } from "../utils/toast";

const Checkout = () => {
  const { cartItems, cartTotal, restaurantId, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);

    useEffect(() => {
    if (!isAuthenticated) {
      showErrorToast("Please log in to place an order");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Fetch the actual delivery fee
  useEffect(() => {
    if (!restaurantId) return;
    const fetchFee = async () => {
      try {
        const data = await getRestaurantById(restaurantId);
        setDeliveryFee(data.restaurant.deliveryFee ?? 50);
      } catch (err) {
        console.error("Failed to fetch delivery fee:", err);
        setDeliveryFee(50);
      }
    };
    fetchFee();
  }, [restaurantId]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      address: "",
      notes: "",
      city: "",
    },
  });

  const grandTotal = cartTotal + deliveryFee;
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Your cart is empty. Add some items before checking out.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2.5 bg-primary text-white font-semibold rounded-full
                     hover:bg-primary-dark transition-colors duration-200"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const orderData = {
        vendorId: restaurantId,
        items: cartItems.map((item) => ({
          _id: item._id,
          name: item.name,
          quantity: item.quantity,
        })),
        deliveryAddress: formData,
      };

      const data = await placeOrder(orderData);
      clearCart();
      showSuccessToast("Order placed successfully!");

      setTimeout(() => {
        navigate(`/order-confirmation/${data.order._id}`);
      }, 1000);
    } catch (err) {
      if (err.response?.status === 401) {
        showErrorToast("Your session has expired. Please log in again.");
        navigate("/login");
        return;
      }
      const message = err.response?.data?.message || "Failed to place order. Please try again.";
      showErrorToast(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Delivery address section */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={18} className="text-primary" />
            <h2 className="font-semibold text-gray-900">Delivery Address</h2>
          </div>

          <FormInput
            label="Full Name"
            placeholder="Your full name"
            registration={register("fullName")}
            error={errors.fullName}
          />
          <FormInput
            label="Phone Number"
            placeholder="enter your phone number"
            registration={register("phone")}
            error={errors.phone}
          />
          <FormInput
            label="Address"
            placeholder="House number, street, area"
            registration={register("address")}
            error={errors.address}
          />
          <FormInput
            label="City"
            placeholder="enter your city"
            registration={register("city")}
            error={errors.city}
          />
          <FormInput
            label="Delivery Notes"
            placeholder="Any specific instructions for the delivery"
            registration={register("notes")}
            error={errors.notes}
            required={false}
          />
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Truck size={18} className="text-primary" />
            <h2 className="font-semibold text-gray-900">Order Summary</h2>
          </div>

          <div className="space-y-2">
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between text-sm text-gray-600">
                <span>{item.name} × {item.quantity}</span>
                <span>Rs. {item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 mt-3 pt-3 space-y-1.5">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>Rs. {cartTotal}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Delivery Fee</span>
              <span>Rs. {deliveryFee}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-900 pt-1">
              <span>Total</span>
              <span>Rs. {grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Payment method - Cash on Delivery*/}
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-2">Payment Method</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Cash on Delivery
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-primary text-white font-semibold rounded-full
                     hover:bg-primary-dark transition-colors duration-200
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Placing Order..." : `Place Order - Rs. ${grandTotal}`}
        </button>
      </form>
    </div>
  );
};

export default Checkout;