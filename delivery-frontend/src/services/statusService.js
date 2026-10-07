// delivery-frontend/src/services/statusService.js
import api from "./api";

export const updateOnlineStatus = async (isOnline) => {
  const response = await api.patch("/delivery/status", { isOnline });
  return response.data;
};

export const selectSlot = async (slot) => {
  const response = await api.patch("/delivery/status/slot", { slot });
  return response.data;
};

export const getTodaySlot = async () => {
  const response = await api.get("/delivery/status/slot");
  return response.data;
};