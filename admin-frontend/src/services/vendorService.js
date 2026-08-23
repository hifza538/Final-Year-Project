//admin-frontend/src/services/vendorService.js
import api from "./api";

export const getAllVendors = async (params = {}) => {
  const response = await api.get("/admin/vendors", { params });
  return response.data;
};

export const getVendorById = async (id) => {
  const response = await api.get(`/admin/vendors/${id}`);
  return response.data;
};

export const approveVendor = async (id) => {
  const response = await api.patch(`/admin/vendors/${id}/approve`);
  return response.data;
};

export const rejectVendor = async (id, reason) => {
  const response = await api.patch(`/admin/vendors/${id}/reject` , { reason });
  return response.data;
};

export const toggleVendorBlock = async (id) => {
  const response = await api.patch(`/admin/vendors/${id}/toggle-block`);
  return response.data;
};