// vendor-frontend/src/services/profileService.js

import api from "./api";

export const getProfile = async () => {
  const { data } = await api.get("/vendor/profile");
  return data;
};

export const updateProfile = async (formData) => {
  const { data } = await api.put("/vendor/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateShopStatus = async (isOpen) => {
  const { data } = await api.patch("/vendor/profile/status", { isOpen });
  return data;
};