// vendor-frontend/src/services/menuService.js

import api from "./api";

export const getMenuItems = async () => {
  const { data } = await api.get("/vendor/menu");
  return data;
};

export const addMenuItem = async (formData) => {
  const { data } = await api.post("/vendor/menu", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateMenuItem = async (id, formData) => {
  const { data } = await api.put(`/vendor/menu/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteMenuItem = async (id) => {
  const { data } = await api.delete(`/vendor/menu/${id}`);
  return data;
};

export const toggleMenuItemStock = async (id) => {
  const { data } = await api.patch(`/vendor/menu/${id}/toggle-stock`);
  return data;
};