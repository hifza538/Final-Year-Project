// vendor-frontend/src/components/orders/OrderCard.jsx

import { useState } from "react";
import {
  ShoppingBag, Clock, CheckCircle2, XCircle,
  ChevronDown, Phone, Mail, MapPin,
  UtensilsCrossed, Loader2,
} from "lucide-react";
import { STATUS_CONFIG, STATUS_ACTIONS, ACTION_LABELS, ACTION_COLORS } from "./orderConstants";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString("en-PK", {
    day:    "2-digit",
    month:  "short",
    year:   "numeric",
    hour:   "2-digit",
    minute: "2-digit",
  });
};

const OrderCard = ({ order, onUpdateStatus, updating }) => {
  const [expanded, setExpanded] = useState(false);
  const config  = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.Pending;
  const actions = STATUS_ACTIONS[order.orderStatus] || [];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm 
      hover:shadow-md transition-shadow overflow-hidden">

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-bold text-gray-900 text-sm">
              Order #{order._id.slice(-6).toUpperCase()}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full 
            ${config.color}`}>
            {config.label}
          </span>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <ShoppingBag size={12} className="text-gray-400" />
            <span className="font-medium">
              {order.customer?.fullName || "Unknown Customer"}
            </span>
          </div>
          {order.customer?.phone && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Phone size={12} className="text-gray-400" />
              {order.customer.phone}
            </div>
          )}
          {order.customer?.email && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Mail size={12} className="text-gray-400" />
              {order.customer.email}
            </div>
          )}
          {order.deliveryAddress?.address && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin size={12} className="text-gray-400" />
              {order.deliveryAddress.address}, {order.deliveryAddress.city}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-gray-500">
            {order.orderItems?.length} item
            {order.orderItems?.length !== 1 ? "s" : ""}
          </p>
          <p className="font-bold text-gray-900">
            Rs {order.totalPrice?.toLocaleString()}
          </p>
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-center gap-1 
            text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
        >
          {expanded ? "Hide" : "View"} order items
          <ChevronDown
            size={12}
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>

        {expanded && (
          <div className="mt-3 border-t border-gray-100 pt-3 space-y-2">
            {order.orderItems?.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed size={12} className="text-gray-400" />
                  <span className="text-xs text-gray-700">{item.name}</span>
                  <span className="text-xs text-gray-400">x{item.qty}</span>
                </div>
                <span className="text-xs font-medium text-gray-700">
                  Rs {(item.price * item.qty).toLocaleString()}
                </span>
              </div>
            ))}

            <div className="border-t border-gray-100 pt-2 mt-2 space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Items Total</span>
                <span>Rs {order.itemsPrice?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Delivery Fee</span>
                <span>Rs {order.deliveryFee?.toLocaleString()}</span>
              </div>
              {order.deliveryAddress?.notes && (
                <div className="bg-amber-50 rounded p-2 mt-2">
                  <p className="text-xs text-amber-700">
                    <span className="font-medium">Note: </span>
                    {order.deliveryAddress.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {actions.length > 0 && (
        <div className={`px-5 pb-5 flex gap-2 
          ${actions.length > 1 ? "flex-row" : ""}`}>
          {actions.map((action) => (
            <button
              key={action}
              onClick={() => onUpdateStatus(order._id, action)}
              disabled={updating === order._id}
              className={`flex-1 flex items-center justify-center gap-2 
                py-2.5 rounded-lg text-sm font-semibold transition-colors
                disabled:opacity-50 ${ACTION_COLORS[action]}`}
            >
              {updating === order._id ? (
                <Loader2 size={14} className="animate-spin" />
              ) : action === "Accepted" ? (
                <CheckCircle2 size={14} />
              ) : action === "Rejected" ? (
                <XCircle size={14} />
              ) : (
                <Clock size={14} />
              )}
              {ACTION_LABELS[action]}
            </button>
          ))}
        </div>
      )}

      {actions.length === 0 && (
        <div className="px-5 pb-5">
          <div className={`w-full py-2.5 rounded-lg text-sm font-medium 
            text-center ${config.color}`}>
            {order.orderStatus === "Completed"
              ? "✓ Order Completed"
              : "✗ Order Rejected"
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;