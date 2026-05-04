// src/components/checkout/CustomerInfo.jsx
import React from "react";
import { User } from "lucide-react";

function CustomerInfo({ formData, handleChange }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <User className="w-5 h-5 text-orange-500" />
        <h2 className="text-xl font-semibold text-gray-900">Customer Info</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full md:col-span-2 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
          required
        />
      </div>
    </div>
  );
}

export default CustomerInfo;