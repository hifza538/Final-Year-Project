// vendor-frontend/src/services/authService.js

import api from "./api";

export const registerVendor = async (formData) => {
  const { data } = await api.post("/auth/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const loginVendor = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  return data;
};

export const forgotPassword = async (email) => {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
};

export const resetPassword = async (token, password) => {
  const { data } = await api.post(`/auth/reset-password/${token}`, { password });
  return data;
};