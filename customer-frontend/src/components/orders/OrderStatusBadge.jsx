// customer-frontend/src/components/orders/OrderStatusBadge.jsx

// Maps each order status to a color and label — used across My Orders and Order Confirmation
const STATUS_CONFIG = {
  Pending: { label: "Pending", className: "bg-yellow-50 text-yellow-700" },
  Accepted: { label: "Accepted", className: "bg-blue-50 text-blue-700" },
  Preparing: { label: "Preparing", className: "bg-blue-50 text-blue-700" },
  Ready: { label: "Ready", className: "bg-primary-light text-primary-dark" },
  OutForDelivery: { label: "Out for Delivery", className: "bg-primary-light text-primary-dark" },
  Completed: { label: "Delivered", className: "bg-green-50 text-green-700" },
  Rejected: { label: "Rejected", className: "bg-red-50 text-red-600" },
};

const OrderStatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || { label: status, className: "bg-gray-50 text-gray-600" };

  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${config.className}`}>
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;