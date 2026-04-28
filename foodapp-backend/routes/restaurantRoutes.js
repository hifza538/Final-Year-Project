// routes/restaurantRoutes.js
import express from "express";
import {
  getAllRestaurants,
  getRestaurantById,
  getAllCuisines,
  seedRestaurants,
} from "../controllers/restaurantController.js";

const router = express.Router();

// Seed restaurants data
router.get("/seed", seedRestaurants);

// Get cuisines list
router.get("/cuisines", getAllCuisines);

// Get all restaurants
router.get("/", getAllRestaurants);

// Get single restaurant by ID
router.get("/:id", getRestaurantById);



export default router;