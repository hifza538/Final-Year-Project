// backend/routes/vendorRoutes.js
import express from "express";
import { protect, vendorOnly } from "../middleware/authMiddleware.js";
import { getDashboardStats } from "../controllers/vendor/vendorController.js";
import { getProfile, updateProfile, getShopStatus, updateShopStatus } from "../controllers/vendor/profileController.js";
import { uploadRestaurant } from "../config/cloudinary.js";
import { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem, toggleStock } from "../controllers/vendor/menuController.js";
import { uploadMenuImage } from "../config/cloudinary.js";
import { getVendorOrders, getOrderById, updateOrderStatus } from "../controllers/vendor/orderController.js";
const router = express.Router();

// All routes are protected - vendor only
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

// Menu management routes
router.get("/menu", getMenuItems);
router.post("/menu", uploadMenuImage, addMenuItem);
router.put("/menu/:id", uploadMenuImage, updateMenuItem);
router.delete("/menu/:id", deleteMenuItem);
router.patch("/menu/:id/toggle-stock", toggleStock);

// Order management routes
router.get("/orders", getVendorOrders);
router.get("/orders/:id", getOrderById);
router.patch("/orders/:id/status", updateOrderStatus);

export default router;