import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import {
  getAvailableOrders,
  acceptOrder,
  getMyOrders,
  deliverOrder,
  getOrderHistory,
} from "../services/orderService";
import OrderCard from "../components/orders/OrderCard";
import OrderCardSkeleton from "../components/orders/OrderCardSkeleton";
import EmptyState from "../components/common/EmptyState";

const TABS = [
  { key: "available", label: "Available Orders" },
  { key: "myOrders", label: "My Deliveries" },
  { key: "history", label: "History" },
];

const Home = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("available");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Fetch orders based on the active tab (available, myOrders, history)
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      let data;
      if (activeTab === "available") data = await getAvailableOrders();
      else if (activeTab === "myOrders") data = await getMyOrders();
      else data = await getOrderHistory();

      setOrders(data.orders);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  // delivery-frontend/src/pages/Home.jsx

useEffect(() => {
  // Only fetch orders once the rider is approved
  if (user?.isApproved) {
    queueMicrotask(() => {
      fetchOrders();
    });
  }
}, [fetchOrders, user?.isApproved]);

  const handleAccept = async (orderId) => {
    setActionLoadingId(orderId);
    try {
      await acceptOrder(orderId);
      toast.success("Order accepted! Go to the restaurant.");
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not accept this order.");
      fetchOrders(); // Refresh the list to reflect any changes (if the order was already accepted by another rider)
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeliver = async (orderId) => {
    setActionLoadingId(orderId);
    try {
      await deliverOrder(orderId);
      toast.success("Order marked as delivered!");
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update this order.");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user?.fullName?.split(" ")[0]}
        </h1>
        <button
          onClick={logout}
          className="text-sm font-medium text-gray-500 hover:text-primary transition-colors"
        >
          Logout
        </button>
      </div>

      {!user?.isApproved ? (
        <div className="bg-primary-light border border-primary/20 text-primary-dark rounded-lg p-4 text-sm">
          Your account is pending admin approval. You'll be notified once approved.
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors duration-200 border-b-2 -mb-px
                  ${
                    activeTab === tab.key
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {isLoading ? (
            <>
              <OrderCardSkeleton />
              <OrderCardSkeleton />
            </>
          ) : error ? (
            <div className="bg-red-50 border border-red-100 text-red-600 rounded-lg p-4 text-sm">
              {error}
            </div>
          ) : orders.length === 0 ? (
            <EmptyState
              message={
                activeTab === "available"
                  ? "No orders available for pickup right now."
                  : activeTab === "myOrders"
                  ? "You have no active deliveries."
                  : "You haven't completed any deliveries yet."
              }
            />
          ) : (
            orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                actionLabel={
                  activeTab === "available"
                    ? "Accept"
                    : activeTab === "myOrders"
                    ? "Mark Delivered"
                    : null
                }
                onAction={activeTab === "available" ? handleAccept : handleDeliver}
                actionLoading={actionLoadingId === order._id}
              />
            ))
          )}
        </>
      )}
    </div>
  );
};

export default Home;