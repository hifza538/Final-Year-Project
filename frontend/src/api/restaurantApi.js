// src/api/restaurantApi.js
import API from "./axios";

// Get all restaurants
export const getAllRestaurants = (params) => {
  return API.get("/restaurants", { params });
};

// Get single restaurant by ID
export const getRestaurantById = (id) => {
  return API.get(`/restaurants/${id}`);
};

// Get cuisines
export const getCuisines = () => {
  return API.get("/restaurants/cuisines");
};