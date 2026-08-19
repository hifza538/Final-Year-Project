// vendor-frontend/src/pages/Orders.jsx

import { useEffect, useState, useCallback } from "react";
import { ShoppingBag, RefreshCw, Search } from "lucide-react";
import api from "../services/api";
import OrderCard from "../components/orders/OrderCard";
import OrderCardSkeleton from "../components/orders/OrderCardSkeleton";
import { STATUS_FILTERS } from "../components/orders/orderConstants";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
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
      if (!silent) setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const interval = setInterval(() => fetchOrders(true), 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId, status) => {
    setUpdating(orderId);
    try {
      const { data } = await api.patch(
        `/vendor/orders/${orderId}/status`,
        { status }
      );
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

  const filteredOrders = orders.filter((order) => {
    const searchLower = search.toLowerCase();
    return (
      order._id.slice(-6).toLowerCase().includes(searchLower) ||
      order.customer?.fullName?.toLowerCase().includes(searchLower) ||
      order.customer?.phone?.includes(search)
    );
  });

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">

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
          onClick={() => fetchOrders(false)}
          disabled={loading}
          className="flex items-center gap-2 text-sm text-gray-500 
            hover:text-primary border border-gray-200 
            hover:border-primary/40 px-3 py-2 rounded-lg 
            transition-colors disabled:opacity-50"
        >
          <RefreshCw
            size={14}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {error && <ErrorState message={error} onRetry={() => fetchOrders(false)} />}

      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold 
              transition-colors ${activeFilter === filter
                ? "bg-primary text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-primary/40"
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
            focus:ring-primary transition"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <OrderCardSkeleton key={i} />)}
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
        <EmptyState
          icon={ShoppingBag}
          title={
            search
              ? "No orders match your search"
              : activeFilter !== "All"
                ? `No ${activeFilter} orders`
                : "No orders yet"
          }
          message={
            search
              ? "Try a different search term"
              : activeFilter !== "All"
                ? "Orders will appear here when their status matches"
                : "When customers place orders, they will appear here"
          }
        />
      )}
    </div>
  );
};

export default Orders;