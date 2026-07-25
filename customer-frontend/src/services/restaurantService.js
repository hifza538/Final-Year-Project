// customer-frontend/src/services/restaurantService.js

import api from "./api";

// Fetches restaurants - optionally filtered by search term, city or cuisine
export const getAllRestaurants = async (params = {}) => {
  const response = await api.get("/customer/restaurants", { params });
  return response.data;
};

// Fetches a single restaurant's details (used by the upcoming restaurant detail page)
export const getRestaurantById = async (id) => {
  const response = await api.get(`/customer/restaurants/${id}`);
  return response.data;
};

// Fetches available cuisines for filtering restaurants
export const getAvailableCuisines = async () => {
  const response = await api.get("/customer/restaurants/cuisines");
  return response.data;
};

// fetches restauarnt menu
export const getRestaurantMenu = async (id) => {
  const response = await api.get(`/customer/restaurants/${id}/menu`);
  return response.data;
};