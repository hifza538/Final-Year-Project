import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DeliveryAddress from "../components/checkout/DeliveryAddress";
import CustomerInfo from "../components/checkout/CustomerInfo";
import PaymentMethod from "../components/checkout/PaymentMethod";
import OrderNotes from "../components/checkout/OrderNotes";
import OrderSummary from "../components/checkout/OrderSummary";
import { useCart } from "../context/CartContext";
import { createOrder } from "../api/orderApi";

function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    streetAddress: "",
    city: "",
    zipCode: "",
    paymentMethod: "Cash on Delivery",
    notes: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Price calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const deliveryFee = cartItems.length > 0 ? 2.99 : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  // Empty cart check
  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md w-full">
          <div className="w-20 h-20 mx-auto rounded-full bg-orange-100 flex items-center justify-center mb-6">
            <ShoppingCart className="w-10 h-10 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-8">
            Add some delicious items before proceeding to checkout.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simple validation
      if (!formData.fullName || !formData.phone || !formData.streetAddress) {
        alert("Please fill required fields");
        setIsLoading(false);
        return;
      }

      const orderData = {
        restaurantName: cartItems[0]?.restaurantName || "Restaurant",
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.quantity,
          image: item.image,
          price: item.price,
        })),
        deliveryAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.streetAddress,
          city: formData.city,
          notes: formData.notes,
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice: subtotal,
        deliveryFee: deliveryFee,
        taxPrice: tax,
        totalPrice: total,
      };

      const response = await createOrder(orderData);

      console.log("Order created:", response.data);

      clearCart();

      alert("Order placed successfully!");

      navigate("/order-success", {
        state: {
          orderId: response.data.order._id,
          customerName: formData.fullName,
        },
      });
    } catch (error) {
      console.error("Order error:", error);
      alert(error.response?.data?.message || "Failed to place order");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Checkout
        </h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Side Form */}
            <div className="lg:col-span-8 space-y-6">
              <CustomerInfo formData={formData} handleChange={handleChange} />
              <DeliveryAddress
                formData={formData}
                handleChange={handleChange}
              />
              <PaymentMethod formData={formData} handleChange={handleChange} />
              <OrderNotes formData={formData} handleChange={handleChange} />
            </div>

            {/* Right Side Summary */}
            <div className="lg:col-span-4">
              <OrderSummary
                cartItems={cartItems}
                isLoading={isLoading}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                tax={tax}
                total={total}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CheckoutPage;