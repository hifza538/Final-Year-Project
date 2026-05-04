import API from "./axios";

// Create order
export const createOrder = (orderData) => {
  return API.post("/orders", orderData);
};

// Get logged-in user's orders
export const getMyOrders = () => {
  return API.get("/orders/myorders");
};

// Get single order by ID
export const getOrderById = (id) => {
  return API.get(`/orders/${id}`);
};

// Update order status
export const updateOrderStatus = (id, statusData) => {
  return API.put(`/orders/${id}/status`, statusData);
};

// Cancel order
export const cancelOrder = (id) => {
  return API.put(`/orders/${id}/cancel`);
};