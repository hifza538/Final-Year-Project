import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, CheckCircle, XCircle, Ban, FileText } from "lucide-react";
import {
  getRiderById,
  approveRider,
  rejectRider,
  toggleRiderBlock,
} from "../services/deliveryService";
import ConfirmModal from "../components/common/ConfirmModal";

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between py-3 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-medium text-secondary">{value || "—"}</span>
  </div>
);

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

const RiderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rider, setRider] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // "approve" | "reject" | "block" | null

  const fetchRider = async () => {
    setIsLoading(true);
    try {
      const data = await getRiderById(id);
      setRider(data.rider);
    } catch (error) {
      toast.error("Failed to load rider details");
      navigate("/delivery-approvals");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRider();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const closeModal = () => setActiveModal(null);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await approveRider(id);
      toast.success("Rider approved");
      closeModal();
      fetchRider();
    } catch (error) {
      toast.error(error.response?.data?.message || "Approval failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (reason) => {
    setActionLoading(true);
    try {
      await rejectRider(id, reason);
      toast.success("Rider rejected");
      closeModal();
      fetchRider();
    } catch (error) {
      toast.error(error.response?.data?.message || "Rejection failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleBlock = async () => {
    setActionLoading(true);
    try {
      const data = await toggleRiderBlock(id);
      toast.success(data.message);
      closeModal();
      fetchRider();
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
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

  if (!rider) return null;

  const status = !rider.isActive ? "Blocked" : rider.isApproved ? "Approved" : "Pending";
  const isPending = !rider.isApproved && rider.isActive;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link
        to="/delivery-approvals"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-4"
      >
        <ArrowLeft size={16} />
        Back to Riders
      </Link>

      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold text-secondary">{rider.fullName}</h1>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              status === "Blocked"
                ? "bg-red-50 text-red-600"
                : status === "Pending"
                ? "bg-yellow-50 text-yellow-700"
                : "bg-green-50 text-green-700"
            }`}
          >
            {status}
          </span>
        </div>

        <DetailRow label="Email" value={rider.email} />
        <DetailRow label="Phone" value={rider.phone} />
        <DetailRow label="Vehicle Type" value={rider.vehicleType} />
        <DetailRow label="Vehicle Number" value={rider.vehicleNumber} />
        <DetailRow label="CNIC Number" value={rider.cnicNumber} />
        <DetailRow
          label="Registered On"
          value={rider.createdAt && new Date(rider.createdAt).toLocaleDateString()}
        />

        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-5 border-t border-gray-100">
          {isPending && (
            <>
              <button
                onClick={() => setActiveModal("approve")}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white
                  font-medium text-sm py-2.5 rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle size={16} />
                Approve Rider
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

          {rider.isApproved && (
            <button
              onClick={() => setActiveModal("block")}
              className={`flex-1 flex items-center justify-center gap-2 font-medium text-sm py-2.5
                rounded-lg transition-colors ${
                  rider.isActive
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "bg-green-50 text-green-700 hover:bg-green-100"
                }`}
            >
              <Ban size={16} />
              {rider.isActive ? "Block Rider" : "Unblock Rider"}
            </button>
          )}
        </div>
      </div>

      {/* Document verification */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4">
        <h2 className="text-sm font-semibold text-secondary mb-4">Verification Documents</h2>
        <div className="grid grid-cols-2 gap-4">
          <DocumentPreview label="CNIC Front" url={rider.cnicFront?.url} />
          <DocumentPreview label="CNIC Back" url={rider.cnicBack?.url} />
        </div>
      </div>

      {/* Activity log */}
      {(rider.approvedBy || rider.rejectedBy || rider.blockedBy) && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-secondary mb-4">Activity Log</h2>
          <div className="space-y-3 text-sm">
            {rider.approvedBy && (
              <p className="text-gray-600">
                Approved by <span className="font-medium text-secondary">{rider.approvedBy.fullName}</span>{" "}
                on {new Date(rider.approvedAt).toLocaleString()}
              </p>
            )}
            {rider.rejectedBy && (
              <div>
                <p className="text-gray-600">
                  Rejected by <span className="font-medium text-secondary">{rider.rejectedBy.fullName}</span>{" "}
                  on {new Date(rider.rejectedAt).toLocaleString()}
                </p>
                {rider.rejectionReason && (
                  <p className="text-gray-500 mt-1 bg-gray-50 rounded-lg p-2.5">
                    Reason: {rider.rejectionReason}
                  </p>
                )}
              </div>
            )}
            {rider.blockedBy && !rider.isActive && (
              <p className="text-gray-600">
                Blocked by <span className="font-medium text-secondary">{rider.blockedBy.fullName}</span>{" "}
                on {new Date(rider.blockedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={activeModal === "approve"}
        title="Approve this rider?"
        message={`${rider.fullName} will be able to start accepting deliveries immediately.`}
        confirmLabel="Approve"
        variant="primary"
        isLoading={actionLoading}
        onConfirm={handleApprove}
        onCancel={closeModal}
      />

      <ConfirmModal
        isOpen={activeModal === "reject"}
        title="Reject this rider?"
        message={`Please provide a reason. ${rider.fullName}'s account will be deactivated.`}
        confirmLabel="Reject"
        variant="danger"
        requireReason
        isLoading={actionLoading}
        onConfirm={handleReject}
        onCancel={closeModal}
      />

      <ConfirmModal
        isOpen={activeModal === "block"}
        title={rider.isActive ? "Block this rider?" : "Unblock this rider?"}
        message={
          rider.isActive
            ? `${rider.fullName} will lose access to their rider account immediately.`
            : `${rider.fullName} will regain access to their rider account.`
        }
        confirmLabel={rider.isActive ? "Block" : "Unblock"}
        variant={rider.isActive ? "danger" : "primary"}
        isLoading={actionLoading}
        onConfirm={handleToggleBlock}
        onCancel={closeModal}
      />
    </div>
  );
};

export default RiderDetails;