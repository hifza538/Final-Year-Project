import express from "express";
import { registerDelivery, loginDelivery, getMe } from "../controllers/delivery/authController.js";
import { protect, deliveryOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerDelivery);
router.post("/login", loginDelivery);
router.get("/me", protect, deliveryOnly, getMe);

export default router;
