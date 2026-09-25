//admin-frontend/src/services/categoryService.js

import api from "./api";

const multipart = { headers: { "Content-Type": "multipart/form-data" } };

export const getAllCuisines = async () => {
  const response = await api.get("/admin/cuisines");
  return response.data;
};

// Create a new cuisine with name and image (File)
export const createCuisine = async ({ name, image }) => {
  const formData = new FormData();
  formData.append("name", name);
  if (image) formData.append("image", image);

  const response = await api.post("/admin/cuisines", formData, multipart);
  return response.data;
};

// Simple JSON update, used for the Hide / Unhide toggle
export const updateCuisine = async (id, payload) => {
  const response = await api.patch(`/admin/cuisines/${id}`, payload);
  return response.data;
};

// Edit name and/or image: image = new File to upload, removeImage = clear the current image
export const updateCuisineDetails = async (id, { name, image, removeImage }) => {
  const formData = new FormData();
  formData.append("name", name);
  if (image) formData.append("image", image);
  if (removeImage) formData.append("removeImage", "true");

  const response = await api.patch(`/admin/cuisines/${id}`, formData, multipart);
  return response.data;
};

export const deleteCuisine = async (id) => {
  const response = await api.delete(`/admin/cuisines/${id}`);
  return response.data;
};