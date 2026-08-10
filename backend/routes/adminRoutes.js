// backend/routes/adminRoutes.js

import express from "express";
import { loginAdmin, getMe } from "../controllers/admin/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getOverviewStats } from "../controllers/admin/statsController.js";

const router = express.Router();

// Admin authentication routes
router.post("/login", loginAdmin);
router.get("/me", protect, adminOnly, getMe);

// Admin stats route
router.get("/stats/overview", protect, adminOnly, getOverviewStats);

export default router;
