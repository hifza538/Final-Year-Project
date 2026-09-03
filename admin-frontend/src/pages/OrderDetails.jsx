import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Ban } from "lucide-react";
import { getOrderById, cancelOrder } from "../services/orderService";
import ConfirmModal from "../components/common/ConfirmModal";

const statusStyles = {
  Pending: "bg-yellow-50 text-yellow-700",
  Accepted: "bg-blue-50 text-blue-700",
  Preparing: "bg-blue-50 text-blue-700",
  Ready: "bg-blue-50 text-blue-700",
  OutForDelivery: "bg-purple-50 text-purple-700",
  Completed: "bg-green-50 text-green-700",
  Rejected: "bg-red-50 text-red-600",
};

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between py-2.5 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-medium text-secondary">{value || "—"}</span>
  </div>
);

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const fetchOrder = async () => {
    setIsLoading(true);
    try {
      const data = await getOrderById(id);
      setOrder(data.order);
    } catch (error) {
      toast.error("Failed to load order details");
      navigate("/orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      await cancelOrder(id);
      toast.success("Order cancelled");
      setShowCancelModal(false);
      fetchOrder();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel order");
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

  if (!order) return null;

  const canCancel = !["Completed", "Rejected"].includes(order.orderStatus);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link
        to="/orders"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-4"
      >
        <ArrowLeft size={16} />
        Back to Orders
      </Link>

      {/* Order summary */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold text-secondary">
            Order #{order._id.slice(-6)}
          </h1>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              statusStyles[order.orderStatus] || "bg-gray-100 text-gray-600"
            }`}
          >
            {order.orderStatus}
          </span>
        </div>

        <DetailRow label="Placed On" value={new Date(order.createdAt).toLocaleString()} />
        <DetailRow label="Payment" value={order.isPaid ? "Paid" : "Not Paid"} />
        <DetailRow label="Delivered" value={order.isDelivered ? "Yes" : "Not yet"} />

        {canCancel && (
          <div className="mt-5 pt-5 border-t border-gray-100">
            <button
              onClick={() => setShowCancelModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600
                font-medium text-sm py-2.5 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Ban size={16} />
              Cancel Order
            </button>
          </div>
        )}
      </div>

      {/* Customer & Vendor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-secondary mb-3">Customer</h2>
          <DetailRow label="Name" value={order.customer?.fullName} />
          <DetailRow label="Email" value={order.customer?.email} />
          <DetailRow label="Phone" value={order.customer?.phone} />
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-secondary mb-3">Vendor</h2>
          <DetailRow label="Shop" value={order.vendor?.shopName} />
          <DetailRow label="Phone" value={order.vendor?.phone} />
          <DetailRow label="City" value={order.vendor?.city} />
        </div>
      </div>

      {/* Delivery rider (if assigned) */}
      {order.deliveryRider && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
          <h2 className="text-sm font-semibold text-secondary mb-3">Delivery Rider</h2>
          <DetailRow label="Name" value={order.deliveryRider?.fullName} />
          <DetailRow label="Phone" value={order.deliveryRider?.phone} />
          <DetailRow
            label="Vehicle"
            value={
              order.deliveryRider?.vehicleType &&
              `${order.deliveryRider.vehicleType} · ${order.deliveryRider.vehicleNumber || ""}`
            }
          />
        </div>
      )}

      {/* Delivery address */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
        <h2 className="text-sm font-semibold text-secondary mb-3">Delivery Address</h2>
        <DetailRow label="Name" value={order.deliveryAddress?.fullName} />
        <DetailRow label="Phone" value={order.deliveryAddress?.phone} />
        <DetailRow label="Address" value={order.deliveryAddress?.address} />
        <DetailRow label="City" value={order.deliveryAddress?.city} />
        {order.deliveryAddress?.notes && (
          <DetailRow label="Notes" value={order.deliveryAddress.notes} />
        )}
      </div>

      {/* Order items */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-4">
        <h2 className="text-sm font-semibold text-secondary px-5 py-4 border-b border-gray-100">
          Items
        </h2>
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-5 py-2.5">Item</th>
              <th className="px-5 py-2.5">Qty</th>
              <th className="px-5 py-2.5 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems.map((item, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="px-5 py-2.5">{item.name}</td>
                <td className="px-5 py-2.5">{item.qty}</td>
                <td className="px-5 py-2.5 text-right">Rs {item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Price breakdown */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-secondary mb-3">Price Breakdown</h2>
        <DetailRow label="Items Total" value={`Rs ${order.itemsPrice}`} />
        <DetailRow label="Delivery Fee" value={`Rs ${order.deliveryFee}`} />
        <DetailRow label="Tax" value={`Rs ${order.taxPrice}`} />
        <div className="flex justify-between pt-3 mt-1 border-t border-gray-100">
          <span className="text-sm font-semibold text-secondary">Total</span>
          <span className="text-sm font-bold text-primary">Rs {order.totalPrice}</span>
        </div>
      </div>

      <ConfirmModal
        isOpen={showCancelModal}
        title="Cancel this order?"
        message={`This will mark order #${order._id.slice(-6)} as rejected. This can't be undone.`}
        confirmLabel="Cancel Order"
        variant="danger"
        isLoading={actionLoading}
        onConfirm={handleCancel}
        onCancel={() => setShowCancelModal(false)}
      />
    </div>
  );
};

export default OrderDetails;