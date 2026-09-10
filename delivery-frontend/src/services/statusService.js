// delivery-frontend/src/services/statusService.js
import api from "./api";

export const updateOnlineStatus = async (isOnline) => {
  const response = await api.patch("/delivery/status", { isOnline });
  return response.data;
};