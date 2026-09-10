//admin-frontend/src/services/orderService.js

import api from "./api";

export const getAllOrders = async (params = {}) => {
  const response = await api.get("/admin/orders", { params });
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`/admin/orders/${id}`);
  return response.data;
};

export const cancelOrder = async (id) => {
  const response = await api.patch(`/admin/orders/${id}/cancel`);
  return response.data;
};