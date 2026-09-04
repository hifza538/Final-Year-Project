import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Search, CheckCircle, Ban, Eye } from "lucide-react";
import { getAllRiders, approveRider, toggleRiderBlock } from "../services/deliveryService";
import ConfirmModal from "../components/common/ConfirmModal";

// Status filters for the delivery riders page
const statusFilters = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "blocked", label: "Blocked" },
];

const StatusBadge = ({ rider }) => {
  if (!rider.isActive) {
    return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">Blocked</span>;
  }
  if (!rider.isApproved) {
    return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">Pending</span>;
  }
  return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">Approved</span>;
};

// DeliveryRiders component for managing delivery riders
const DeliveryRiders = () => {
  const [riders, setRiders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [actionInProgress, setActionInProgress] = useState(null);
  const [modalRider, setModalRider] = useState(null); // { id, fullName, action: "approve" | "block" }

  const fetchRiders = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (status !== "all") params.status = status;
      if (search.trim()) params.search = search.trim();

      const data = await getAllRiders(params);
      setRiders(data.riders);
    } catch (error) {
      toast.error("Failed to load riders");
    } finally {
      setIsLoading(false);
    }
  }, [status, search]);

  useEffect(() => {
    const timer = setTimeout(fetchRiders, 400);
    return () => clearTimeout(timer);
  }, [fetchRiders]);

  const closeModal = () => setModalRider(null);

  const confirmApprove = async () => {
    setActionInProgress(modalRider.id);
    try {
      await approveRider(modalRider.id);
      toast.success("Rider approved");
      closeModal();
      fetchRiders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Approval failed");
    } finally {
      setActionInProgress(null);
    }
  };

  const confirmToggleBlock = async () => {
    setActionInProgress(modalRider.id);
    try {
      const data = await toggleRiderBlock(modalRider.id);
      toast.success(data.message);
      closeModal();
      fetchRiders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-secondary mb-6">Delivery Riders</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or vehicle number..."
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
      ) : riders.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No riders found</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {riders.map((rider) => (
                <tr key={rider._id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium">{rider.fullName}</td>
                  <td className="px-4 py-3">{rider.email}</td>
                  <td className="px-4 py-3">{rider.phone}</td>
                  <td className="px-4 py-3">
                    {rider.vehicleType || "—"} {rider.vehicleNumber && `· ${rider.vehicleNumber}`}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge rider={rider} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/delivery-approvals/${rider._id}`}
                        className="p-1.5 text-gray-500 hover:bg-gray-50 rounded-lg"
                        aria-label="View details"
                      >
                        <Eye size={18} />
                      </Link>

                      {!rider.isApproved && rider.isActive && (
                        <button
                          onClick={() =>
                            setModalRider({ id: rider._id, fullName: rider.fullName, action: "approve" })
                          }
                          disabled={actionInProgress === rider._id}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                          aria-label="Approve"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}

                      {rider.isApproved && (
                        <button
                          onClick={() =>
                            setModalRider({ id: rider._id, fullName: rider.fullName, action: "block" })
                          }
                          disabled={actionInProgress === rider._id}
                          className={`p-1.5 rounded-lg disabled:opacity-50 ${
                            rider.isActive
                              ? "text-red-600 hover:bg-red-50"
                              : "text-green-600 hover:bg-green-50"
                          }`}
                          aria-label={rider.isActive ? "Block" : "Unblock"}
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

      {modalRider?.action === "approve" && (
        <ConfirmModal
          isOpen
          title="Approve this rider?"
          message={`${modalRider.fullName} will be able to start accepting deliveries immediately.`}
          confirmLabel="Approve"
          variant="primary"
          isLoading={actionInProgress === modalRider.id}
          onConfirm={confirmApprove}
          onCancel={closeModal}
        />
      )}

      {modalRider?.action === "block" && (
        <ConfirmModal
          isOpen
          title="Are you sure?"
          message={`This will change ${modalRider.fullName}'s access to their account.`}
          confirmLabel="Confirm"
          variant="danger"
          isLoading={actionInProgress === modalRider.id}
          onConfirm={confirmToggleBlock}
          onCancel={closeModal}
        />
      )}
    </div>
  );
};

export default DeliveryRiders;