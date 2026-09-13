// delivery-frontend/src/components/orders/HistoryCard.jsx
import { useState } from "react";
import { MapPin, Phone, Package, Banknote, ChevronDown } from "lucide-react";
import RestaurantAvatar from "./RestaurantAvatar";

const formatTime = (dateStr) =>
  new Date(dateStr).toLocaleString("en-PK", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });


const HistoryCard = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border-2 border-primary/90 shadow-sm mb-4 overflow-hidden">
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full text-left p-5"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <RestaurantAvatar name={order.vendor?.shopName} />
            <div>
              <p className="font-semibold text-gray-800 leading-tight">
                {order.vendor?.shopName || "Restaurant"}
              </p>
              <p className="text-xs text-gray-400 font-mono">
                #{order._id.slice(-6).toUpperCase()}
              </p>
            </div>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700 flex-shrink-0">
            Completed
          </span>
        </div>

        <div className="space-y-1.5 mb-3">
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin size={15} className="mt-0.5 flex-shrink-0 text-gray-400" />
            <span className="line-clamp-1">
              {order.deliveryAddress?.address}, {order.deliveryAddress?.city}
            </span>
          </div>
          {order.deliveryAddress?.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone size={15} className="flex-shrink-0 text-gray-400" />
              <span>{order.deliveryAddress.phone}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <Banknote size={16} className="text-green-700" />
            <span className="font-bold text-green-700">Rs. {order.totalPrice?.toFixed(0)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Package size={15} />
            <span>{order.orderItems?.length} item{order.orderItems?.length !== 1 ? "s" : ""}</span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
            />
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="px-5 pb-5 pt-1 border-t border-gray-100 bg-gray-50/50">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-3 mb-2">
            Order Items
          </p>
          <div className="space-y-1.5 mb-4">
            {order.orderItems?.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm text-gray-700">
                <span>{item.name} × {item.qty}</span>
                <span>Rs. {(item.price * item.qty).toFixed(0)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-xs text-gray-500">
            <span>Accepted: {formatTime(order.createdAt)}</span>
            <span>Delivered: {formatTime(order.updatedAt)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryCard;