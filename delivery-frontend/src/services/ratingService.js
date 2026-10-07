// delivery-frontend/src/services/ratingService.js
import api from "./api";

export const getMyRating = async () => {
  const response = await api.get("/delivery/rating");
  return response.data;
};