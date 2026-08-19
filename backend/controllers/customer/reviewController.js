// server/controllers/customer/reviewController.js

import asyncHandler from "express-async-handler";
import Review from "../../models/Review.js";
import Order from "../../models/Order.js";

/* @desc   Submit a review for a completed order
@route  POST /api/customer/reviews*/
export const addReview = asyncHandler(async (req, res) => {
  const { orderId, rating, comment } = req.body;

  if (!orderId) {
    res.status(400);
    throw new Error("Order is required");
  }
  if (!rating || rating < 1 || rating > 5) {
    res.status(400);
    throw new Error("Rating must be between 1 and 5");
  }
  if (comment && comment.trim().length > 500) {
    res.status(400);
    throw new Error("Comment must not exceed 500 characters");
  }

  // Verify that the order exists, belongs to the logged-in customer, and is completed
  const order = await Order.findOne({ _id: orderId, customer: req.user._id });
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  if (order.orderStatus !== "Completed") {
    res.status(400);
    throw new Error("You can only review completed orders");
  }

  // Prevent duplicate reviews for the same order
  const existingReview = await Review.findOne({ order: orderId });
  if (existingReview) {
    res.status(400);
    throw new Error("You have already reviewed this order");
  }

  const review = await Review.create({
    customer: req.user._id,
    vendor: order.vendor,
    order: orderId,
    rating,
    comment: comment?.trim() || "",
  });

  res.status(201).json({
    message: "Review submitted successfully",
    review,
  });
});

/* @desc   Get all reviews for a specific restaurant (public)
 @route  GET /api/customer/restaurants/:id/reviews */
export const getRestaurantReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ vendor: req.params.id })
    .populate("customer", "fullName")
    .sort({ createdAt: -1 });

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  res.status(200).json({
    count: reviews.length,
    averageRating,
    reviews,
  });
});