// customer-frontend/src/services/orderService.js

import api from "./api";

// Places a new order for the logged-in customer
export const placeOrder = async (orderData) => {
  const response = await api.post("/customer/orders", orderData);
  return response.data;
};

// Fetches the logged-in customer's order history
export const getMyOrders = async () => {
  const response = await api.get("/customer/orders");
  return response.data;
};

// Fetches a single order's details
export const getMyOrderById = async (id) => {
  const response = await api.get(`/customer/orders/${id}`);
  return response.data;
};