//admin-frontend/src/services/customerService.js

import api from "./api";

export const getAllCustomers = async (params = {}) => {
  const response = await api.get("/admin/customers", { params });
  return response.data;
};

export const getCustomerById = async (id) => {
  const response = await api.get(`/admin/customers/${id}`);
  return response.data;
};

export const toggleCustomerBlock = async (id) => {
  const response = await api.patch(`/admin/customers/${id}/toggle-block`);
  return response.data;
};