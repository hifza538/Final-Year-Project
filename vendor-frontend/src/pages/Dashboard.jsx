import { useEffect, useState, useCallback } from "react";
import {
  ShoppingBag,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import api from "../services/api";
import ErrorState from "../components/common/ErrorState";

// stat card component
const StatCard = ({ label, value, icon: Icon, color, sub }) => {
  const colorMap = {
    orange:  { bg: "bg-primary-light",  icon: "bg-primary",  },
    amber: { bg: "bg-amber-50", icon: "bg-amber-500", },
    green: { bg: "bg-green-50", icon: "bg-green-500", },
    blue:  { bg: "bg-blue-50",  icon: "bg-blue-500",  },
  };
  const c = colorMap[color] || colorMap.primary;

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 ${c.icon} rounded-lg flex items-center justify-center`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
    </div>
  );
};

// skeleton loader for stat card
const SkeletonCard = () => (
  <div className="bg-white rounded-xl p-5 border border-gray-100 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <div className="h-3 w-24 bg-gray-200 rounded" />
        <div className="h-7 w-16 bg-gray-200 rounded" />
        <div className="h-3 w-20 bg-gray-100 rounded" />
      </div>
      <div className="w-10 h-10 bg-gray-200 rounded-lg" />
    </div>
  </div>
);

// Dashboard page 
const Dashboard = () => {
  const [stats, setStats]           = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStats = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/vendor/dashboard-stats");
      setStats(data.stats);
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
          label: "Total Orders",
          value: stats.totalOrders ?? 0,
          icon:  ShoppingBag,
          color: "orange",
          sub:   "All time",
        },
        {
          label: "Pending Orders",
          value: stats.pendingOrders ?? 0,
          icon:  Clock,
          color: "amber",
          sub:   "Awaiting action",
        },
        {
          label: "Total Earnings",
          value: `Rs ${(stats.totalEarnings ?? 0).toLocaleString()}`,
          icon:  DollarSign,
          color: "green",
          sub:   "From completed orders",
        },
        {
          label: "Customers",
          value: stats.totalCustomers ?? 0,
          icon:  Users,
          color: "blue",
          sub:   "Unique customers",
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
              Last updated {lastUpdated.toLocaleTimeString()}
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
          : cards.map((card) => <StatCard key={card.label} {...card} />)
        }
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

      {/* Revenue Chart Placeholder */}
      {!loading && !error && (stats?.totalOrders ?? 0) > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-700 mb-1">
            Revenue Chart
          </p>
          <p className="text-xs text-gray-400">
            Charts coming in a future update.
          </p>
          <div className="mt-4 h-28 bg-gray-50 rounded-lg border border-dashed 
            border-gray-200 flex items-center justify-center">
            <TrendingUp size={24} className="text-gray-300" />
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;