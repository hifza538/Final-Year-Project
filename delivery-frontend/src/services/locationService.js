// delivery-frontend/src/services/locationService.js
import api from "./api";

export const updateLocationAndRadius = async (lat, lng, radius) => {
  const response = await api.patch("/delivery/location", { lat, lng, radius });
  return response.data;
};

export const getLocationAndRadius = async () => {
  const response = await api.get("/delivery/location");
  return response.data;
};