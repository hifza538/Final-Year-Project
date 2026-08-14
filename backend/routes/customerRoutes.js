// server/src/routes/customerRoutes.js

import express from "express";
import { registerCustomer, loginCustomer, getMe, updateProfile } from "../controllers/customer/authController.js";
import { getAddresses, addAddress, updateAddress, deleteAddress } from "../controllers/customer/addressController.js";
import { getAllRestaurants, getRestaurantById, getAvailableCuisines, getRestaurantMenu } from "../controllers/customer/restaurantController.js";
import { placeOrder, getMyOrders, getMyOrderById } from "../controllers/customer/orderController.js";
import { protect, customerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.get("/me", protect, customerOnly, getMe);
router.put("/profile", protect, customerOnly, updateProfile);

// Address routes
router.get("/addresses", protect, customerOnly, getAddresses);
router.post("/addresses", protect, customerOnly, addAddress);
router.put("/addresses/:addressId", protect, customerOnly, updateAddress);
router.delete("/addresses/:addressId", protect, customerOnly, deleteAddress);

// Public routes for fetching restaurants
router.get("/restaurants/cuisines", getAvailableCuisines);
router.get("/restaurants", getAllRestaurants);
router.get("/restaurants/:id", getRestaurantById);
// menu routes
router.get("/restaurants/:id/menu", getRestaurantMenu);

// private route for ordering
router.post("/orders", protect, customerOnly, placeOrder);
router.get("/orders", protect, customerOnly, getMyOrders);
router.get("/orders/:id", protect, customerOnly, getMyOrderById);

export default router;