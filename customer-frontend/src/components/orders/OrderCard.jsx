// customer-frontend/src/components/orders/OrderCard.jsx

import { Link } from "react-router-dom";
import { UtensilsCrossed, ChevronRight, Star } from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";

// Formats an ISO date string into a more readable format (e.g., "12 Jan, 3:45 PM")
const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const OrderCard = ({ order, onWriteReview }) => {
  const itemsSummary = order.orderItems
    .map((item) => `${item.name} × ${item.qty}`)
    .join(", ");
    const canReview = order.orderStatus === "Completed" && !order.hasReview;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow duration-200">
    <Link
      to={`/order-confirmation/${order._id}`}
      className="block">
      <div className="flex items-start gap-3">
        {/* Vendor logo */}
        <div className="w-12 h-12 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
          {order.vendor?.logo?.url ? (
            <img src={order.vendor.logo.url} alt={order.vendor.shopName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary-light">
              <UtensilsCrossed size={18} className="text-primary/40" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold text-gray-900 truncate">
              {order.vendor?.shopName || "Restaurant"}
            </h4>
            <OrderStatusBadge status={order.orderStatus} />
          </div>
          <p className="text-sm text-gray-500 mt-1 truncate">{itemsSummary}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span>
            <span className="font-semibold text-gray-900 text-sm">Rs. {order.totalPrice}</span>
          </div>
        </div>

        <ChevronRight size={18} className="text-gray-300 shrink-0 mt-1" />
      </div>
    </Link>
    
    {canReview && (
        <button
          onClick={() => onWriteReview(order)}
          className="w-full mt-3 pt-3 border-t border-gray-100 flex items-center justify-center gap-1.5
                     text-sm font-medium text-primary hover:text-primary-dark transition-colors duration-200"
        >
          <Star size={14} />
          Write a Review
        </button>
        )}
      {order.orderStatus === "Completed" && order.hasReview && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-center gap-1.5 text-sm text-gray-400">
          <Star size={14} className="fill-gray-300 text-gray-300" />
          Reviewed
        </div>
      )}
    </div>
  );
};

export default OrderCard;