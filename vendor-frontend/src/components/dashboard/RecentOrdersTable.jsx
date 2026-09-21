// vendor-frontend/src/components/dashboard/RecentOrdersTable.jsx
 
// badge colors for each order status
const statusStyles = {
  Pending: "bg-yellow-50 text-yellow-700",
  Accepted: "bg-blue-50 text-blue-700",
  Preparing: "bg-purple-50 text-purple-700",
  Ready: "bg-indigo-50 text-indigo-700",
  OutForDelivery: "bg-orange-50 text-orange-700",
  Completed: "bg-green-50 text-green-700",
  Rejected: "bg-red-50 text-red-600",
};
 
const RecentOrdersTable = ({ orders, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm animate-pulse space-y-3">
        <div className="h-4 w-32 bg-gray-200 rounded" />
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 rounded" />
        ))}
      </div>
    );
  }
 
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <p className="text-sm font-semibold text-gray-700 mb-1">Recent Orders</p>
        <p className="text-xs text-gray-400">No orders yet.</p>
      </div>
    );
  }
 
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700">Recent Orders</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs">
            <tr>
              <th className="px-5 py-3 font-medium">Order</th>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t border-gray-100">
                <td className="px-5 py-3 font-medium text-gray-900">
                  #{order._id.slice(-6)}
                </td>
                <td className="px-5 py-3 text-gray-600">
                  {order.customer?.fullName || "—"}
                </td>
                <td className="px-5 py-3 text-gray-600">Rs {order.totalPrice}</td>
                <td className="px-5 py-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      statusStyles[order.orderStatus] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
 
export default RecentOrdersTable;