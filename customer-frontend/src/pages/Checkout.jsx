// customer-frontend/src/pages/Checkout.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Truck, Plus } from "lucide-react";
import { checkoutSchema } from "../utils/validationSchemas";
import { placeOrder } from "../services/orderService";
import { getAddresses } from "../services/addressService";
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
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      showErrorToast("Please log in to place an order");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Fetch the actual delivery fee for this cart's restaurant
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

  // Load saved addresses — pre-select the default one, or fall back to manual entry
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchAddresses = async () => {
      try {
        const data = await getAddresses();
        setSavedAddresses(data.addresses);
        const defaultAddr = data.addresses.find((a) => a.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr._id);
        } else if (data.addresses.length === 0) {
          setUseNewAddress(true);
        }
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
        setUseNewAddress(true);
      }
    };
    fetchAddresses();
  }, [isAuthenticated]);

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
      city: "",
      notes: "",
    },
  });

  const grandTotal = cartTotal + deliveryFee;

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
      // Use the selected saved address if one is picked, otherwise use the manually typed form
      const selectedSaved = savedAddresses.find((a) => a._id === selectedAddressId);
      const deliveryAddress = !useNewAddress && selectedSaved
        ? {
            fullName: selectedSaved.fullName,
            phone: selectedSaved.phone,
            address: selectedSaved.address,
            city: selectedSaved.city,
            notes: selectedSaved.notes,
          }
        : formData;

      const orderData = {
        vendorId: restaurantId,
        items: cartItems.map((item) => ({
          _id: item._id,
          name: item.name,
          quantity: item.quantity,
        })),
        deliveryAddress,
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-primary" />
              <h2 className="font-semibold text-gray-900">Delivery Address</h2>
            </div>
            {savedAddresses.length > 0 && (
              <button
                type="button"
                onClick={() => setUseNewAddress((prev) => !prev)}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                {useNewAddress ? "Use saved address" : (
                  <>
                    <Plus size={12} />
                    New address
                  </>
                )}
              </button>
            )}
          </div>

          {/* Saved address picker */}
          {!useNewAddress && savedAddresses.length > 0 && (
            <div className="space-y-2">
              {savedAddresses.map((addr) => (
                <label
                  key={addr._id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors duration-200
                    ${selectedAddressId === addr._id ? "border-primary bg-primary-light" : "border-gray-200 hover:bg-gray-50"}`}
                >
                  <input
                    type="radio"
                    name="savedAddress"
                    checked={selectedAddressId === addr._id}
                    onChange={() => setSelectedAddressId(addr._id)}
                    className="mt-1 accent-primary"
                  />
                  <div className="text-sm">
                    <span className="font-semibold text-gray-900">{addr.label}</span>
                    <p className="text-gray-600 mt-0.5">{addr.fullName} — {addr.phone}</p>
                    <p className="text-gray-500">{addr.address}, {addr.city}</p>
                  </div>
                </label>
              ))}
            </div>
          )}

          {/* Manual entry form — shown when no saved addresses exist, or user chose "New address" */}
          {(useNewAddress || savedAddresses.length === 0) && (
            <div className={savedAddresses.length > 0 ? "mt-4 pt-4 border-t border-gray-100" : ""}>
              <FormInput
                label="Full Name"
                placeholder="Your full name"
                registration={register("fullName")}
                error={errors.fullName}
              />
              <FormInput
                label="Phone Number"
                placeholder="Enter your phone number"
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
                placeholder="Enter your city"
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
          )}
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

        {/* Payment method - Cash on Delivery */}
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