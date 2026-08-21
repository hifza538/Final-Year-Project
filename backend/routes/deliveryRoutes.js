import express from "express";
import { registerDelivery, loginDelivery, getMe } from "../controllers/delivery/authController.js";
import { forgotPassword, resetPassword } from "../controllers/shared/passwordController.js";
import { protect, deliveryOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerDelivery);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/login", loginDelivery);
router.get("/me", protect, deliveryOnly, getMe);

export default router;
