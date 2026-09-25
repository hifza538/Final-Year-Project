// vendor-frontend/src/services/categoryService.js

import api from "./api";

export const getActiveCategories = async () => {
  const { data } = await api.get("/cuisines");
  return { categories: data.cuisines };
};