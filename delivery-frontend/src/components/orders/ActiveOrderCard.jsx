// delivery-frontend/src/components/orders/ActiveOrderCard.jsx
import { MapPin, Store, Phone, Package, Banknote } from "lucide-react";
import StageProgress from "./StageProgress";
import { NEXT_ACTION_LABEL } from "../../utils/deliveryStages";

// ActiveOrderCard component displays detailed information about an active order
const ActiveOrderCard = ({ order, onAdvance, actionLoading }) => {
  return (
    <div className="bg-cream-panel rounded-xl border border-primary/10 p-5 mb-4">
      <div className="mb-1">
        <p className="text-xs text-gray-500 mb-0.5 font-mono">
          #{order._id.slice(-6).toUpperCase()}
        </p>
        <p className="font-semibold text-gray-800">{order.vendor?.shopName || "Restaurant"}</p>
      </div>

      <StageProgress currentStage={order.deliveryStage} />

      <div className="space-y-2 mb-4">
        {order.vendor?.shopAddress && (
          <div className="flex items-start gap-2 text-sm text-gray-700">
            <Store size={16} className="mt-0.5 flex-shrink-0 text-primary" />
            <span>Pickup: {order.vendor.shopAddress}</span>
          </div>
        )}
        <div className="flex items-start gap-2 text-sm text-gray-700">
          <MapPin size={16} className="mt-0.5 flex-shrink-0 text-gray-500" />
          <span>
            Deliver to: {order.deliveryAddress?.address}, {order.deliveryAddress?.city}
          </span>
        </div>
        {order.deliveryAddress?.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Phone size={16} className="flex-shrink-0 text-gray-500" />
            <span>{order.deliveryAddress.phone}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Package size={16} className="flex-shrink-0 text-gray-500" />
          <span>
            {order.orderItems?.length} item{order.orderItems?.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-primary/10">
        <div className="flex items-center gap-1.5">
          <Banknote size={16} className="text-green-700" />
          <span className="font-bold text-green-700">Rs. {order.totalPrice?.toFixed(0)}</span>
        </div>
        <button
          onClick={() => onAdvance(order._id)}
          disabled={actionLoading}
          className="px-5 py-2 bg-secondary text-white text-sm font-semibold rounded-full
            hover:bg-secondary-light active:scale-95 transition-all duration-200
            disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {actionLoading ? "Please wait..." : NEXT_ACTION_LABEL[order.deliveryStage]}
        </button>
      </div>
    </div>
  );
};

export default ActiveOrderCard;