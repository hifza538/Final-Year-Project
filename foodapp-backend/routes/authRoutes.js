// routes/authRoutes.js
import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../controllers/authController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// ===== PUBLIC ROUTES =====
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

// ===== PROTECTED ROUTES (Login zaroori) =====
router.get("/me", protect, getProfile);
router.put("/update-profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

// ===== VENDOR ONLY ROUTES (example) =====
// router.get("/vendor/dashboard", protect, authorize("vendor"), vendorDashboard);

// ===== ADMIN ONLY ROUTES (example) =====
// router.get("/admin/users", protect, authorize("admin"), getAllUsers);

export default router;