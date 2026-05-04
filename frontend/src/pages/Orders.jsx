import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock3,
  CheckCircle2,
  Package,
  Receipt,
  ShoppingBag,
} from "lucide-react";
import { getMyOrders } from "../api/orderApi";

const Orders = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getMyOrders();
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const activeOrders = orders.filter((order) =>
    ["Pending", "Confirmed", "Preparing", "Out for Delivery"].includes(
      order.orderStatus
    )
  );

  const pastOrders = orders.filter((order) =>
    ["Delivered", "Cancelled"].includes(order.orderStatus)
  );

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

  const getItemPreview = (items) => {
    if (!items || items.length === 0) return "No items found";
    if (items.length === 1) return items[0].name;
    if (items.length === 2) return `${items[0].name}, ${items[1].name}`;
    return `${items[0].name}, ${items[1].name} +${items.length - 2} more`;
  };

  const renderOrderCard = (order, showReorder = false) => {
    const itemNames = getItemPreview(order.orderItems);
    const itemCount = order.orderItems?.length || 0;

    return (
      <div
        key={order._id}
        className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition px-5 py-4 md:px-6 md:py-5"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <h3 className="text-lg font-bold text-slate-900 truncate">
                {order.restaurantName || "Restaurant"}
              </h3>
            </div>

            <p className="text-sm text-slate-500 font-medium mb-1">
              Order #{order._id.slice(-6)}
            </p>

            <p className="text-sm text-slate-700 truncate">{itemNames}</p>

            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mt-2">
              <span>
                {itemCount} item{itemCount !== 1 ? "s" : ""}
              </span>
              <span>•</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
          </div>

          {/* Right content */}
          <div className="flex flex-col items-start md:items-end gap-2 md:min-w-[180px]">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                order.orderStatus
              )}`}
            >
              {order.orderStatus}
            </span>

            <p className="text-2xl font-bold text-slate-900">
              Rs {Number(order.totalPrice).toFixed(2)}
            </p>

            <div className="flex gap-2 flex-wrap md:justify-end">
              <button
                onClick={() => navigate(`/orders/${order._id}`)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-100 transition"
              >
                <Receipt className="w-4 h-4" />
                View Details
              </button>

              {showReorder && (
                <button
                  onClick={() => navigate(`/orders/${order._id}`)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Reorder
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-slate-500">Loading your orders...</p>
        </div>
      </div>
    );
  }

  const currentOrders = activeTab === "active" ? activeOrders : pastOrders;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="w-6 h-6 text-orange-500" />
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              My Orders
            </h1>
          </div>
          <p className="text-slate-500 text-sm md:text-base">
            Track your current orders and revisit your previous ones anytime.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setActiveTab("active")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeTab === "active"
                ? "bg-orange-500 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:border-orange-300 hover:text-orange-500"
            }`}
          >
            Active Orders ({activeOrders.length})
          </button>

          <button
            onClick={() => setActiveTab("past")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeTab === "past"
                ? "bg-orange-500 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:border-orange-300 hover:text-orange-500"
            }`}
          >
            Past Orders ({pastOrders.length})
          </button>
        </div>

        {/* Empty state */}
        {currentOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 text-center">
            {activeTab === "active" ? (
              <>
                <Clock3 className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-slate-900">
                  No active orders
                </h2>
                <p className="text-slate-500 mt-2">
                  You don&apos;t have any active orders right now.
                </p>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-slate-900">
                  No past orders yet
                </h2>
                <p className="text-slate-500 mt-2">
                  Your delivered or cancelled orders will appear here.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {currentOrders.map((order) =>
              renderOrderCard(order, activeTab === "past")
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;