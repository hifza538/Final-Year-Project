// vendor-frontend/src/services/reviewService.js

import api from "./api";

export const getMyReviews = async () => {
  const { data } = await api.get("/vendor/reviews");
  return data;
};