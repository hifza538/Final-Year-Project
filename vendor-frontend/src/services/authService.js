// vendor-frontend/src/services/authService.js

import api from "./api";

export const registerVendor = async (formData) => {
  const { data } = await api.post("/vendor/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const loginVendor = async (credentials) => {
  const { data } = await api.post("/vendor/login", credentials);
  return data;
};

export const forgotPassword = async (email) => {
  const { data } = await api.post("/vendor/forgot-password", { email });
  return data;
};

export const resetPassword = async (token, password) => {
  const { data } = await api.post(`/vendor/reset-password/${token}`, { password });
  return data;
};

// Verifies the account using the token from the verification email
export const verifyEmail = async (token) => {
  const { data } = await api.post(`/vendor/verify-email/${token}`);
  return data;
};
 
// Requests a new verification email (in case the first one was missed or expired)
export const resendVerification = async (email) => {
  const { data } = await api.post("/vendor/resend-verification", { email });
  return data;
};