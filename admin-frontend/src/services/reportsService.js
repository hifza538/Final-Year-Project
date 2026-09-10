//admin-frontend/src/services/reportsService.js

import api from "./api";

export const getReportsOverview = async (startDate, endDate) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const response = await api.get("/admin/reports/overview", { params });
  return response.data;
};