//admin-frontend/src/services/categoryService.js

import api from "./api";

export const getAllCategories = async () => {
  const response = await api.get("/admin/categories");
  return response.data;
};

export const createCategory = async (name) => {
  const response = await api.post("/admin/categories", { name });
  return response.data;
};

export const updateCategory = async (id, payload) => {
  const response = await api.patch(`/admin/categories/${id}`, payload);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/admin/categories/${id}`);
  return response.data;
};