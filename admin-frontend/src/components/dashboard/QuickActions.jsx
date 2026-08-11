// src/components/dashboard/QuickActions.jsx
import { Link } from "react-router-dom";
import { CheckCircle, Bike, Package, FolderPlus } from "lucide-react";

// Compact card showing quick action links for approving vendors/riders, viewing orders, and adding categories. Each action links to the appropriate page.
const actions = [
  { label: "Approve Vendors", icon: CheckCircle, to: "/vendors" },
  { label: "Approve Riders", icon: Bike, to: "/delivery-approvals" },
  { label: "View Orders", icon: Package, to: "/orders" },
  { label: "Add Category", icon: FolderPlus, to: "/categories" },
];

const QuickActions = () => (
  <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
    <h3 className="text-sm font-semibold text-secondary mb-4">Quick Actions</h3>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {actions.map(({ label, icon: Icon, to }) => (
        <Link
          key={label}
          to={to}
          className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-100
            hover:border-primary hover:bg-primary-light transition-colors text-center"
        >
          <Icon size={20} className="text-primary" />
          <span className="text-xs font-medium text-secondary">{label}</span>
        </Link>
      ))}
    </div>
  </div>
);

export default QuickActions;