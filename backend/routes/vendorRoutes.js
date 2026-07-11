import express from "express";
import { protect, vendorOnly } from "../middleware/authMiddleware.js";
import { getDashboardStats } from "../controllers/vendor/vendorController.js";
import { getProfile, updateProfile, getShopStatus, updateShopStatus } from "../controllers/vendor/profileController.js";
import { uploadRestaurant } from "../config/cloudinary.js";
const router = express.Router();

// All routes are protected — vendor only
router.use(protect, vendorOnly);

// Dashboard statistics route
router.get("/dashboard-stats", getDashboardStats);

// Vendor profile routes
router.get("/profile", getProfile);
router.put("/profile", uploadRestaurant.fields([{ name: "coverPhoto", maxCount: 1 }, { name: "logo", maxCount: 1 }]), updateProfile);
router.post("/profile/cover-photo", uploadRestaurant.single("coverPhoto"), updateProfile);
router.post("/profile/logo", uploadRestaurant.single("logo"), updateProfile);
router.get("/profile/status", getShopStatus);
router.put("/profile/status", updateShopStatus);
router.patch("/profile/status", updateShopStatus);
export default router;