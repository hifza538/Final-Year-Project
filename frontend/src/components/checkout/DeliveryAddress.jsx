// src/components/checkout/DeliveryAddress.jsx
import React from "react";
import { MapPin } from "lucide-react";

function DeliveryAddress({ formData, handleChange }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <MapPin className="w-5 h-5 text-orange-500" />
        <h2 className="text-xl font-semibold text-gray-900">Delivery Address</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="streetAddress"
          placeholder="Street Address"
          value={formData.streetAddress}
          onChange={handleChange}
          className="w-full md:col-span-2 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
          required
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
          required
        />

        <input
          type="text"
          name="zipCode"
          placeholder="Zip Code"
          value={formData.zipCode}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
          required
        />
      </div>
    </div>
  );
}

export default DeliveryAddress;