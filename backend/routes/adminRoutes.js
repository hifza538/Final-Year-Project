// backend/routes/adminRoutes.js
import express from "express";
import { loginAdmin, getMe } from "../controllers/admin/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getOverviewStats, getOrdersTimeline, getRecentOrders } from "../controllers/admin/statsController.js";
import { getPendingVendors, getAllVendors, getVendorById, approveVendor, rejectVendor, warnVendor } from "../controllers/admin/vendorController.js";
import { getPendingRiders, getAllRiders, getRiderById, approveRider, rejectRider } from "../controllers/admin/deliveryController.js";
import { getAllCustomers, getCustomerById, toggleCustomerBlock } from "../controllers/admin/customerController.js";
import { getAllOrders, getOrderById, cancelOrder } from "../controllers/admin/orderController.js";
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "../controllers/admin/categoryController.js";
import { getReportsOverview } from "../controllers/admin/reportsController.js";
import { getSettings, updateSettings } from "../controllers/admin/settingsController.js";
import { updateProfile, changePassword } from "../controllers/admin/profileController.js";

const router = express.Router();

// Admin authentication routes
router.post("/login", loginAdmin);
router.get("/me", protect, adminOnly, getMe);

// Admin stats routes
router.get("/stats/overview", protect, adminOnly, getOverviewStats);
router.get("/stats/orders-timeline", protect, adminOnly, getOrdersTimeline);
router.get("/stats/recent-orders", protect, adminOnly, getRecentOrders);

// Admin vendor management routes
router.get("/vendors", protect, adminOnly, getAllVendors);
router.get("/vendors/pending", protect, adminOnly, getPendingVendors);
router.get("/vendors/:id", protect, adminOnly, getVendorById);
router.patch("/vendors/:id/approve", protect, adminOnly, approveVendor);
router.patch("/vendors/:id/reject", protect, adminOnly, rejectVendor);
router.post("/vendors/:id/warn", protect, adminOnly, warnVendor);

// Admin delivery rider management routes
router.get("/delivery", protect, adminOnly, getAllRiders);
router.get("/delivery/pending", protect, adminOnly, getPendingRiders);
router.get("/delivery/:id", protect, adminOnly, getRiderById);
router.patch("/delivery/:id/approve", protect, adminOnly, approveRider);
router.patch("/delivery/:id/reject", protect, adminOnly, rejectRider);

// Admin customer management routes
router.get("/customers", protect, adminOnly, getAllCustomers);
router.get("/customers/:id", protect, adminOnly, getCustomerById);
router.patch("/customers/:id/toggle-block", protect, adminOnly, toggleCustomerBlock);

// Admin order management routes
router.get("/orders", protect, adminOnly, getAllOrders);
router.get("/orders/:id", protect, adminOnly, getOrderById);
router.patch("/orders/:id/cancel", protect, adminOnly, cancelOrder);

// Admin category management routes
router.get("/categories", protect, adminOnly, getAllCategories);
router.post("/categories", protect, adminOnly, createCategory);
router.patch("/categories/:id", protect, adminOnly, updateCategory);
router.delete("/categories/:id", protect, adminOnly, deleteCategory);

// Admin reports route
router.get("/reports/overview", protect, adminOnly, getReportsOverview);

// Admin settings management routes
router.get("/settings", protect, adminOnly, getSettings);
router.patch("/settings", protect, adminOnly, updateSettings);

// Admin profile management routes
router.patch("/profile", protect, adminOnly, updateProfile);
router.patch("/profile/password", protect, adminOnly, changePassword);

export default router;