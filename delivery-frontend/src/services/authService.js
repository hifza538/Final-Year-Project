import api from "./api";

export const registerDelivery = async (formData) => {
  const payload = { ...formData };
  delete payload.confirmPassword;

  const response = await api.post("/delivery/register", payload);
  return response.data;
};

export const loginDelivery = async (formData) => {
  const response = await api.post("/delivery/login", formData);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/delivery/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await api.post(`/delivery/reset-password/${token}`, { password });
  return response.data;
};
