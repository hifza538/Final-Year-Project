import mongoose from "mongoose";
import Restaurant from "../models/restaurantModel.js";

/* ------------------------------- Helpers -------------------------------- */

const calcAverage = (items) => {
  if (!items || items.length === 0) return 0;
  const sum = items.reduce((acc, r) => acc + Number(r.rating || 0), 0);
  return Number((sum / items.length).toFixed(1));
};

const calcBreakdown = (items) => {
  const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  (items || []).forEach((r) => {
    const star = Number(r.rating);
    if (star >= 1 && star <= 5) breakdown[star] += 1;
  });
  return breakdown;
};

/* -------------------------- 1) GET Reviews List -------------------------- */
/**
 * GET /api/restaurants/:restaurantId/reviews
 * Query: page, limit, sort=newest|oldest, rating=1..5
 */
export const getRestaurantReviews = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ success: false, message: "Invalid restaurantId" });
    }

    const restaurant = await Restaurant.findById(restaurantId).select("reviews");
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 50);
    const skip = (page - 1) * limit;

    const sort = (req.query.sort || "newest").toLowerCase();
    const ratingFilter = req.query.rating ? Number(req.query.rating) : null;

    let items = restaurant.reviews?.items || [];

    // optional rating filter
    if (ratingFilter && ratingFilter >= 1 && ratingFilter <= 5) {
      items = items.filter((r) => Number(r.rating) === ratingFilter);
    }

    // sort by embedded _id timestamp
    items = items.slice().sort((a, b) => {
      const aTime = a._id?.getTimestamp ? a._id.getTimestamp().getTime() : 0;
      const bTime = b._id?.getTimestamp ? b._id.getTimestamp().getTime() : 0;
      return sort === "oldest" ? aTime - bTime : bTime - aTime;
    });

    const total = items.length;
    const paged = items.slice(skip, skip + limit);

    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: {
        reviews: paged,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (err) {
    next(err);
  }
};

/* -------------------------- 2) POST Create Review ------------------------- */
/**
 * POST /api/restaurants/:restaurantId/reviews
 * Body: { rating, comment }
 * Protected route: auth.protect
 */
export const createReview = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const { rating, comment } = req.body;

    const user = req.user;
    if (!user?._id) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ success: false, message: "Invalid restaurantId" });
    }

    const ratingNum = Number(rating);
    if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const cleanComment = String(comment || "").trim();
    if (cleanComment.length < 2) {
      return res.status(400).json({ success: false, message: "Comment is required" });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    // Duplicate check: one user one review
    const items = restaurant.reviews?.items || [];
    const already = items.find((r) => String(r.userId) === String(user._id));
    if (already) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this restaurant",
      });
    }

    const newReview = {
      userId: user._id,
      name: user.fullName, // userModel field
      rating: ratingNum,
      date: "Just now",    // UI label (you can improve later)
      comment: cleanComment,
      avatar: "",          // user image not present in your user model
    };

    restaurant.reviews.items.push(newReview);

    // Update summary fields
    const updatedItems = restaurant.reviews.items;
    restaurant.reviews.total = updatedItems.length;
    restaurant.reviews.average = calcAverage(updatedItems);

    // Keep these sync (already in your schema)
    restaurant.reviewsCount = restaurant.reviews.total;
    restaurant.rating = restaurant.reviews.average;

    await restaurant.save();

    const created = restaurant.reviews.items[restaurant.reviews.items.length - 1];

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: created,
    });
  } catch (err) {
    next(err);
  }
};

/* -------------------------- 3) GET Rating Summary ------------------------- */
/**
 * GET /api/restaurants/:restaurantId/reviews/summary
 */
export const getRatingSummary = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ success: false, message: "Invalid restaurantId" });
    }

    const restaurant = await Restaurant.findById(restaurantId).select("reviews");
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    const items = restaurant.reviews?.items || [];

    return res.status(200).json({
      success: true,
      message: "Rating summary fetched successfully",
      data: {
        averageRating: restaurant.reviews?.average ?? 0,
        totalReviews: restaurant.reviews?.total ?? 0,
        ratingsBreakdown: calcBreakdown(items),
      },
    });
  } catch (err) {
    next(err);
  }
};