//admin-frontend/src/services/settingsService.js

import api from "./api";

export const getSettings = async () => {
  const response = await api.get("/admin/settings");
  return response.data;
};

export const updateSettings = async (payload) => {
  const response = await api.patch("/admin/settings", payload);
  return response.data;
};

export const updateProfile = async (payload) => {
  const response = await api.patch("/admin/profile", payload);
  return response.data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.patch("/admin/profile/password", { currentPassword, newPassword });
  return response.data;
};