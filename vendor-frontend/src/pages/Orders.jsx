import { useEffect, useState, useCallback } from "react";
import {
  ShoppingBag, Clock, CheckCircle2, XCircle,
  ChevronDown, RefreshCw, Search, Phone,
  Mail, MapPin, UtensilsCrossed, Loader2,
} from "lucide-react";
import api from "../services/api";

// constants for order status filters, labels, and colors
const STATUS_FILTERS = [
  "All", "Pending", "Accepted", "Preparing",
  "Ready", "OutForDelivery", "Completed", "Rejected",
];

const STATUS_CONFIG = {
  Pending:        { color: "bg-amber-100 text-amber-700",  label: "Pending"          },
  Accepted:       { color: "bg-blue-100 text-blue-700",    label: "Accepted"         },
  Preparing:      { color: "bg-purple-100 text-purple-700",label: "Preparing"        },
  Ready:          { color: "bg-indigo-100 text-indigo-700",label: "Ready"            },
  OutForDelivery: { color: "bg-orange-100 text-orange-700",label: "Out for Delivery" },
  Completed:      { color: "bg-green-100 text-green-700",  label: "Completed"        },
  Rejected:       { color: "bg-red-100 text-red-700",      label: "Rejected"         },
};

// Status flow - what actions vendor can take
const STATUS_ACTIONS = {
  Pending:        ["Accepted", "Rejected"],
  Accepted:       ["Preparing"],
  Preparing:      ["Ready"],
  Ready:          ["OutForDelivery"],
  OutForDelivery: ["Completed"],
  Completed:      [],
  Rejected:       [],
};

const ACTION_LABELS = {
  Accepted:       "Accept Order",
  Rejected:       "Reject Order",
  Preparing:      "Start Preparing",
  Ready:          "Mark as Ready",
  OutForDelivery: "Out for Delivery",
  Completed:      "Mark Completed",
};

const ACTION_COLORS = {
  Accepted:       "bg-green-500 hover:bg-green-600 text-white",
  Rejected:       "bg-red-500 hover:bg-red-600 text-white",
  Preparing:      "bg-purple-500 hover:bg-purple-600 text-white",
  Ready:          "bg-indigo-500 hover:bg-indigo-600 text-white",
  OutForDelivery: "bg-orange-500 hover:bg-orange-600 text-white",
  Completed:      "bg-green-500 hover:bg-green-600 text-white",
};

// skeleton loader for order card
const SkeletonOrder = () => (
  <div className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-32" />
        <div className="h-3 bg-gray-100 rounded w-24" />
      </div>
      <div className="h-6 bg-gray-200 rounded-full w-20" />
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="h-3 bg-gray-100 rounded w-3/4" />
    </div>
    <div className="h-9 bg-gray-200 rounded-lg" />
  </div>
);

