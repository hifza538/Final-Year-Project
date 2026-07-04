import express from "express";
import { protect, vendorOnly } from "../middleware/authMiddleware.js";
import { getDashboardStats } from "../controllers/vendor/vendorController.js";

const router = express.Router();

// All routes are protected — vendor only
router.use(protect, vendorOnly);

// Dashboard statistics route
router.get("/dashboard-stats", getDashboardStats);

export default router;