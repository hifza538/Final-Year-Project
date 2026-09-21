import api from "./api";

export const getAvailableOrders = async () => {
  const response = await api.get("/delivery/orders/available");
  return response.data;
};

export const acceptOrder = async (orderId) => {
  const response = await api.patch(`/delivery/orders/${orderId}/accept`);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get("/delivery/orders/my-orders");
  return response.data;
};

export const advanceOrderStatus = async (orderId) => {
  const response = await api.patch(`/delivery/orders/${orderId}/advance-status`);
  return response.data;
};

export const getOrderHistory = async () => {
  const response = await api.get("/delivery/orders/history");
  return response.data;
};