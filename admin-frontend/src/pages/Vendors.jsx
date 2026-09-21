//admin-frontend/src/pages/Vendors.jsx
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Search, CheckCircle, Eye, Calendar, AlertTriangle } from "lucide-react";
import { getAllVendors, approveVendor } from "../services/vendorService";
import ConfirmModal from "../components/common/ConfirmModal";

const statusFilters = [
  { value: "all", label: "Status: All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "atrisk", label: "At Risk" },
];

// Badge component to display vendor status with color coding
const StatusBadge = ({ vendor }) => {
  if (!vendor.isActive) {
    return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">Rejected</span>;
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
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [actionInProgress, setActionInProgress] = useState(null);
  const [modalVendor, setModalVendor] = useState(null); // { id, shopName }

  const fetchVendors = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (status !== "all") params.status = status;
      if (search.trim()) params.search = search.trim();
      if (dateFrom) params.from = dateFrom;
      if (dateTo) params.to = dateTo;

      const data = await getAllVendors(params);
      setVendors(data.vendors);
    } catch (error) {
      toast.error("Failed to load vendors");
    } finally {
      setIsLoading(false);
    }
  }, [status, search, dateFrom, dateTo]);

  // Debounce search so we don't fire a request on every keystroke
  useEffect(() => {
    const timer = setTimeout(fetchVendors, 400);
    return () => clearTimeout(timer);
  }, [fetchVendors]);

  const closeModal = () => setModalVendor(null);

  const confirmApprove = async () => {
    setActionInProgress(modalVendor.id);
    try {
      const data = await approveVendor(modalVendor.id);
      if (data.emailSent === false) {
        toast("Vendor approved, but the email could not be sent", { icon: "⚠️" });
      } else {
        toast.success("Vendor approved and email sent");
      }
      closeModal();
      fetchVendors();
    } catch (error) {
      toast.error(error.response?.data?.message || "Approval failed");
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-secondary mb-6">Vendors</h1>

      {/* Search + filter bar */}
      <div className="flex flex-col lg:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by shop name, owner, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm
              outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Status dropdown */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700
            outline-none focus:border-primary transition-colors"
        >
          {statusFilters.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        {/* Registration date range */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm">
          <Calendar size={16} className="text-gray-400 shrink-0" />
          <input
            type="date"
            value={dateFrom}
            max={dateTo || undefined}
            onChange={(e) => setDateFrom(e.target.value)}
            className="outline-none bg-transparent text-gray-600"
            aria-label="From date"
          />
          <span className="text-gray-300">–</span>
          <input
            type="date"
            value={dateTo}
            min={dateFrom || undefined}
            onChange={(e) => setDateTo(e.target.value)}
            className="outline-none bg-transparent text-gray-600"
            aria-label="To date"
          />
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
                <th className="px-4 py-3">Registered</th>
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
                  <td className="px-4 py-3 text-gray-500">
                    {vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString("en-GB") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <StatusBadge vendor={vendor} />
                      {vendor.performance?.atRisk && (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700"
                          title={`${vendor.performance.cancellationRate}% of ${vendor.performance.total} orders in the last ${vendor.performance.periodDays} days were not accepted in time or were rejected by the vendor`}
                        >
                          <AlertTriangle size={12} />
                          At Risk · {vendor.performance.cancellationRate}%
                        </span>
                      )}
                    </div>
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

                      {/* Quick approve */}
                      {!vendor.isApproved && vendor.isActive && (
                        <button
                          onClick={() => setModalVendor({ id: vendor._id, shopName: vendor.shopName })}
                          disabled={actionInProgress === vendor._id}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                          aria-label="Approve"
                        >
                          <CheckCircle size={18} />
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

      {modalVendor && (
        <ConfirmModal
          isOpen
          title="Approve this vendor?"
          message={`${modalVendor.shopName} will be approved and an email will be sent to the owner.`}
          confirmLabel="Approve"
          variant="primary"
          isLoading={actionInProgress === modalVendor.id}
          onConfirm={confirmApprove}
          onCancel={closeModal}
        />
      )}
    </div>
  );
};

export default Vendors;