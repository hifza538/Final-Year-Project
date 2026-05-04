// src/components/checkout/OrderNotes.jsx
import React from "react";
import { FileText } from "lucide-react";

function OrderNotes({ formData, handleChange }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <FileText className="w-5 h-5 text-orange-500" />
        <h2 className="text-xl font-semibold text-gray-900">Order Notes</h2>
      </div>

      <textarea
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        rows="4"
        placeholder="Add delivery instructions or any special request..."
        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-orange-500 resize-none"
      />
    </div>
  );
}

export default OrderNotes;