// admin-frontend/src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Users, Store, Bike, Package, Wallet } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getOverviewStats, getOrdersTimeline, getRecentOrders } from "../services/statsService";
import StatCard from "../components/dashboard/StatCard";
import { OrdersLineChart } from "../components/dashboard/DashboardCharts";
import RecentOrdersTable from "../components/dashboard/RecentOrdersTable";
import QuickActions from "../components/dashboard/QuickActions";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [overviewData, timelineData, recentOrdersData] = await Promise.all([
          getOverviewStats(),
          getOrdersTimeline(),
          getRecentOrders(),
        ]);
        setStats(overviewData.stats);
        setTimeline(timelineData.timeline);
        setRecentOrders(recentOrdersData.orders);
      } catch (err) {
        setError("Failed to load dashboard stats. Please try again.");
        toast.error("Failed to load dashboard stats");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
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

      {/* 5 key stat cards — pending vendor/rider counts are handled via the
          approval pages themselves, no separate breakdown chart needed */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 mb-5">
        <StatCard icon={Users} label="Total Customers" value={stats?.totalCustomers} gradient="#E8590C" isLoading={isLoading} />
        <StatCard icon={Store} label="Total Vendors" value={stats?.totalVendors} gradient="#C2410C" isLoading={isLoading} />
        <StatCard icon={Bike} label="Total Riders" value={stats?.totalRiders} gradient="#EA580C" isLoading={isLoading} />
        <StatCard icon={Package} label="Total Orders" value={stats?.totalOrders} gradient="#F97316" isLoading={isLoading} />
        <StatCard icon={Wallet} label="Total Revenue" value={stats ? `Rs ${stats.totalRevenue}` : undefined} gradient="#E8590C" isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <OrdersLineChart data={timeline} />
          <RecentOrdersTable orders={recentOrders} />
        </div>

        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;