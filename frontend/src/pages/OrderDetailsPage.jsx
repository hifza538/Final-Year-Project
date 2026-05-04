import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Package,
  Clock3,
  Receipt,
  XCircle,
  ShoppingCart,
} from "lucide-react";
import { getOrderById, cancelOrder } from "../api/orderApi";
import OrderTrackingTimeline from "../components/orders/OrderTrackingTimeline";
import { useCart } from "../context/CartContext";

function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, clearCart } = useCart();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setPageError("");
        const response = await getOrderById(id);
        setOrder(response.data);
      } catch (error) {
        setPageError(
          error?.response?.data?.message || "Failed to load order details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  const getStatusClasses = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-700";
      case "Confirmed":
        return "bg-blue-100 text-blue-700";
      case "Preparing":
        return "bg-purple-100 text-purple-700";
      case "Out for Delivery":
        return "bg-indigo-100 text-indigo-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleCancelOrder = async () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmCancel) return;

    setCancelLoading(true);

    try {
      const response = await cancelOrder(order._id);
      setOrder(response.data.order);
      alert("Order cancelled successfully");
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancelLoading(false);
    }
  };

  const handleReorder = () => {
    const confirmReorder = window.confirm(
      "This will clear your current cart and add these items. Continue?"
    );
    if (!confirmReorder) return;

    clearCart();

    order.orderItems.forEach((item) => {
      for (let i = 0; i < item.qty; i++) {
        addToCart({
          id: `${order.restaurantName}-${item.name}`,
          restaurantName: order.restaurantName || "Restaurant",
          name: item.name,
          image: item.image,
          price: item.price,
        });
      }
    });

    alert("Items added to cart!");
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-slate-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white max-w-md w-full rounded-3xl shadow-sm border border-slate-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Unable to load order
          </h2>
          <p className="text-slate-500 mt-3">{pageError}</p>
          <button
            onClick={() => navigate("/orders")}
            className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl font-semibold transition"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate("/orders")}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-orange-500 font-medium mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </button>

        {/* Top Overview */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-5 h-5 text-orange-500" />
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  {order.restaurantName || "Restaurant"}
                </h1>
              </div>

              <p className="text-slate-500 font-medium">
                Order #{order._id.slice(-6)}
              </p>

              <div className="flex items-center gap-2 text-sm text-slate-500 mt-3">
                <Clock3 className="w-4 h-4" />
                <span>{formatDate(order.createdAt)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <span
                className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${getStatusClasses(
                  order.orderStatus
                )}`}
              >
                {order.orderStatus}
              </span>

              <div className="bg-slate-50 rounded-2xl px-5 py-4 min-w-[170px] text-center">
                <p className="text-sm text-slate-500">Total Amount</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  Rs {Number(order.totalPrice).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Ordered Items */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                Ordered Items
              </h2>

              <div className="space-y-4">
                {order.orderItems?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-2xl object-cover bg-slate-100"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-slate-500">Qty: {item.qty}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-slate-500">
                        Rs {Number(item.price).toFixed(2)} each
                      </p>
                      <p className="font-bold text-slate-900">
                        Rs {(item.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-orange-500" />
                <h2 className="text-xl font-bold text-slate-900">
                  Delivery Address
                </h2>
              </div>

              <div className="space-y-2 text-slate-700">
                <p className="font-semibold">{order.deliveryAddress?.fullName}</p>
                <p>{order.deliveryAddress?.phone}</p>
                <p>{order.deliveryAddress?.address}</p>
                {order.deliveryAddress?.city && (
                  <p>{order.deliveryAddress.city}</p>
                )}
                {order.deliveryAddress?.notes && (
                  <p className="text-sm text-slate-500 italic">
                    Note: {order.deliveryAddress.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-bold text-slate-900">
                  Payment Method
                </h2>
              </div>

              <p className="text-slate-700 font-medium">
                {order.paymentMethod || "Cash on Delivery"}
              </p>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-24">
              {/* Timeline */}
              <OrderTrackingTimeline currentStatus={order.orderStatus} />

              {/* Bill Summary */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Receipt className="w-5 h-5 text-orange-500" />
                  <h2 className="text-lg font-bold text-slate-900">
                    Bill Summary
                  </h2>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Items Price</span>
                    <span>Rs {Number(order.itemsPrice).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Fee</span>
                    <span>Rs {Number(order.deliveryFee).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tax</span>
                    <span>Rs {Number(order.taxPrice).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-bold text-slate-900">
                    <span>Total</span>
                    <span>Rs {Number(order.totalPrice).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-3">
                <button
                  onClick={handleReorder}
                  className="w-full inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Reorder
                </button>

                {order.orderStatus === "Pending" && (
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancelLoading}
                    className="w-full inline-flex items-center justify-center gap-2 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle className="w-5 h-5" />
                    {cancelLoading ? "Cancelling..." : "Cancel Order"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;