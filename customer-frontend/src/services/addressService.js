// customer-frontend/src/services/addressService.js

import api from "./api";

export const getAddresses = async () => {
  const response = await api.get("/customer/addresses");
  return response.data;
};

export const addAddress = async (addressData) => {
  const response = await api.post("/customer/addresses", addressData);
  return response.data;
};

export const updateAddress = async (addressId, addressData) => {
  const response = await api.put(`/customer/addresses/${addressId}`, addressData);
  return response.data;
};

export const deleteAddress = async (addressId) => {
  const response = await api.delete(`/customer/addresses/${addressId}`);
  return response.data;
};