// vendor-frontend/src/services/menuService.js
import api from "./api"; // reuse your existing axios instance with auth header

export const getCategories = () => api.get("/categories").then((r) => r.data);

// addons group
export const getAddonGroups    = () => api.get("/vendor/addon-groups").then((r) => r.data);
export const addAddonGroup     = (data) => api.post("/vendor/addon-groups", data).then((r) => r.data);
export const updateAddonGroup  = (id, data) => api.put(`/vendor/addon-groups/${id}`, data).then((r) => r.data);
export const deleteAddonGroup  = (id) => api.delete(`/vendor/addon-groups/${id}`).then((r) => r.data);

// menu items
export const getMenuItems = () => api.get("/vendor/menu").then((r) => r.data);

export const addMenuItem = (formData) =>
  api.post("/vendor/menu", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data);

export const updateMenuItem = (id, formData) =>
  api.put(`/vendor/menu/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data);

export const deleteMenuItem = (id) => api.delete(`/vendor/menu/${id}`).then((r) => r.data);

export const toggleMenuItemStock = (id) => api.patch(`/vendor/menu/${id}/toggle-stock`).then((r) => r.data);