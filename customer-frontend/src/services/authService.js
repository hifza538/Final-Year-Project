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