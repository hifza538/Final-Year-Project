// vendor-frontend/src/services/performanceService.js
import api from "./api";

export const getMyPerformance = async () => {
  const response = await api.get("/vendor/performance");
  return response.data;
};