// backend/routes/delivery/profileRoutes.js
import express from "express";
import { getProfile, updateProfile } from "../../controllers/delivery/profileController.js";
import { protect, deliveryOnly } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, deliveryOnly, getProfile);
router.patch("/", protect, deliveryOnly, updateProfile);

export default router;