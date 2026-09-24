// backend/routes/customerRoutes.js

import express from "express";
import { registerCustomer, loginCustomer, getMe, updateProfile } from "../controllers/customer/authController.js";
import { getAddresses, addAddress, updateAddress, deleteAddress } from "../controllers/customer/addressController.js";
import { getAllRestaurants, getRestaurantById, getRestaurantMenu } from "../controllers/customer/restaurantController.js";
import { placeOrder, getMyOrders, getMyOrderById, cancelMyOrder } from "../controllers/customer/orderController.js";
import { addReview, getRestaurantReviews } from "../controllers/customer/reviewController.js";
import { forgotPassword, resetPassword } from "../controllers/shared/passwordController.js";
import { verifyEmail, resendVerification } from "../controllers/shared/verificationController.js";
import { protect, customerOnly } from "../middleware/authMiddleware.js";
import { submitContactMessage } from "../controllers/public/contactController.js";

const router = express.Router();

router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.post("/contact", submitContactMessage);
router.get("/me", protect, customerOnly, getMe);
router.put("/profile", protect, customerOnly, updateProfile);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Email verification routes
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerification);

// Address routes
router.get("/addresses", protect, customerOnly, getAddresses);
router.post("/addresses", protect, customerOnly, addAddress);
router.put("/addresses/:addressId", protect, customerOnly, updateAddress);
router.delete("/addresses/:addressId", protect, customerOnly, deleteAddress);

// Public routes for fetching restaurants
router.get("/restaurants", getAllRestaurants);
router.get("/restaurants/:id", getRestaurantById);
// menu routes
router.get("/restaurants/:id/menu", getRestaurantMenu);

// private route for ordering
router.post("/orders", protect, customerOnly, placeOrder);
router.get("/orders", protect, customerOnly, getMyOrders);
router.get("/orders/:id", protect, customerOnly, getMyOrderById);
router.patch("/orders/:id/cancel", protect, customerOnly, cancelMyOrder);

// review routes
router.post("/reviews", protect, customerOnly, addReview);
router.get("/restaurants/:id/reviews", getRestaurantReviews);

export default router;