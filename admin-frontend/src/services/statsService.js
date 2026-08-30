// admin-frontend/src/services/statsService.js

import api from "./api";

export const getOverviewStats = async () => {
  const response = await api.get("/admin/stats/overview");
  return response.data;
};
export const getOrdersTimeline = async () => {
  const response = await api.get("/admin/stats/orders-timeline");
  return response.data;
};

export const getRecentOrders = async () => {
  const response = await api.get("/admin/stats/recent-orders");
  return response.data;
};