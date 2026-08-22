// customer-frontend/src/services/authService.js

import api from "./api";

// Registers a new customer account
export const registerCustomer = async (formData) => {
  const { confirmPassword, ...payload } = formData; // confirmPassword is not needed for backend registration
  const response = await api.post("/customer/register", payload);
  return response.data;
};

// Logs in an existing customer
export const loginCustomer = async (formData) => {
  const response = await api.post("/customer/login", formData);
  return response.data;
};

// updates the profile of the logged-in customer
export const updateProfile = async (formData) => {
  const response = await api.put("/customer/profile", formData);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/customer/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await api.post(`/customer/reset-password/${token}`, { password });
  return response.data;
};