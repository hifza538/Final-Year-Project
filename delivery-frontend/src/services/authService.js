import api from "./api";

export const registerDelivery = async (formData) => {
  const { confirmPassword, ...payload } = formData;
  const response = await api.post("/delivery/register", payload);
  return response.data;
};

export const loginDelivery = async (formData) => {
  const response = await api.post("/delivery/login", formData);
  return response.data;
};
