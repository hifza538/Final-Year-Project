import React from "react";
import OrderRow from "./OrderRow";

const OrdersList = ({
  orders,
  statusStyles,
  variant = "overview", // "overview" | "orders"
  onAccept,
  onReject,
  onStatusChange,
}) => {
  if (variant === "overview") {
    return (
      <div className="divide-y">
        {orders.map((order) => (
          <OrderRow
            key={order.id}
            order={order}
            statusStyles={statusStyles}
            variant="overview"
            onAccept={onAccept}
            onReject={onReject}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderRow
          key={order.id}
          order={order}
          statusStyles={statusStyles}
          variant="orders"
          onAccept={onAccept}
          onReject={onReject}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

export default OrdersList;