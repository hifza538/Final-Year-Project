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
import MapPicker from "../components/common/MapPicker";
import { showSuccessToast, showErrorToast } from "../utils/toast";

const Checkout = () => {
  const { cartItems, cartTotal, restaurantId, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);
  // City of the restaurant, used to make sure the customer's city matches it
  const [restaurantCity, setRestaurantCity] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);

  const [newAddressCoordinates, setNewAddressCoordinates] = useState({ lat: null, lng: null });
  const [locationError, setLocationError] = useState("");
  const [deliveryCheck, setDeliveryCheck] = useState({
    loading: false,
    coordinatesKey: null,
    available: null,
    distanceKm: null,
    deliveryRadius: null,
    failed: false,
  });

  const selectedSavedAddress = savedAddresses.find((address) => address._id === selectedAddressId);
  const activeAddressCoordinates = useNewAddress || savedAddresses.length === 0
    ? newAddressCoordinates
    : selectedSavedAddress?.coordinates;
  const deliveryLat = activeAddressCoordinates?.lat;
  const deliveryLng = activeAddressCoordinates?.lng;
  const deliveryCoordinatesKey = deliveryLat == null || deliveryLng == null
    ? ""
    : `${restaurantId}:${deliveryLat},${deliveryLng}`;
  const deliveryCheckIsCurrent =
    deliveryCoordinatesKey !== "" && deliveryCheck.coordinatesKey === deliveryCoordinatesKey;
  const isCheckingDelivery = deliveryCoordinatesKey !== "" && !deliveryCheckIsCurrent;

  useEffect(() => {
    if (!isAuthenticated) {
      showErrorToast("Please log in to place an order");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Load the restaurant's delivery fee and city as soon as checkout opens,
  // so the total is correct even before a delivery location is pinned.
  useEffect(() => {
    if (!restaurantId) return;
    let cancelled = false;
    const fetchDeliveryFee = async () => {
      try {
        const data = await getRestaurantById(restaurantId);
        if (!cancelled) {
          setDeliveryFee(data.restaurant.deliveryFee ?? 50);
          setRestaurantCity(data.restaurant.city || "");
        }
      } catch (err) {
        console.error("Failed to load delivery fee:", err);
      }
    };
    fetchDeliveryFee();
    return () => {
      cancelled = true;
    };
  }, [restaurantId]);

  useEffect(() => {
    if (!restaurantId) return;
    const hasCoordinates =
      deliveryLat != null && deliveryLng != null &&
      Number.isFinite(Number(deliveryLat)) && Number.isFinite(Number(deliveryLng));

    if (!hasCoordinates) {
      return;
    }

    let cancelled = false;
    const coordinatesKey = `${restaurantId}:${deliveryLat},${deliveryLng}`;
    const checkDelivery = async () => {
      try {
        const data = await getRestaurantById(restaurantId, { lat: deliveryLat, lng: deliveryLng });
        if (cancelled) return;
        const restaurant = data.restaurant;
        setDeliveryFee(restaurant.deliveryFee ?? 50);
        setRestaurantCity(restaurant.city || "");
        setDeliveryCheck({
          loading: false,
          coordinatesKey,
          available: restaurant.deliveryAvailable,
          distanceKm: restaurant.distanceKm,
          deliveryRadius: restaurant.deliveryRadius,
          failed: false,
        });
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to check delivery availability:", err);
        setDeliveryCheck({
          loading: false,
          coordinatesKey,
          available: null,
          distanceKm: null,
          deliveryRadius: null,
          failed: true,
        });
      }
    };
    checkDelivery();
    return () => {
      cancelled = true;
    };
  }, [restaurantId, deliveryLat, deliveryLng]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchAddresses = async () => {
      try {
        const data = await getAddresses();
        setSavedAddresses(data.addresses);
        const defaultAddr = data.addresses.find((a) => a.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr._id);
        } else if (data.addresses.length > 0) {
          setSelectedAddressId(data.addresses[0]._id);
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
    watch,
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

  // City the customer is currently ordering to (typed or from the saved address)
  const enteredCity = useNewAddress || savedAddresses.length === 0
    ? watch("city")
    : selectedSavedAddress?.city;
  const cityMismatch =
    restaurantCity.trim() !== "" &&
    !!enteredCity?.trim() &&
    enteredCity.trim().toLowerCase() !== restaurantCity.trim().toLowerCase();

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
    if (cityMismatch) {
      showErrorToast(`This restaurant only delivers within ${restaurantCity}. Please enter the correct city.`);
      return;
    }

    if (useNewAddress || savedAddresses.length === 0) {
      if (newAddressCoordinates.lat == null || newAddressCoordinates.lng == null) {
        setLocationError("Please pin your delivery location on the map.");
        return;
      }
    }
    setLocationError("");

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
            coordinates: selectedSaved.coordinates || { lat: null, lng: null },
          }
        : { ...formData, coordinates: newAddressCoordinates };

      const orderData = {
        vendorId: restaurantId,
        items: cartItems.map((item) => ({
          _id: item.itemId || item._id,
          name: item.name,
          quantity: item.quantity,
          variantId: item.variantId || "",
          addonOptionIds: Array.isArray(item.addonOptionIds) ? item.addonOptionIds : [],
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

          {/* New address form */}
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

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Pin Location <span className="text-red-500">*</span>
                </label>
                <MapPicker
                  initialLat={newAddressCoordinates.lat}
                  initialLng={newAddressCoordinates.lng}
                  onLocationSelect={(lat, lng) => {
                    setNewAddressCoordinates({ lat, lng });
                    setLocationError("");
                  }}
                />

                {locationError && <p className="text-red-500 text-xs mt-1">{locationError}</p>}
              </div>
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

        {/* Payment method section */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-2">Payment Method</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Cash on Delivery
          </div>
        </div>

        {isCheckingDelivery && (
          <p className="mb-3 text-sm text-gray-500" role="status">
            Checking delivery availability for this address...
          </p>
        )}
        {deliveryCheckIsCurrent && deliveryCheck.available === false && (
          <p className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5" role="alert">
            Sorry, this restaurant is too far from your delivery address, so you can't order from it. Please choose a nearby restaurant.
          </p>
        )}
        {deliveryCheckIsCurrent && deliveryCheck.available === true && (
          <p className="mb-3 text-sm text-green-700" role="status">
            Delivery is available to this address ({deliveryCheck.distanceKm} km away).
          </p>
        )}
        {deliveryCheckIsCurrent && deliveryCheck.available === null && !deliveryCheck.failed && (
          <p className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5" role="alert">
            Sorry, this restaurant is not available in your area. Please choose a nearby restaurant.
          </p>
        )}
        {deliveryCoordinatesKey === "" && (
          <p className="mb-3 text-sm text-amber-700" role="status">
            Select an address with a pinned location, or add a new address and pin it on the map to check delivery availability.
          </p>
        )}
        {deliveryCheckIsCurrent && deliveryCheck.failed && (
          <p className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5" role="alert">
            Delivery availability could not be checked. Please reload checkout and try again.
          </p>
        )}
        {cityMismatch && (
          <p className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5" role="alert">
            This restaurant only delivers within {restaurantCity}. Please enter the correct city.
          </p>
        )}

        <button
          type="submit"
          disabled={
            isSubmitting ||
            isCheckingDelivery ||
            !deliveryCheckIsCurrent ||
            deliveryCheck.available !== true ||
            cityMismatch
          }
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