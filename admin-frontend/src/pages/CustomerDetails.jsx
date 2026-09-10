//admin-frontend/src/pages/CustomerDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Ban, ShoppingBag } from "lucide-react";
import { getCustomerById, toggleCustomerBlock } from "../services/customerService";
import ConfirmModal from "../components/common/ConfirmModal";

// DetailRow component for displaying label-value pairs
const DetailRow = ({ label, value }) => (
  <div className="flex justify-between py-3 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-medium text-secondary">{value || "—"}</span>
  </div>
);

const statusStyles = {
  Pending: "bg-yellow-50 text-yellow-700",
  Accepted: "bg-blue-50 text-blue-700",
  Preparing: "bg-blue-50 text-blue-700",
  Ready: "bg-blue-50 text-blue-700",
  OutForDelivery: "bg-purple-50 text-purple-700",
  Completed: "bg-green-50 text-green-700",
  Rejected: "bg-red-50 text-red-600",
};

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersFeatureReady, setOrdersFeatureReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);

  // Function to fetch customer details and their orders
  const fetchCustomer = async () => {
    setIsLoading(true);
    try {
      const data = await getCustomerById(id);
      setCustomer(data.customer);
      setOrders(data.orders);
      setOrdersFeatureReady(data.ordersFeatureReady);
    } catch (error) {
      toast.error("Failed to load customer details");
      navigate("/customers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleToggleBlock = async () => {
    setActionLoading(true);
    try {
      const data = await toggleCustomerBlock(id);
      toast.success(data.message);
      setShowBlockModal(false);
      fetchCustomer();
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-3">
          <div className="h-6 w-40 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!customer) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link
        to="/customers"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-4"
      >
        <ArrowLeft size={16} />
        Back to Customers
      </Link>

      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold text-secondary">{customer.fullName}</h1>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              customer.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
            }`}
          >
            {customer.isActive ? "Active" : "Blocked"}
          </span>
        </div>

        <DetailRow label="Email" value={customer.email} />
        <DetailRow label="Phone" value={customer.phone} />
        <DetailRow
          label="Joined On"
          value={customer.createdAt && new Date(customer.createdAt).toLocaleDateString()}
        />
        {!customer.isActive && customer.blockedBy && (
          <DetailRow
            label="Blocked By"
            value={`${customer.blockedBy.fullName} on ${new Date(customer.blockedAt).toLocaleDateString()}`}
          />
        )}

        <div className="mt-6 pt-5 border-t border-gray-100">
          <button
            onClick={() => setShowBlockModal(true)}
            className={`w-full flex items-center justify-center gap-2 font-medium text-sm py-2.5
              rounded-lg transition-colors ${
                customer.isActive
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-green-50 text-green-700 hover:bg-green-100"
              }`}
          >
            <Ban size={16} />
            {customer.isActive ? "Block Customer" : "Unblock Customer"}
          </button>
        </div>
      </div>

      {/* Order history */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <ShoppingBag size={16} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-secondary">Order History</h2>
        </div>

        {!ordersFeatureReady ? (
          <div className="py-10 text-center">
            <p className="text-sm text-gray-400">Order history isn't available yet</p>
            <p className="text-xs text-gray-300 mt-1">Populates once the Orders feature is live</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-gray-400">This customer hasn't placed any orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3">Order ID</th>
                  <th className="px-5 py-3">Vendor</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t border-gray-100">
                    <td className="px-5 py-3 font-medium">#{order._id.slice(-6)}</td>
                    <td className="px-5 py-3">{order.vendor?.shopName || "—"}</td>
                    <td className="px-5 py-3">Rs {order.totalPrice}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          statusStyles[order.orderstatus] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.orderstatus}
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

      <ConfirmModal
        isOpen={showBlockModal}
        title={customer.isActive ? "Block this customer?" : "Unblock this customer?"}
        message={
          customer.isActive
            ? `${customer.fullName} will lose access to their account immediately.`
            : `${customer.fullName} will regain access to their account.`
        }
        confirmLabel={customer.isActive ? "Block" : "Unblock"}
        variant={customer.isActive ? "danger" : "primary"}
        isLoading={actionLoading}
        onConfirm={handleToggleBlock}
        onCancel={() => setShowBlockModal(false)}
      />
    </div>
  );
};

export default CustomerDetails;