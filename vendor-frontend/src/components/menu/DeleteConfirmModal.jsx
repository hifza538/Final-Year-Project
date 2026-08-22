// vendor-frontend/src/components/menu/DeleteConfirmModal.jsx

import { Trash2, Loader2 } from "lucide-react";

const DeleteConfirmModal = ({ onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center 
    p-4 bg-black/40 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center 
        justify-center mx-auto mb-4">
        <Trash2 size={20} className="text-red-500" />
      </div>
      <h3 className="text-center font-bold text-gray-900 mb-2">
        Delete Menu Item?
      </h3>
      <p className="text-center text-sm text-gray-500 mb-6">
        This action cannot be undone. The item will be permanently deleted.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-lg border border-gray-200 
            text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 
            py-2.5 rounded-lg bg-red-500 hover:bg-red-600 
            disabled:bg-red-300 text-white text-sm font-semibold 
            transition-colors"
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            "Delete"
          )}
        </button>
      </div>
    </div>
  </div>
);

export default DeleteConfirmModal;