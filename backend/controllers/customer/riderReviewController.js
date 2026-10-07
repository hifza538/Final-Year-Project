// backend/controllers/customer/riderReviewController.js
import asyncHandler from "express-async-handler";
import RiderReview from "../../models/RiderReview.js";
import Order from "../../models/Order.js";

// @desc   Customer submits a rating for the rider who delivered their order
// @route  POST /api/customer/rider-review
export const submitRiderReview = asyncHandler(async (req, res) => {
  const { orderId, rating, comment } = req.body;

  if (!orderId || !rating) {
    res.status(400);
    throw new Error("Order and rating are required");
  }
  if (rating < 1 || rating > 5) {
    res.status(400);
    throw new Error("Rating must be between 1 and 5");
  }

  const order = await Order.findOne({
    _id: orderId,
    customer: req.user._id,
    orderStatus: "Completed",
  });
  if (!order) {
    res.status(404);
    throw new Error("Order not found or not yet completed");
  }
  if (!order.deliveryRider) {
    res.status(400);
    throw new Error("This order has no assigned rider to review");
  }

  const existing = await RiderReview.findOne({ order: orderId });
  if (existing) {
    res.status(400);
    throw new Error("You have already rated this delivery");
  }

  const review = await RiderReview.create({
    order: orderId,
    customer: req.user._id,
    rider: order.deliveryRider,
    rating,
    comment: comment?.trim() || "",
  });

  res.status(201).json({ message: "Thanks for rating your rider!", review });
});