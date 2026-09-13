// delivery-frontend/src/components/orders/ActiveOrderCard.jsx
import { MapPin, Store, Phone, Package, Banknote } from "lucide-react";
import StageProgress from "./StageProgress";
import RestaurantAvatar from "./RestaurantAvatar";
import { NEXT_ACTION_LABEL } from "../../utils/deliveryStages";

const ActiveOrderCard = ({ order, onAdvance, actionLoading, onViewMap }) => {
  return (
    <div className="bg-white rounded-xl border-2 border-primary/90 shadow-sm p-5 mb-4">
      <div className="flex items-center gap-3 mb-4">
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

      <StageProgress currentStage={order.deliveryStage} />

      <div className="space-y-2 mb-4">
        {order.vendor?.shopAddress && (
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <Store size={16} className="mt-0.5 flex-shrink-0 text-primary" />
            <span className="line-clamp-2">Pickup: {order.vendor.shopAddress}</span>
          </div>
        )}
        <div className="flex items-start gap-2 text-sm text-gray-600">
  <MapPin size={16} className="mt-0.5 flex-shrink-0 text-gray-500" />
  <button
    onClick={() => onViewMap(order)}
    className="text-left line-clamp-2 underline decoration-dotted decoration-gray-400
               hover:text-primary hover:decoration-primary transition-colors"
  >
    Deliver to: {order.deliveryAddress?.address}, {order.deliveryAddress?.city}
  </button>
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
        <button
          onClick={() => onAdvance(order._id)}
          disabled={actionLoading}
          className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-full
            hover:bg-primary-dark active:scale-95 transition-all duration-200
            disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {actionLoading ? "Please wait..." : NEXT_ACTION_LABEL[order.deliveryStage]}
        </button>
      </div>
    </div>
  );
};

export default ActiveOrderCard;
