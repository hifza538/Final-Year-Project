// customer-frontend/src/services/reviewService.js

import api from "./api";

export const addReview = async (reviewData) => {
  const response = await api.post("/customer/reviews", reviewData);
  return response.data;
};

export const getRestaurantReviews = async (restaurantId) => {
  const response = await api.get(`/customer/restaurants/${restaurantId}/reviews`);
  return response.data;
};