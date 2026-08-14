// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Users, Store, Bike, Package, Wallet, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getOverviewStats } from "../services/statsService";
import StatCard from "../components/dashboard/StatCard";
import RevenueSummary from "../components/dashboard/RevenueSummary";
import ApprovalBreakdown from "../components/dashboard/ApprovalBreakdown";
import { OrdersLineChart, RevenueBarChart } from "../components/dashboard/DashboardCharts";
import RecentOrdersTable from "../components/dashboard/RecentOrdersTable";
import QuickActions from "../components/dashboard/QuickActions";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getOverviewStats();
        setStats(data.stats);
      } catch (err) {
        setError("Failed to load dashboard stats. Please try again.");
        toast.error("Failed to load dashboard stats");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-red-500 font-medium mb-1">{error}</p>
        <p className="text-sm text-gray-400">Check your connection and refresh the page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-secondary mb-1">
        Welcome, {user?.fullName}
      </h1>
      <p className="text-gray-500 text-sm mb-5">
        Here's what's happening on LocalBites today.
      </p>

      {/* Stat cards - dense grid, 4 per row desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
        <StatCard icon={Users} label="Total Customers" value={stats?.totalCustomers} gradient="#E8590C" isLoading={isLoading} />
        <StatCard icon={Store} label="Total Vendors" value={stats?.totalVendors} gradient="#C2410C" isLoading={isLoading} />
        <StatCard icon={Bike} label="Total Riders" value={stats?.totalRiders} gradient="#EA580C" isLoading={isLoading} />
        <StatCard icon={Package} label="Total Orders" value={stats?.totalOrders} gradient="#F97316" isLoading={isLoading} />
        <StatCard icon={Wallet} label="Total Revenue" value={stats ? `Rs ${stats.totalRevenue}` : undefined} gradient="#E8590C" isLoading={isLoading} />
        <StatCard icon={Clock} label="Pending Vendors" value={stats?.pendingVendors} gradient="#D97706" isLoading={isLoading} />
        <StatCard icon={Clock} label="Pending Riders" value={stats?.pendingRiders} gradient="#D97706" isLoading={isLoading} />
      </div>

      {/* Two-column main area: left = charts + table, right = real-data widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <OrdersLineChart data={[]} />
            <RevenueBarChart data={[]} />
          </div>
          <RecentOrdersTable orders={[]} />
        </div>

        <div className="space-y-4">
          <ApprovalBreakdown stats={stats} isLoading={isLoading} />
          <RevenueSummary isLoading={isLoading} />
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;