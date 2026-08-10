// admin-frontend/src/services/vendorService.js

import api from "./api";

export const getPendingVendors = async () => {
  const response = await api.get("/admin/vendors/pending");
  return response.data;
};

export const approveVendor = async (id) => {
  const response = await api.patch(`/admin/vendors/${id}/approve`);
  return response.data;
};

export const rejectVendor = async (id) => {
  const response = await api.patch(`/admin/vendors/${id}/reject`);
  return response.data;
};