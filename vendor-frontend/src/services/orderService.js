// vendor-frontend/src/services/orderService.js

import api from "./api";

export const getVendorOrders = async (params = {}) => {
  const { data } = await api.get("/vendor/orders", { params });
  return data;
};

export const updateOrderStatus = async (orderId, status) => {
  const { data } = await api.patch(`/vendor/orders/${orderId}/status`, { status });
  return data;
};

export const getDashboardStats = async () => {
  const { data } = await api.get("/vendor/dashboard-stats");
  return data;
};