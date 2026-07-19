// admin-frontend/src/services/authService.js

import api from "./api";

export const loginAdmin = async (formData) => {
  const response = await api.post("/admin/login", formData);
  return response.data;
};
