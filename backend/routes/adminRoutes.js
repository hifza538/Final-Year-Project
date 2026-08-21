// backend/routes/adminRoutes.js

import express from "express";
import { loginAdmin, getMe } from "../controllers/admin/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getOverviewStats } from "../controllers/admin/statsController.js";
import {getPendingVendors,getAllVendors,getVendorById,approveVendor, rejectVendor, toggleVendorBlock,} from "../controllers/admin/vendorController.js";
import {getPendingRiders, getAllRiders,getRiderById, approveRider, rejectRider, toggleRiderBlock,} from "../controllers/admin/deliveryController.js";

const router = express.Router();

// Admin authentication routes
router.post("/login", loginAdmin);
router.get("/me", protect, adminOnly, getMe);

// Admin stats route
router.get("/stats/overview", protect, adminOnly, getOverviewStats);

// Vendor management routes
router.get("/vendors", protect, adminOnly, getAllVendors);
router.get("/vendors/pending", protect, adminOnly, getPendingVendors);
router.get("/vendors/:id", protect, adminOnly, getVendorById);
router.patch("/vendors/:id/approve", protect, adminOnly, approveVendor);
router.patch("/vendors/:id/reject", protect, adminOnly, rejectVendor);
router.patch("/vendors/:id/toggle-block", protect, adminOnly, toggleVendorBlock);

// Delivery rider management routes
router.get("/delivery", protect, adminOnly, getAllRiders);
router.get("/delivery/pending", protect, adminOnly, getPendingRiders);
router.get("/delivery/:id", protect, adminOnly, getRiderById);
router.patch("/delivery/:id/approve", protect, adminOnly, approveRider);
router.patch("/delivery/:id/reject", protect, adminOnly, rejectRider);
router.patch("/delivery/:id/toggle-block", protect, adminOnly, toggleRiderBlock);

export default router;
