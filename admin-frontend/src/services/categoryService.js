import api from "./api";

export const getAllCategories = async () => {
  const { data } = await api.get("/admin/categories");
  return data;
};

export const createCategory = async (name) => {
  const { data } = await api.post("/admin/categories", { name });
  return data;
};

export const updateCategory = async (id, payload) => {
  const { data } = await api.patch(`/admin/categories/${id}`, payload);
  return data;
};

export const deleteCategory = async (id) => {
  const { data } = await api.delete(`/admin/categories/${id}`);
  return data;
};
