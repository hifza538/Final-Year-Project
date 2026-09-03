import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { getReportsOverview } from "../services/reportsService";

// Consistent orange-toned palette for the status breakdown pie chart
const STATUS_COLORS = {
  Pending: "#FCD9BC",
  Accepted: "#FDBA74",
  Preparing: "#FB923C",
  Ready: "#F97316",
  OutForDelivery: "#EA580C",
  Completed: "#C2410C",
  Rejected: "#9CA3AF",
};

// Default range: last 30 days, formatted as yyyy-mm-dd for <input type="date">
const getDefaultDates = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  const format = (d) => d.toISOString().split("T")[0];
  return { start: format(start), end: format(end) };
};

const Reports = () => {
  const defaults = getDefaultDates();
  const [startDate, setStartDate] = useState(defaults.start);
  const [endDate, setEndDate] = useState(defaults.end);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getReportsOverview(startDate, endDate);
      setData(result);
    } catch (err) {
      setError("Failed to load reports. Please try again.");
      toast.error("Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyFilter = (e) => {
    e.preventDefault();
    fetchReports();
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-red-500 font-medium mb-1">{error}</p>
        <p className="text-sm text-gray-400">Check your connection and refresh the page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-secondary mb-1">Reports & Analytics</h1>
      <p className="text-sm text-gray-500 mb-5">
        Business performance based on real order data.
      </p>

      {/* Date range filter */}
      <form onSubmit={handleApplyFilter} className="flex flex-wrap items-end gap-3 mb-6">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={endDate}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
            max={defaults.end}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary text-white text-sm font-medium px-5 py-2 rounded-lg
            hover:bg-primary-dark transition-colors disabled:opacity-60"
        >
          {isLoading ? "Loading..." : "Apply"}
        </button>
      </form>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500 mb-1">Total Orders (selected range)</p>
          {isLoading ? (
            <div className="h-7 w-16 bg-gray-200 rounded animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-secondary">{data?.totalOrders ?? 0}</p>
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500 mb-1">Total Revenue (selected range)</p>
          {isLoading ? (
            <div className="h-7 w-20 bg-gray-200 rounded animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-secondary">Rs {data?.totalRevenue ?? 0}</p>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-72 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-72 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      ) : (
        <>
          {/* Orders trend */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
            <h3 className="text-sm font-semibold text-secondary mb-4">Orders Over Time</h3>
            {data.ordersTrend.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-sm text-gray-400">
                No orders in this date range
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={data.ordersTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE9" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="orders" stroke="#E8590C" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Revenue trend + status breakdown side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-secondary mb-4">Revenue Over Time</h3>
              {data.revenueTrend.length === 0 ? (
                <div className="h-56 flex items-center justify-center text-sm text-gray-400">
                  No revenue in this date range
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.revenueTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE9" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#E8590C" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-secondary mb-4">Order Status Breakdown</h3>
              {data.statusBreakdown.length === 0 ? (
                <div className="h-56 flex items-center justify-center text-sm text-gray-400">
                  No orders in this date range
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={data.statusBreakdown}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ status, count }) => `${status}: ${count}`}
                    >
                      {data.statusBreakdown.map((entry) => (
                        <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || "#D6D3D1"} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Top vendors */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <h3 className="text-sm font-semibold text-secondary px-5 py-4 border-b border-gray-100">
              Top Vendors (by revenue)
            </h3>
            {data.topVendors.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-400">
                No completed orders in this date range
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-5 py-2.5">Vendor</th>
                    <th className="px-5 py-2.5">Orders</th>
                    <th className="px-5 py-2.5 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topVendors.map((v, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="px-5 py-3 font-medium">{v.vendorName}</td>
                      <td className="px-5 py-3">{v.totalOrders}</td>
                      <td className="px-5 py-3 text-right">Rs {v.totalRevenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;