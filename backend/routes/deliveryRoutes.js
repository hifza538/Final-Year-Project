import express from "express";
import { registerDelivery, loginDelivery, getMe } from "../controllers/delivery/authController.js";
import { forgotPassword, resetPassword } from "../controllers/shared/passwordController.js";
import { verifyEmail, resendVerification } from "../controllers/shared/verificationController.js";
import {
  getAvailableOrders,
  acceptOrder,
  getMyOrders,
  advanceOrderStatus,
  getOrderHistory,
} from "../controllers/delivery/orderController.js";
import { getProfile, updateProfile } from "../controllers/delivery/profileController.js";
import { updateOnlineStatus } from "../controllers/delivery/statusController.js";
import { protect, deliveryOnly } from "../middleware/authMiddleware.js";
import { getEarningsSummary, getRecentEarnings} from "../controllers/delivery/earningsController.js";
import { selectSlot, getTodaySlot } from "../controllers/delivery/statusController.js";
import { getMyRating } from "../controllers/delivery/ratingController.js";
import { updateLocationAndRadius, getLocationAndRadius } from "../controllers/delivery/locationController.js";



const router = express.Router();

router.post("/register", registerDelivery);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/verify-email/:token", verifyEmail);
router.post("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerification);

router.post("/login", loginDelivery);
//protect routes
router.get("/me", protect, deliveryOnly, getMe);

// Profile routes
router.get("/profile", protect, deliveryOnly, getProfile);
router.patch("/profile", protect, deliveryOnly, updateProfile);

// Online/offline status
router.patch("/status", protect, deliveryOnly, updateOnlineStatus);

// Order management routes
router.get("/orders/available", protect, deliveryOnly, getAvailableOrders);
router.patch("/orders/:id/accept", protect, deliveryOnly, acceptOrder);
router.get("/orders/my-orders", protect, deliveryOnly, getMyOrders);
router.patch("/orders/:id/advance-status", protect, deliveryOnly, advanceOrderStatus);
router.get("/orders/history", protect, deliveryOnly, getOrderHistory);

// Earnings routes
router.get("/earnings/summary", protect, deliveryOnly, getEarningsSummary);
router.get("/earnings/recent", protect, deliveryOnly, getRecentEarnings);

// Slot selection routes
router.patch("/status/slot", protect, deliveryOnly, selectSlot);
router.get("/status/slot", protect, deliveryOnly, getTodaySlot);

// Location and radius routes
router.patch("/location", protect, deliveryOnly, updateLocationAndRadius);
router.get("/location", protect, deliveryOnly, getLocationAndRadius);

// Ratings routes
router.get("/ratings/my-rating", protect, deliveryOnly, getMyRating);

export default router;