//order card component
const OrderCard = ({ order, onUpdateStatus, updating }) => {
  const [expanded, setExpanded] = useState(false);
  const config  = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.Pending;
  const actions = STATUS_ACTIONS[order.orderStatus] || [];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-PK", {
      day:    "2-digit",
      month:  "short",
      year:   "numeric",
      hour:   "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm 
      hover:shadow-md transition-shadow overflow-hidden">

      {/* Card Header */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-bold text-gray-900 text-sm">
              Order #{order._id.slice(-6).toUpperCase()}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full 
            ${config.color}`}>
            {config.label}
          </span>
        </div>

        {/* Customer Info */}
        <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <ShoppingBag size={12} className="text-gray-400" />
            <span className="font-medium">
              {order.customer?.fullName || "Unknown Customer"}
            </span>
          </div>
          {order.customer?.phone && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Phone size={12} className="text-gray-400" />
              {order.customer.phone}
            </div>
          )}
          {order.customer?.email && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Mail size={12} className="text-gray-400" />
              {order.customer.email}
            </div>
          )}
          {order.deliveryAddress?.address && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin size={12} className="text-gray-400" />
              {order.deliveryAddress.address}, {order.deliveryAddress.city}
            </div>
          )}
        </div>

        {/* Price Summary */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-gray-500">
            {order.orderItems?.length} item
            {order.orderItems?.length !== 1 ? "s" : ""}
          </p>
          <p className="font-bold text-gray-900">
            Rs {order.totalPrice?.toLocaleString()}
          </p>
        </div>

        {/* Expand Toggle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-center gap-1 
            text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
        >
          {expanded ? "Hide" : "View"} order items
          <ChevronDown
            size={12}
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>

        {/* Order Items - Expanded */}
        {expanded && (
          <div className="mt-3 border-t border-gray-100 pt-3 space-y-2">
            {order.orderItems?.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed size={12} className="text-gray-400" />
                  <span className="text-xs text-gray-700">{item.name}</span>
                  <span className="text-xs text-gray-400">x{item.qty}</span>
                </div>
                <span className="text-xs font-medium text-gray-700">
                  Rs {(item.price * item.qty).toLocaleString()}
                </span>
              </div>
            ))}

            {/* Price Breakdown */}
            <div className="border-t border-gray-100 pt-2 mt-2 space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Items Total</span>
                <span>Rs {order.itemsPrice?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Delivery Fee</span>
                <span>Rs {order.deliveryFee?.toLocaleString()}</span>
              </div>
              {order.deliveryAddress?.notes && (
                <div className="bg-amber-50 rounded p-2 mt-2">
                  <p className="text-xs text-amber-700">
                    <span className="font-medium">Note: </span>
                    {order.deliveryAddress.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {actions.length > 0 && (
        <div className={`px-5 pb-5 flex gap-2 
          ${actions.length > 1 ? "flex-row" : ""}`}>
          {actions.map((action) => (
            <button
              key={action}
              onClick={() => onUpdateStatus(order._id, action)}
              disabled={updating === order._id}
              className={`flex-1 flex items-center justify-center gap-2 
                py-2.5 rounded-lg text-sm font-semibold transition-colors
                disabled:opacity-50 ${ACTION_COLORS[action]}`}
            >
              {updating === order._id ? (
                <Loader2 size={14} className="animate-spin" />
              ) : action === "Accepted" ? (
                <CheckCircle2 size={14} />
              ) : action === "Rejected" ? (
                <XCircle size={14} />
              ) : (
                <Clock size={14} />
              )}
              {ACTION_LABELS[action]}
            </button>
          ))}
        </div>
      )}

      {/* Completed / Rejected — No Actions */}
      {actions.length === 0 && (
        <div className={`px-5 pb-5`}>
          <div className={`w-full py-2.5 rounded-lg text-sm font-medium 
            text-center ${config.color}`}>
            {order.orderStatus === "Completed"
              ? "✓ Order Completed"
              : "✗ Order Rejected"
            }
          </div>
        </div>
      )}
    </div>
  );
};

// Main Orders Page
const Orders = () => {
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch]         = useState("");
  const [updating, setUpdating]     = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // ── Fetch Orders ─────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = activeFilter !== "All"
        ? { status: activeFilter }
        : {};
      const { data } = await api.get("/vendor/orders", { params });
      setOrders(data.orders);
      setLastUpdated(new Date());
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // update order status
  const handleUpdateStatus = async (orderId, status) => {
    setUpdating(orderId);
    try {
      const { data } = await api.patch(
        `/vendor/orders/${orderId}/status`,
        { status }
      );
      // Update order in state
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? data.order : o))
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update order status."
      );
    } finally {
      setUpdating(null);
    }
  };

  // search filter
  const filteredOrders = orders.filter((order) => {
    const searchLower = search.toLowerCase();
    return (
      order._id.slice(-6).toLowerCase().includes(searchLower) ||
      order.customer?.fullName?.toLowerCase().includes(searchLower) ||
      order.customer?.phone?.includes(search)
    );
  });

  // ── Order Counts Per Status ──────────────────────────────
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Order Management
          </h2>
          {lastUpdated && (
            <p className="text-xs text-gray-400 mt-0.5">
              Last updated {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 text-sm text-gray-500 
            hover:text-pink-500 border border-gray-200 
            hover:border-pink-300 px-3 py-2 rounded-lg 
            transition-colors disabled:opacity-50"
        >
          <RefreshCw
            size={14}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 
          text-sm px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchOrders}
            className="text-red-500 underline text-xs ml-4"
          >
            Retry
          </button>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold 
              transition-colors ${
                activeFilter === filter
                  ? "bg-pink-500 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-pink-300"
              }`}
          >
            {filter}
            {filter !== "All" && statusCounts[filter] ? (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs
                ${activeFilter === filter
                  ? "bg-white/20"
                  : "bg-gray-100"
                }`}>
                {statusCounts[filter]}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search by order ID, customer name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border 
            border-gray-200 focus:outline-none focus:ring-2 
            focus:ring-pink-500 transition"
        />
      </div>

      {/* Orders Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <SkeletonOrder key={i} />)}
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onUpdateStatus={handleUpdateStatus}
              updating={updating}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-xl border border-dashed 
          border-gray-200 p-12 text-center">
          <div className="w-14 h-14 bg-pink-50 rounded-full flex items-center 
            justify-center mx-auto mb-4">
            <ShoppingBag size={24} className="text-pink-500" />
          </div>
          <h3 className="text-gray-800 font-semibold mb-1">
            {search
              ? "No orders match your search"
              : activeFilter !== "All"
              ? `No ${activeFilter} orders`
              : "No orders yet"
            }
          </h3>
          <p className="text-gray-400 text-sm max-w-xs mx-auto">
            {search
              ? "Try a different search term"
              : activeFilter !== "All"
              ? "Orders will appear here when their status matches"
              : "When customers place orders, they will appear here"
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Orders;