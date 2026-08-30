// vendor-frontend/src/components/orders/orderConstants.js

export const STATUS_FILTERS = [
  "All", "Pending", "Accepted", "Preparing",
  "Ready", "OutForDelivery", "Completed", "Rejected",
];

export const STATUS_CONFIG = {
  Pending:        { color: "bg-amber-100 text-amber-700",  label: "Pending"          },
  Accepted:       { color: "bg-blue-100 text-blue-700",    label: "Accepted"         },
  Preparing:      { color: "bg-purple-100 text-purple-700",label: "Preparing"        },
  Ready:          { color: "bg-indigo-100 text-indigo-700",label: "Ready"            },
  OutForDelivery: { color: "bg-orange-100 text-orange-700",label: "Out for Delivery" },
  Completed:      { color: "bg-green-100 text-green-700",  label: "Completed"        },
  Rejected:       { color: "bg-red-100 text-red-700",      label: "Rejected"         },
};

export const STATUS_ACTIONS = {
  Pending:        ["Accepted", "Rejected"],
  Accepted:       ["Preparing"],
  Preparing:      ["Ready"],
  Ready:          [],
  OutForDelivery: [],
  Completed:      [],
  Rejected:       [],
};

export const ACTION_LABELS = {
  Accepted:       "Accept Order",
  Rejected:       "Reject Order",
  Preparing:      "Start Preparing",
  Ready:          "Mark as Ready",
  OutForDelivery: "Out for Delivery",
  Completed:      "Mark Completed",
};

export const ACTION_COLORS = {
  Accepted:       "bg-green-500 hover:bg-green-600 text-white",
  Rejected:       "bg-red-500 hover:bg-red-600 text-white",
  Preparing:      "bg-purple-500 hover:bg-purple-600 text-white",
  Ready:          "bg-indigo-500 hover:bg-indigo-600 text-white",
  OutForDelivery: "bg-orange-500 hover:bg-orange-600 text-white",
  Completed:      "bg-green-500 hover:bg-green-600 text-white",
};