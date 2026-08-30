import { MapPin, Phone, Package } from "lucide-react";

// OrderCard component displays a summary of an order, including vendor info, delivery address, order items count, total price, and an optional action button (e.g., "Accept Order" or "Mark as Delivered").
// It is used in the rider's dashboard to show available orders or current orders.
const OrderCard = ({ order, actionLabel, onAction, actionLoading }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">
            Order #{order._id.slice(-6).toUpperCase()}
          </p>
          <p className="font-semibold text-gray-800">
            {order.vendor?.shopName || "Restaurant"}
          </p>
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full
            ${order.orderStatus === "Ready" ? "bg-blue-50 text-blue-600" : ""}
            ${order.orderStatus === "OutForDelivery" ? "bg-primary-light text-primary-dark" : ""}
            ${order.orderStatus === "Completed" ? "bg-green-50 text-green-600" : ""}
          `}
        >
          {order.orderStatus}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {order.vendor?.shopAddress && (
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <Store size={16} className="mt-0.5 flex-shrink-0 text-gray-400" />
            <span>Pickup: {order.vendor.shopAddress}</span>
          </div>
        )}
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <MapPin size={16} className="mt-0.5 flex-shrink-0 text-gray-400" />
          <span>
            Deliver to: {order.deliveryAddress?.address}, {order.deliveryAddress?.city}
          </span>
        </div>
        {order.deliveryAddress?.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone size={16} className="flex-shrink-0 text-gray-400" />
            <span>{order.deliveryAddress.phone}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Package size={16} className="flex-shrink-0 text-gray-400" />
          <span>
            {order.orderItems?.length} item{order.orderItems?.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="font-semibold text-gray-800">Rs. {order.totalPrice?.toFixed(0)}</span>
        {actionLabel && (
          <button
            onClick={() => onAction(order._id)}
            disabled={actionLoading}
            className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-full
              hover:bg-primary-dark transition-colors duration-200
              disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {actionLoading ? "Please wait..." : actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;