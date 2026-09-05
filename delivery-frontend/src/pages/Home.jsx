// delivery-frontend/src/pages/Home.jsx
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { UserCircle, Package, Clock, History as HistoryIcon, Bike } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  getAvailableOrders,
  acceptOrder,
  getMyOrders,
  advanceOrderStatus,
  getOrderHistory,
} from "../services/orderService";
import OrderCard from "../components/orders/OrderCard";
import ActiveOrderCard from "../components/orders/ActiveOrderCard";
import OrderCardSkeleton from "../components/orders/OrderCardSkeleton";
import EmptyState from "../components/common/EmptyState";
import OnlineToggle from "../components/common/OnlineToggle";

const TABS = [
  { key: "available", label: "Available", icon: Package },
  { key: "myOrders", label: "My Deliveries", icon: Clock },
  { key: "history", label: "History", icon: HistoryIcon },
];

const Home = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("available");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError("");
    setIsOffline(false);
    try {
      let data;
      if (activeTab === "available") {
        data = await getAvailableOrders();
        setIsOffline(data.isOnline === false);
      } else if (activeTab === "myOrders") {
        data = await getMyOrders();
      } else {
        data = await getOrderHistory();
      }
      setOrders(data.orders);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
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
      toast.success("Order accepted! Head to the restaurant.");
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not accept this order.");
      fetchOrders();
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAdvance = async (orderId) => {
    setActionLoadingId(orderId);
    try {
      const data = await advanceOrderStatus(orderId);
      toast.success(data.message);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update this order.");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      
      <div className="bg-primary px-4 sm:px-8 py-4 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              <Bike size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold leading-tight">LocalBites</p>
              <p className="text-primary-light/80 text-[11px] -mt-0.5">rider</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/profile"
              className="flex items-center gap-1.5 text-sm font-medium text-white/90 hover:text-white transition-colors"
            >
              <UserCircle size={18} />
              <span className="hidden sm:inline">{user?.fullName?.split(" ")[0]}</span>
            </Link>
            <button
              onClick={logout}
              className="text-sm font-medium text-white/90 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-6">
        {!user?.isApproved ? (
          <div className="bg-primary-light border border-primary/20 text-primary-dark rounded-xl p-4 text-sm">
            Your account is pending admin approval. You'll be notified once approved.
          </div>
        ) : (
          <>
            <OnlineToggle />

           
            <div className="flex gap-1 mb-6 bg-white rounded-xl border border-gray-100 shadow-sm p-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive ? "bg-primary text-white shadow-sm" : "text-gray-500 hover:bg-cream"}`}
                  >
                    <Icon size={15} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {isLoading ? (
              <>
                <OrderCardSkeleton />
                <OrderCardSkeleton />
              </>
            ) : error ? (
              <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-4 text-sm">
                {error}
              </div>
            ) : isOffline ? (
              <EmptyState message="You're offline. Go online to see available orders." />
            ) : orders.length === 0 ? (
              <EmptyState
                message={
                  activeTab === "available"
                    ? "No orders available for pickup right now."
                    : activeTab === "myOrders"
                    ? "You have no active deliveries."
                    : "You have not completed any deliveries yet."
                }
              />
            ) : activeTab === "myOrders" ? (
              orders.map((order) => (
                <ActiveOrderCard
                  key={order._id}
                  order={order}
                  onAdvance={handleAdvance}
                  actionLoading={actionLoadingId === order._id}
                />
              ))
            ) : (
              orders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  actionLabel={activeTab === "available" ? "Accept" : null}
                  onAction={activeTab === "available" ? handleAccept : undefined}
                  actionLoading={actionLoadingId === order._id}
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;