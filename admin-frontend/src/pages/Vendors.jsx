//admin-frontend/src/pages/Vendors.jsx
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Search, CheckCircle, Ban, Eye } from "lucide-react";
import { getAllVendors, approveVendor, toggleVendorBlock } from "../services/vendorService";
import ConfirmModal from "../components/common/ConfirmModal";

const statusFilters = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "blocked", label: "Blocked" },
];

const StatusBadge = ({ vendor }) => {
  if (!vendor.isActive) {
    return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">Blocked</span>;
  }
  if (!vendor.isApproved) {
    return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">Pending</span>;
  }
  return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">Approved</span>;
};

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [actionInProgress, setActionInProgress] = useState(null);

  // Replaces window.confirm - holds which vendor + which action triggered the modal
  const [modalVendor, setModalVendor] = useState(null); // { id, shopName, action: "approve" | "block" }

  const fetchVendors = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (status !== "all") params.status = status;
      if (search.trim()) params.search = search.trim();

      const data = await getAllVendors(params);
      setVendors(data.vendors);
    } catch (error) {
      toast.error("Failed to load vendors");
    } finally {
      setIsLoading(false);
    }
  }, [status, search]);

  // Debounce search so we don't fire a request on every keystroke
  useEffect(() => {
    const timer = setTimeout(fetchVendors, 400);
    return () => clearTimeout(timer);
  }, [fetchVendors]);

  const closeModal = () => setModalVendor(null);

  const confirmApprove = async () => {
    setActionInProgress(modalVendor.id);
    try {
      await approveVendor(modalVendor.id);
      toast.success("Vendor approved");
      closeModal();
      fetchVendors();
    } catch (error) {
      toast.error(error.response?.data?.message || "Approval failed");
    } finally {
      setActionInProgress(null);
    }
  };

  const confirmToggleBlock = async () => {
    setActionInProgress(modalVendor.id);
    try {
      const data = await toggleVendorBlock(modalVendor.id);
      toast.success(data.message);
      closeModal();
      fetchVendors();
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-secondary mb-6">Vendors</h1>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by shop name, owner, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm
              outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                ${
                  status === f.value
                    ? "bg-primary text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-primary/40"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-200 rounded-lg" />
          ))}
        </div>
      ) : vendors.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No vendors found</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Shop Name</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor._id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium">{vendor.shopName}</td>
                  <td className="px-4 py-3">{vendor.fullName}</td>
                  <td className="px-4 py-3">{vendor.email}</td>
                  <td className="px-4 py-3">{vendor.city}</td>
                  <td className="px-4 py-3">
                    <StatusBadge vendor={vendor} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/vendors/${vendor._id}`}
                        className="p-1.5 text-gray-500 hover:bg-gray-50 rounded-lg"
                        aria-label="View details"
                      >
                        <Eye size={18} />
                      </Link>

                      {/* Approve stays here for quick action. Reject moved to the
                          details page only, since it needs a reason from the admin. */}
                      {!vendor.isApproved && vendor.isActive && (
                        <button
                          onClick={() =>
                            setModalVendor({ id: vendor._id, shopName: vendor.shopName, action: "approve" })
                          }
                          disabled={actionInProgress === vendor._id}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                          aria-label="Approve"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}

                      {vendor.isApproved && (
                        <button
                          onClick={() =>
                            setModalVendor({ id: vendor._id, shopName: vendor.shopName, action: "block" })
                          }
                          disabled={actionInProgress === vendor._id}
                          className={`p-1.5 rounded-lg disabled:opacity-50 ${
                            vendor.isActive
                              ? "text-red-600 hover:bg-red-50"
                              : "text-green-600 hover:bg-green-50"
                          }`}
                          aria-label={vendor.isActive ? "Block" : "Unblock"}
                        >
                          <Ban size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {modalVendor?.action === "approve" && (
        <ConfirmModal
          isOpen
          title="Approve this vendor?"
          message={`${modalVendor.shopName} will be able to start receiving orders immediately.`}
          confirmLabel="Approve"
          variant="primary"
          isLoading={actionInProgress === modalVendor.id}
          onConfirm={confirmApprove}
          onCancel={closeModal}
        />
      )}

      {modalVendor?.action === "block" && (
        <ConfirmModal
          isOpen
          title="Are you sure?"
          message={`This will change ${modalVendor.shopName}'s access to their account.`}
          confirmLabel="Confirm"
          variant="danger"
          isLoading={actionInProgress === modalVendor.id}
          onConfirm={confirmToggleBlock}
          onCancel={closeModal}
        />
      )}
    </div>
  );
};

export default Vendors;