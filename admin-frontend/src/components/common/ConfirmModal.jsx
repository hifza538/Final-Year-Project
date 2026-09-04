//admin-frontend/src/components/common/ConfirmModal.jsx

import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

// confirmModal component for displaying confirmation dialogs
const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  variant = "danger", // "danger" | "primary"
  requireReason = false,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  const [reason, setReason] = useState("");

  // reset the textarea each time the modal opens for a new vendor
  useEffect(() => {
    if (isOpen) setReason("");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (requireReason && !reason.trim()) return;
    onConfirm(requireReason ? reason.trim() : undefined);
  };

  const confirmDisabled = isLoading || (requireReason && !reason.trim());

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl w-full max-w-sm p-6 relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center mb-4 ${
            variant === "danger" ? "bg-red-50" : "bg-primary-light"
          }`}
        >
          <AlertTriangle
            size={20}
            className={variant === "danger" ? "text-red-500" : "text-primary"}
          />
        </div>

        <h3 className="text-base font-bold text-secondary mb-1.5">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{message}</p>

        {requireReason && (
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for rejection..."
            rows={3}
            className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none
              focus:border-primary transition-colors mb-4 resize-none"
          />
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-gray-600
              border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={confirmDisabled}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium text-white transition-colors
              disabled:opacity-60 ${
                variant === "danger"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-primary hover:bg-primary-dark"
              }`}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;