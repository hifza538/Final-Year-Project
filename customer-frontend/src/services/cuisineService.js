import api from "./api";

export const getActiveCuisines = async () => {
  const { data } = await api.get("/cuisines");
  return data;
};