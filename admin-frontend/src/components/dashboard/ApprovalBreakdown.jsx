// src/components/dashboard/ApprovalBreakdown.jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// Compact card showing approved vs pending vendors/riders. Shows "Coming soon"
const ApprovalBreakdown = ({ stats, isLoading }) => {
  const data = [
    {
      name: "Vendors",
      Approved: (stats?.totalVendors || 0) - (stats?.pendingVendors || 0),
      Pending: stats?.pendingVendors || 0,
    },
    {
      name: "Riders",
      Approved: (stats?.totalRiders || 0) - (stats?.pendingRiders || 0),
      Pending: stats?.pendingRiders || 0,
    },
  ];

  // If the Orders feature isn't ready, show "Coming soon" instead of fabricated numbers
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-secondary mb-4">Approval Breakdown</h3>
      {isLoading ? (
        <div className="h-48 bg-gray-100 rounded-lg animate-pulse" />
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} layout="vertical" barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE9" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={55} />
            <Tooltip />
            <Bar dataKey="Approved" fill="#E8590C" radius={[0, 4, 4, 0]} barSize={16} />
            <Bar dataKey="Pending" fill="#FCD9BC" radius={[0, 4, 4, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ApprovalBreakdown;