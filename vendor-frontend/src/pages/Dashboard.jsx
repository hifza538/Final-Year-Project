// vendor-frontend/src/pages/Dashboard.jsx

import { useEffect, useState, useCallback } from "react";
import { ShoppingBag, Clock, DollarSign, Users, TrendingUp, RefreshCw } from "lucide-react";
import { getDashboardStats, getVendorOrders } from "../services/orderService";
import ErrorState from "../components/common/ErrorState";
import StatCard from "../components/dashboard/StatCard";
import SkeletonCard from "../components/dashboard/SkeletonCard";
import RecentOrdersTable from "../components/dashboard/RecentOrdersTable";
 
// Dashboard page
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
 
  const fetchStats = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const [statsData, ordersData] = await Promise.all([
        getDashboardStats(),
        getVendorOrders(),
      ]);
      setStats(statsData.stats);
      setRecentOrders(ordersData.orders.slice(0, 5));
      setLastUpdated(new Date());
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load stats. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);
 
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);
 
  // auto refresh
  useEffect(() => {
    const interval = setInterval(() => fetchStats(true), 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);
 
  const cards = stats
    ? [
        {
          label: "Total orders",
          value: stats.totalOrders ?? 0,
          icon: ShoppingBag,
          color: "orange",
          sub: "All time",
        },
        {
          label: "Pending orders",
          value: stats.pendingOrders ?? 0,
          icon: Clock,
          color: "amber",
          sub: "Awaiting action",
        },
        {
          label: "Total earnings",
          value: `Rs ${(stats.totalEarnings ?? 0).toLocaleString()}`,
          icon: DollarSign,
          color: "green",
          sub: "From completed orders",
        },
        {
          label: "Customers",
          value: stats.totalCustomers ?? 0,
          icon: Users,
          color: "blue",
          sub: "Unique customers",
        },
      ]
    : [];
 
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Overview</h2>
          {lastUpdated && (
            <p className="text-xs text-gray-400 mt-0.5">
              Last updated at{" "}
              {lastUpdated.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
            </p>
          )}
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 text-sm text-gray-500 
            hover:text-primary-500 border border-gray-200 hover:border-primary-300 
            px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>
 
      {error && <ErrorState message={error} onRetry={() => fetchStats(false)} />}
 
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading
          ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : cards.map((card) => <StatCard key={card.label} {...card} />)}
      </div>
 
      {/* Empty State */}
      {!loading && !error && stats?.totalOrders === 0 && (
        <div className="bg-white rounded-xl border border-dashed border-gray-200 p-8 text-center">
          <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <TrendingUp size={22} className="text-primary-500" />
          </div>
          <h3 className="text-gray-800 font-semibold mb-1">No orders yet</h3>
          <p className="text-gray-400 text-sm max-w-xs mx-auto">
            Once customers start ordering, your stats will appear here.
            Make sure your menu is set up and your restaurant is active.
          </p>
        </div>
      )}
 
      {/* Revenue Chart Placeholder - compact bar, no longer a big empty box */}
      {!loading && !error && (stats?.totalOrders ?? 0) > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <TrendingUp size={18} className="text-gray-300" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Revenue chart</p>
            <p className="text-xs text-gray-400">Coming in a future update.</p>
          </div>
        </div>
      )}
 
      {/* Recent Orders */}
      {!loading && !error && (stats?.totalOrders ?? 0) > 0 && (
        <RecentOrdersTable orders={recentOrders} loading={loading} />
      )}
    </div>
  );
};
 
export default Dashboard;