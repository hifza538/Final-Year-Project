import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, CheckCircle, XCircle, Ban, FileText } from "lucide-react";
import {
  getVendorById,
  approveVendor,
  rejectVendor,
  toggleVendorBlock,
} from "../services/vendorService";
import ConfirmModal from "../components/common/ConfirmModal";

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between py-3 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-medium text-secondary">{value || "—"}</span>
  </div>
);

// Shows a document image if the URL exists, otherwise a "not uploaded" placeholder
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
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // "approve" | "reject" | "block" | null

  const fetchVendor = async () => {
    setIsLoading(true);
    try {
      const data = await getVendorById(id);
      setVendor(data.vendor);
    } catch (error) {
      toast.error("Failed to load vendor details");
      navigate("/vendors");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const closeModal = () => setActiveModal(null);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await approveVendor(id);
      toast.success("Vendor approved");
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
      await rejectVendor(id, reason);
      toast.success("Vendor rejected");
      closeModal();
      fetchVendor();
    } catch (error) {
      toast.error(error.response?.data?.message || "Rejection failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleBlock = async () => {
    setActionLoading(true);
    try {
      const data = await toggleVendorBlock(id);
      toast.success(data.message);
      closeModal();
      fetchVendor();
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

  if (!vendor) return null;

  const status = !vendor.isActive ? "Blocked" : vendor.isApproved ? "Approved" : "Pending";
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

          {vendor.isApproved && (
            <button
              onClick={() => setActiveModal("block")}
              className={`flex-1 flex items-center justify-center gap-2 font-medium text-sm py-2.5
                rounded-lg transition-colors ${
                  vendor.isActive
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "bg-green-50 text-green-700 hover:bg-green-100"
                }`}
            >
              <Ban size={16} />
              {vendor.isActive ? "Block Vendor" : "Unblock Vendor"}
            </button>
          )}
        </div>
      </div>

      {/* Document verification */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4">
        <h2 className="text-sm font-semibold text-secondary mb-4">Verification Documents</h2>
        <div className="grid grid-cols-2 gap-4">
          <DocumentPreview label="CNIC" url={vendor.cnicImage} />
          <DocumentPreview label="Business License" url={vendor.businessLicenseImage} />
        </div>
      </div>

      {/* Activity log - only shows entries that actually happened */}
      {(vendor.approvedBy || vendor.rejectedBy || vendor.blockedBy) && (
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
            {vendor.blockedBy && !vendor.isActive && (
              <p className="text-gray-600">
                Blocked by <span className="font-medium text-secondary">{vendor.blockedBy.fullName}</span>{" "}
                on {new Date(vendor.blockedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <ConfirmModal
        isOpen={activeModal === "approve"}
        title="Approve this vendor?"
        message={`${vendor.shopName} will be able to start receiving orders immediately.`}
        confirmLabel="Approve"
        variant="primary"
        isLoading={actionLoading}
        onConfirm={handleApprove}
        onCancel={closeModal}
      />

      <ConfirmModal
        isOpen={activeModal === "reject"}
        title="Reject this vendor?"
        message={`Please provide a reason. ${vendor.shopName}'s account will be deactivated.`}
        confirmLabel="Reject"
        variant="danger"
        requireReason
        isLoading={actionLoading}
        onConfirm={handleReject}
        onCancel={closeModal}
      />

      <ConfirmModal
        isOpen={activeModal === "block"}
        title={vendor.isActive ? "Block this vendor?" : "Unblock this vendor?"}
        message={
          vendor.isActive
            ? `${vendor.shopName} will lose access to their vendor account immediately.`
            : `${vendor.shopName} will regain access to their vendor account.`
        }
        confirmLabel={vendor.isActive ? "Block" : "Unblock"}
        variant={vendor.isActive ? "danger" : "primary"}
        isLoading={actionLoading}
        onConfirm={handleToggleBlock}
        onCancel={closeModal}
      />
    </div>
  );
};

export default VendorDetails;