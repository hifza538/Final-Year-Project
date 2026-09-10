import express from "express";
import { registerDelivery, loginDelivery, getMe } from "../controllers/delivery/authController.js";
import { forgotPassword, resetPassword } from "../controllers/shared/passwordController.js";
import {
  getAvailableOrders,
  acceptOrder,
  getMyOrders,
  deliverOrder,
  getOrderHistory,
} from "../controllers/delivery/orderController.js";
import { getProfile, updateProfile } from "../controllers/delivery/profileController.js";
import { updateOnlineStatus } from "../controllers/delivery/statusController.js";
import { protect, deliveryOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerDelivery);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
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
router.patch("/orders/:id/deliver", protect, deliveryOnly, deliverOrder);
router.get("/orders/history", protect, deliveryOnly, getOrderHistory);

export default router;
