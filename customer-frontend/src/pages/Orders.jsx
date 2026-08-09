// customer-frontend/src/pages/Orders.jsx

import { useState, useEffect, useCallback } from "react";
import { Package } from "lucide-react";
import { getMyOrders } from "../services/orderService";
import OrderCard from "../components/orders/OrderCard";
import OrderCardSkeleton from "../components/orders/OrderCardSkeleton";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMyOrders();
      setOrders(data.orders);
    } catch (err) {
      console.error("Orders fetch error:", err);
      setError(err.response?.data?.message || "Failed to load your orders. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
        <Package size={24} />
        My Orders
      </h1>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <OrderCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && error && <ErrorState message={error} onRetry={fetchOrders} />}

      {!isLoading && !error && orders.length === 0 && (
        <EmptyState
          title="No orders yet"
          message="When you place an order, it'll show up here so you can track it."
        />
      )}

      {!isLoading && !error && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;