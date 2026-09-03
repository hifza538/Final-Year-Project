import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Search, Eye } from "lucide-react";
import { getAllOrders } from "../services/orderService";

const statusFilters = [
  { value: "all", label: "All" },
  { value: "Pending", label: "Pending" },
  { value: "Accepted", label: "Accepted" },
  { value: "Preparing", label: "Preparing" },
  { value: "Ready", label: "Ready" },
  { value: "OutForDelivery", label: "Out for Delivery" },
  { value: "Completed", label: "Completed" },
  { value: "Rejected", label: "Rejected" },
];

const statusStyles = {
  Pending: "bg-yellow-50 text-yellow-700",
  Accepted: "bg-blue-50 text-blue-700",
  Preparing: "bg-blue-50 text-blue-700",
  Ready: "bg-blue-50 text-blue-700",
  OutForDelivery: "bg-purple-50 text-purple-700",
  Completed: "bg-green-50 text-green-700",
  Rejected: "bg-red-50 text-red-600",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (status !== "all") params.status = status;
      if (search.trim()) params.search = search.trim();

      const data = await getAllOrders(params);
      setOrders(data.orders);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  }, [status, search]);

  useEffect(() => {
    const timer = setTimeout(fetchOrders, 400);
    return () => clearTimeout(timer);
  }, [fetchOrders]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-secondary mb-6">Orders</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer or vendor name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm
              outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                ${
                  status === f.value
                    ? "bg-primary text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-primary/40"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-200 rounded-lg" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No orders found</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium">#{order._id.slice(-6)}</td>
                  <td className="px-4 py-3">{order.customer?.fullName || "—"}</td>
                  <td className="px-4 py-3">{order.vendor?.shopName || "—"}</td>
                  <td className="px-4 py-3">Rs {order.totalPrice}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        statusStyles[order.orderStatus] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end">
                      <Link
                        to={`/orders/${order._id}`}
                        className="p-1.5 text-gray-500 hover:bg-gray-50 rounded-lg"
                        aria-label="View details"
                      >
                        <Eye size={18} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;