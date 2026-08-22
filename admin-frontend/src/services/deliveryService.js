//admin-frontend/src/services/deliveryService.js
import api from "./api";

export const getAllRiders = async (params = {}) => {
  const response = await api.get("/admin/delivery", { params });
  return response.data;
};

export const getRiderById = async (id) => {
  const response = await api.get(`/admin/delivery/${id}`);
  return response.data;
};

export const approveRider = async (id) => {
  const response = await api.patch(`/admin/delivery/${id}/approve`);
  return response.data;
};

export const rejectRider = async (id, reason) => {
  const response = await api.patch(`/admin/delivery/${id}/reject`, { reason });
  return response.data;
};

export const toggleRiderBlock = async (id) => {
  const response = await api.patch(`/admin/delivery/${id}/toggle-block`);
  return response.data;
};