// admin-frontend/src/services/statsService.js

import api from "./api";

export const getOverviewStats = async () => {
  const response = await api.get("/admin/stats/overview");
  return response.data;
};