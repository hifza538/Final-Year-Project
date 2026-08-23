// backend/routes/delivery/statusRoutes.js
import express from "express";
import { updateOnlineStatus } from "../../controllers/delivery/statusController.js";
import { protect, deliveryOnly } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.patch("/", protect, deliveryOnly, updateOnlineStatus);

export default router;