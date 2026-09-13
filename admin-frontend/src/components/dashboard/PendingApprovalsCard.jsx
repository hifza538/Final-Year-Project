// admin-frontend/src/components/dashboard/PendingApprovalsCard.jsx
import { Link } from "react-router-dom";
import { Store, Bike } from "lucide-react";
 
// Small summary card showing counts of vendors/riders awaiting approval, with quick links
const PendingApprovalsCard = ({ pendingVendors = 0, pendingRiders = 0 }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
    <h3 className="text-sm font-semibold text-secondary mb-4">Pending Approvals</h3>
    <div className="space-y-3">
      <Link
        to="/vendors"
        className="flex items-center justify-between p-3 rounded-lg border border-gray-100
          hover:border-primary hover:bg-primary-light transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Store size={16} className="text-primary" />
          <span className="text-sm text-secondary">Vendors</span>
        </div>
        <span className="text-sm font-bold text-secondary">{pendingVendors}</span>
      </Link>
      <Link
        to="/delivery-approvals"
        className="flex items-center justify-between p-3 rounded-lg border border-gray-100
          hover:border-primary hover:bg-primary-light transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Bike size={16} className="text-primary" />
          <span className="text-sm text-secondary">Riders</span>
        </div>
        <span className="text-sm font-bold text-secondary">{pendingRiders}</span>
      </Link>
    </div>
  </div>
);
 
export default PendingApprovalsCard;
 