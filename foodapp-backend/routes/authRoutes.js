import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* === AUTH ROUTES+== */

// Register new user
router.post("/register", registerUser);

// Login existing user
router.post("/login", loginUser);

// Get logged-in user profile
router.get("/me", protect, getProfile);

// Forgot password - send OTP
router.post("/forgot-password", forgotPassword);

// Verify OTP
router.post("/verify-otp", verifyOtp);

// Reset password
router.post("/reset-password", resetPassword);

export default router;