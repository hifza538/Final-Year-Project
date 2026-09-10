// delivery-frontend/src/components/orders/OrderCard.jsx
import { MapPin, Store, Phone, Package, Banknote } from "lucide-react";

const OrderCard = ({ order, actionLabel, onAction, actionLoading }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-gray-400 mb-0.5 font-mono">
            #{order._id.slice(-6).toUpperCase()}
          </p>
          <p className="font-semibold text-gray-800">
            {order.vendor?.shopName || "Restaurant"}
          </p>
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full
            ${order.orderStatus === "Ready" ? "bg-blue-50 text-blue-600" : ""}
            ${order.orderStatus === "OutForDelivery" ? "bg-primary-light text-primary-dark" : ""}
            ${order.orderStatus === "Completed" ? "bg-green-50 text-green-700" : ""}
          `}
        >
          {order.orderStatus}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {order.vendor?.shopAddress && (
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <Store size={16} className="mt-0.5 flex-shrink-0 text-primary" />
            <span>{order.vendor.shopAddress}</span>
          </div>
        )}
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <MapPin size={16} className="mt-0.5 flex-shrink-0 text-gray-400" />
          <span>
            {order.deliveryAddress?.address}, {order.deliveryAddress?.city}
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
        <div className="flex items-center gap-1.5">
          <Banknote size={16} className="text-green-700" />
          <span className="font-bold text-green-700">Rs. {order.totalPrice?.toFixed(0)}</span>
        </div>
        {actionLabel && (
          <button
            onClick={() => onAction(order._id)}
            disabled={actionLoading}
            className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-full
              hover:bg-primary-dark active:scale-95 transition-all duration-200
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