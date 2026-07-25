// server/src/routes/customerRoutes.js

import express from "express";
import { registerCustomer, loginCustomer, getMe } from "../controllers/customer/authController.js";
import { getAllRestaurants, getRestaurantById, getAvailableCuisines, getRestaurantMenu } from "../controllers/customer/restaurantController.js";
import { protect, customerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.get("/me", protect, customerOnly, getMe);

// Public routes for fetching restaurants
router.get("/restaurants/cuisines", getAvailableCuisines);
router.get("/restaurants", getAllRestaurants);
router.get("/restaurants/:id", getRestaurantById);
// menu routes
router.get("/restaurants/:id/menu", getRestaurantMenu);

export default router;