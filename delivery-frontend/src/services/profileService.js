// delivery-frontend/src/services/profileService.js
import api from "./api";

export const getProfile = async () => {
  const response = await api.get("/delivery/profile");
  return response.data;
};

export const updateProfile = async (formData) => {
  const response = await api.patch("/delivery/profile", formData);
  return response.data;
};