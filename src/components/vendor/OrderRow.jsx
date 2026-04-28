import React from "react";
import { Clock, Check, X } from "lucide-react";

const OrderRow = ({
  order,
  statusStyles,
  variant = "overview", // "overview" | "orders"
  onAccept,
  onReject,
  onStatusChange,
}) => {
  const containerClass =
    variant === "orders"
      ? "rounded-2xl border border-gray-200 bg-white shadow-sm px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      : "px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between";

  return (
    <div className={containerClass}>
      <div>
        <div className="flex items-center gap-3">
          <p className="font-semibold text-gray-900">Order #{order.id}</p>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[order.status]}`}>
            {order.status}
          </span>
        </div>

        <p className="text-sm text-gray-600 mt-1">
          <span className="font-semibold">Customer:</span> {order.customer}
        </p>

        <p className="text-sm text-gray-600">
          <span className="font-semibold">Items:</span> {order.items}
        </p>

        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
          <Clock size={14} />
          <span>{order.timeAgo}</span>
          <span className="ml-3 font-semibold text-gray-900">{order.total}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 self-start md:self-auto">
        {order.status === "Pending" ? (
          <>
            <button
              onClick={() => onAccept(order.id)}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium"
            >
              <Check size={16} className="mr-1" />
              Accept
            </button>

            <button
              onClick={() => onReject(order.id)}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium"
            >
              <X size={16} className="mr-1" />
              Reject
            </button>
          </>
        ) : (
          <>
            <select
              value={order.status}
              onChange={(e) => onStatusChange(order.id, e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Accepted">Accepted</option>
              <option value="Preparing">Preparing</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>

            <button className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium">
              Update
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderRow;