import express from "express";
import auth from "../middleware/authMiddleware.js"; // default export { protect }

import {
  getRestaurantReviews,
  createReview,
  getRatingSummary,
} from "../controllers/reviewController.js";

const router = express.Router();

// Public
router.get("/restaurants/:restaurantId/reviews", getRestaurantReviews);
router.get("/restaurants/:restaurantId/reviews/summary", getRatingSummary);

// Protected
router.post("/restaurants/:restaurantId/reviews", auth.protect, createReview);

export default router;