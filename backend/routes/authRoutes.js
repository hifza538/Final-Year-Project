import express from "express";
import { registerVendor,
  loginUser,
  getMe
 } from "../controllers/auth/authController.js";
 import { forgotPassword, resetPassword } from "../controllers/shared/passwordController.js";
import {uploadCnic} from "../config/cloudinary.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// public route for vendor registration
router.post(
  "/register",
  uploadCnic.fields([
    { name: "cnicFront", maxCount: 1 },
    { name: "cnicBack", maxCount: 1 },
  ]),
  registerVendor
);
router.post("/login", loginUser);

// protected route to get logged-in user details
router.get("/me", protect, getMe);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


export default router;