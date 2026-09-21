import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, CheckCircle, XCircle, FileText, AlertTriangle } from "lucide-react";
import {
  getVendorById,
  approveVendor,
  rejectVendor,
  warnVendor,
} from "../services/vendorService";
import ConfirmModal from "../components/common/ConfirmModal";
 
const DetailRow = ({ label, value }) => (
  <div className="flex justify-between py-3 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-medium text-secondary">{value || "—"}</span>
  </div>
);
 
// Component to display a document preview (CNIC front/back)
const DocumentPreview = ({ label, url }) => (
  <div>
    <p className="text-xs text-gray-500 mb-2">{label}</p>
    {url ? (
      <a href={url} target="_blank" rel="noopener noreferrer">
        <img
          src={url}
          alt={label}
          className="w-full h-36 object-cover rounded-lg border border-gray-100 hover:opacity-90 transition-opacity"
        />
      </a>
    ) : (
      <div className="w-full h-36 rounded-lg border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300">
        <FileText size={20} />
        <span className="text-xs mt-1">Not uploaded</span>
      </div>
    )}
  </div>
);
 
const VendorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // "approve" | "reject" | "warn" | null
 
  const fetchVendor = async () => {
    setIsLoading(true);
    try {
      const data = await getVendorById(id);
      setVendor(data.vendor);
      setStats(data.stats);
    } catch (error) {
      toast.error("Failed to load vendor details");
      navigate("/vendors");
    } finally {
      setIsLoading(false);
    }
  };
 
  useEffect(() => {
    fetchVendor();
  }, [id]);
 
  const closeModal = () => setActiveModal(null);
 
  const handleApprove = async () => {
    setActionLoading(true);
    try {
      const data = await approveVendor(id);
      if (data.emailSent === false) {
        toast("Vendor approved, but the email could not be sent", { icon: "⚠️" });
      } else {
        toast.success("Vendor approved and email sent");
      }
      closeModal();
      fetchVendor();
    } catch (error) {
      toast.error(error.response?.data?.message || "Approval failed");
    } finally {
      setActionLoading(false);
    }
  };
 
  const handleReject = async (reason) => {
    setActionLoading(true);
    try {
      const data = await rejectVendor(id, reason);
      if (data.emailSent === false) {
        toast("Vendor rejected, but the email could not be sent", { icon: "⚠️" });
      } else {
        toast.success("Vendor rejected and email sent");
      }
      closeModal();
      fetchVendor();
    } catch (error) {
      toast.error(error.response?.data?.message || "Rejection failed");
    } finally {
      setActionLoading(false);
    }
  };
 
  const handleWarn = async (note) => {
    setActionLoading(true);
    try {
      await warnVendor(id, note);
      toast.success("Warning email sent");
      closeModal();
      fetchVendor();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send warning");
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-3">
          <div className="h-6 w-40 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }
 
  if (!vendor) return null;
 
  const status = !vendor.isActive ? "Rejected" : vendor.isApproved ? "Approved" : "Pending";
  const isPending = !vendor.isApproved && vendor.isActive;
 
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link
        to="/vendors"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-4"
      >
        <ArrowLeft size={16} />
        Back to Vendors
      </Link>
 
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold text-secondary">{vendor.shopName}</h1>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              status === "Rejected"
                ? "bg-red-50 text-red-600"
                : status === "Pending"
                ? "bg-yellow-50 text-yellow-700"
                : "bg-green-50 text-green-700"
            }`}
          >
            {status}
          </span>
        </div>
 
        <DetailRow label="Owner Name" value={vendor.fullName} />
        <DetailRow label="Email" value={vendor.email} />
        <DetailRow label="Phone" value={vendor.phone} />
        <DetailRow label="City" value={vendor.city} />
        <DetailRow label="Cuisine" value={vendor.cuisine} />
        <DetailRow label="CNIC Number" value={vendor.cnicNumber} />
        <DetailRow
          label="Registered On"
          value={vendor.createdAt && new Date(vendor.createdAt).toLocaleDateString()}
        />
 
        {/* Action bar */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-5 border-t border-gray-100">
          {isPending && (
            <>
              <button
                onClick={() => setActiveModal("approve")}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white
                  font-medium text-sm py-2.5 rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle size={16} />
                Approve Vendor
              </button>
              <button
                onClick={() => setActiveModal("reject")}
                className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600
                  font-medium text-sm py-2.5 rounded-lg hover:bg-red-100 transition-colors"
              >
                <XCircle size={16} />
                Reject
              </button>
            </>
          )}

          {/* Approved vendors can be warned before any action is taken */}
          {vendor.isApproved && vendor.isActive && (
            <button
              onClick={() => setActiveModal("warn")}
              className="flex-1 flex items-center justify-center gap-2 bg-yellow-50 text-yellow-700
                font-medium text-sm py-2.5 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <AlertTriangle size={16} />
              Send Warning
            </button>
          )}

          {/* Already-approved accounts can still be rejected (reason required, email sent) */}
          {vendor.isApproved && vendor.isActive && (
            <button
              onClick={() => setActiveModal("reject")}
              className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600
                font-medium text-sm py-2.5 rounded-lg hover:bg-red-100 transition-colors"
            >
              <XCircle size={16} />
              Reject Vendor
            </button>
          )}

          {/* Rejected accounts can be approved again (reactivates the account, email sent) */}
          {!vendor.isActive && (
            <button
              onClick={() => setActiveModal("approve")}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white
                font-medium text-sm py-2.5 rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle size={16} />
              Approve Again
            </button>
          )}
        </div>
      </div>
 
      {/* Order performance - only vendor-caused cancellations count against the vendor */}
      {stats && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4">
          <h2 className="text-sm font-semibold text-secondary mb-4">
            Order Performance <span className="text-gray-400 font-normal">(last {stats.periodDays} days)</span>
          </h2>
          {stats.total === 0 ? (
            <p className="text-sm text-gray-500">No orders received in this period.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Total Orders</p>
                  <p className="text-lg font-bold text-secondary">{stats.total}</p>
                </div>
                <div className="rounded-lg bg-green-50 p-3">
                  <p className="text-xs text-green-700">Completed</p>
                  <p className="text-lg font-bold text-green-700">{stats.completed}</p>
                </div>
                <div className="rounded-lg bg-red-50 p-3">
                  <p className="text-xs text-red-600">Not accepted in time</p>
                  <p className="text-lg font-bold text-red-600">{stats.timedOut}</p>
                </div>
                <div className="rounded-lg bg-red-50 p-3">
                  <p className="text-xs text-red-600">Rejected by vendor</p>
                  <p className="text-lg font-bold text-red-600">{stats.rejectedByVendor}</p>
                </div>
                <div
                  className={`rounded-lg p-3 ${
                    !stats.enoughData
                      ? "bg-gray-50 text-gray-500"
                      : stats.cancellationRate >= 30
                      ? "bg-red-50 text-red-600"
                      : stats.cancellationRate >= 15
                      ? "bg-yellow-50 text-yellow-700"
                      : "bg-green-50 text-green-700"
                  }`}
                >
                  <p className="text-xs">Cancellation Rate</p>
                  <p className="text-lg font-bold">{stats.cancellationRate}%</p>
                </div>
              </div>

              {!stats.enoughData && (
                <p className="text-xs text-gray-400 mt-3">
                  Not enough orders yet to judge performance (needs at least {stats.minOrders}).
                </p>
              )}
              {stats.enoughData && stats.cancellationRate >= 30 && (
                <p className="text-xs text-red-600 mt-3">
                  High cancellation rate. Consider rejecting this vendor if the pattern continues.
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* Document verification */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4">
        <h2 className="text-sm font-semibold text-secondary mb-4">Verification Documents</h2>
        <div className="grid grid-cols-2 gap-4">
          <DocumentPreview label="CNIC Front" url={vendor.cnicFront?.url} />
          <DocumentPreview label="CNIC Back" url={vendor.cnicBack?.url} />
        </div>
      </div>
 
      {/* Activity log - only shows entries that actually happened */}
      {(vendor.approvedBy || vendor.rejectedBy || vendor.warnings?.length > 0) && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-secondary mb-4">Activity Log</h2>
          <div className="space-y-3 text-sm">
            {vendor.approvedBy && (
              <p className="text-gray-600">
                Approved by <span className="font-medium text-secondary">{vendor.approvedBy.fullName}</span>{" "}
                on {new Date(vendor.approvedAt).toLocaleString()}
              </p>
            )}
            {vendor.rejectedBy && (
              <div>
                <p className="text-gray-600">
                  Rejected by <span className="font-medium text-secondary">{vendor.rejectedBy.fullName}</span>{" "}
                  on {new Date(vendor.rejectedAt).toLocaleString()}
                </p>
                {vendor.rejectionReason && (
                  <p className="text-gray-500 mt-1 bg-gray-50 rounded-lg p-2.5">
                    Reason: {vendor.rejectionReason}
                  </p>
                )}
              </div>
            )}
            {vendor.warnings?.map((w, i) => (
              <div key={i}>
                <p className="text-gray-600">
                  Warning sent by <span className="font-medium text-secondary">{w.sentBy?.fullName || "Admin"}</span>{" "}
                  on {new Date(w.sentAt).toLocaleString()}{" "}
                  <span className="text-gray-400">(cancellation rate: {w.cancellationRate}%)</span>
                </p>
                {w.message && (
                  <p className="text-gray-500 mt-1 bg-gray-50 rounded-lg p-2.5">Note: {w.message}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
 
      {/* Modals */}
      <ConfirmModal
        isOpen={activeModal === "approve"}
        title="Approve this vendor?"
        message={
          vendor.isActive
            ? `${vendor.shopName} will be approved and an email will be sent to the owner.`
            : `${vendor.shopName}'s account will be reactivated and approved. An email will be sent to the owner.`
        }
        confirmLabel="Approve"
        variant="primary"
        isLoading={actionLoading}
        onConfirm={handleApprove}
        onCancel={closeModal}
      />
 
      <ConfirmModal
        isOpen={activeModal === "reject"}
        title="Reject this vendor?"
        message={
          vendor.isApproved
            ? `${vendor.shopName} will lose access to their account immediately. Please provide a reason, it will be emailed.`
            : `Please provide a reason, it will be emailed to the applicant. ${vendor.shopName}'s account will be deactivated.`
        }
        confirmLabel="Reject"
        variant="danger"
        requireReason
        isLoading={actionLoading}
        onConfirm={handleReject}
        onCancel={closeModal}
      />

      <ConfirmModal
        isOpen={activeModal === "warn"}
        title="Send a warning to this vendor?"
        message={`An email with ${vendor.shopName}'s recent order performance will be sent to the owner. Write a short note for them.`}
        confirmLabel="Send Warning"
        variant="primary"
        requireReason
        isLoading={actionLoading}
        onConfirm={handleWarn}
        onCancel={closeModal}
      />
    </div>
  );
};
 
export default VendorDetails;