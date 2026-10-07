// backend/controllers/delivery/ratingController.js
import asyncHandler from "express-async-handler";
import RiderReview from "../../models/RiderReview.js";

// @desc   Get rider's average rating and total review count
// @route  GET /api/delivery/rating
export const getMyRating = asyncHandler(async (req, res) => {
  const result = await RiderReview.aggregate([
    { $match: { rider: req.user._id } },
    { $group: { _id: null, averageRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } },
  ]);

  const data = result[0] || { averageRating: 0, totalReviews: 0 };

  res.status(200).json({
    averageRating: data.averageRating ? Number(data.averageRating.toFixed(1)) : null,
    totalReviews: data.totalReviews,
  });
});