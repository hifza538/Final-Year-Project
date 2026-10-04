// delivery-frontend/src/services/earningsService.js
import api from "./api";

export const getEarningsSummary = async () => {
  const response = await api.get("/delivery/earnings/summary");
  return response.data;
};

export const getRecentEarnings = async () => {
  const response = await api.get("/delivery/earnings/recent");
  return response.data;
};