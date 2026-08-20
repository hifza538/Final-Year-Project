import express from "express";
import {
  getAvailableOrders,
  acceptOrder,
  getMyOrders,
  deliverOrder,
  getOrderHistory,
} from "../../controllers/delivery/orderController.js";
import { protect, deliveryOnly } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Apply authentication and delivery rider authorization middleware to all routes
router.use(protect, deliveryOnly);

router.get("/available", getAvailableOrders);
router.patch("/:id/accept", acceptOrder);
router.get("/my-orders", getMyOrders);
router.patch("/:id/deliver", deliverOrder);
router.get("/history", getOrderHistory);

export default router;