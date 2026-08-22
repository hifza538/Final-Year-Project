// server/controllers/vendor/reviewController.js

import asyncHandler from "express-async-handler";
import Review from "../../models/Review.js";

/*@desc   Get all reviews for the logged-in vendor's restaurant
 @route  GET /api/vendor/reviews
 @access Private (vendor)*/
export const getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ vendor: req.user._id })
    .populate("customer", "fullName")
    .sort({ createdAt: -1 });

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  // Breakdown of how many reviews fall into each star rating — used for the summary bars
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    breakdown[r.rating] = (breakdown[r.rating] || 0) + 1;
  });

  res.status(200).json({
    count: reviews.length,
    averageRating,
    breakdown,
    reviews,
  });
});