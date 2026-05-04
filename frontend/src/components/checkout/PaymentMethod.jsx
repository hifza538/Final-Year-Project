// src/components/checkout/PaymentMethod.jsx
import React from "react";
import { CreditCard } from "lucide-react";

function PaymentMethod({ formData, handleChange }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <CreditCard className="w-5 h-5 text-orange-500" />
        <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
      </div>

      <div className="space-y-4">
        <label className="flex items-center gap-3 border border-gray-200 rounded-xl p-4 cursor-pointer">
          <input
            type="radio"
            name="paymentMethod"
            value="cash"
            checked={formData.paymentMethod === "cash"}
            onChange={handleChange}
          />
          <span className="text-gray-800 font-medium">Cash on Delivery</span>
        </label>

        <label className="flex items-center gap-3 border border-gray-200 rounded-xl p-4 cursor-pointer">
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={formData.paymentMethod === "card"}
            onChange={handleChange}
          />
          <span className="text-gray-800 font-medium">Credit / Debit Card</span>
        </label>
      </div>
    </div>
  );
}

export default PaymentMethod;