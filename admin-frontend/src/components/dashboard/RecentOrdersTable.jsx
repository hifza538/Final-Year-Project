// src/components/dashboard/RecentOrdersTable.jsx
const statusStyles = {
  Pending: "bg-yellow-50 text-yellow-700",
  Accepted: "bg-blue-50 text-blue-700",
  Preparing: "bg-blue-50 text-blue-700",
  Ready: "bg-blue-50 text-blue-700",
  OutForDelivery: "bg-purple-50 text-purple-700",
  Completed: "bg-green-50 text-green-700",
  Rejected: "bg-red-50 text-red-600",
};

// RecentOrdersTable component for displaying a table of recent orders
const RecentOrdersTable = ({ orders = [] }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="px-5 py-4 border-b border-gray-100">
      <h3 className="text-sm font-semibold text-secondary">Recent Orders</h3>
    </div>

    {orders.length === 0 ? (
      <div className="py-14 text-center">
        <p className="text-sm text-gray-400">No orders yet</p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-5 py-3">Order ID</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Vendor</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-medium">#{order._id.slice(-6)}</td>
                <td className="px-5 py-3">{order.customer?.fullName || "—"}</td>
                <td className="px-5 py-3">{order.vendor?.shopName || "—"}</td>
                <td className="px-5 py-3">Rs {order.totalPrice}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[order.orderStatus] || "bg-gray-100 text-gray-600"}`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default RecentOrdersTable;