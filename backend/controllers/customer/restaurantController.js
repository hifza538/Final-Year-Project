// backend/controllers/customer/restaurantController.js

import asyncHandler from "express-async-handler";
import User from "../../models/User.js";
import MenuItem from "../../models/MenuItem.js";
import Review from "../../models/Review.js";

// Helper function to format restaurant response for the customer frontend
const restaurantResponse = (vendor) => ({
  _id: vendor._id,
  shopName: vendor.shopName,
  cuisine: vendor.cuisine,
  city: vendor.city,
  zone: vendor.zone,
  shopAddress: vendor.shopAddress,
  coverPhoto: vendor.coverPhoto?.url || "",
  logo: vendor.logo?.url || "",
  isOpen: vendor.isOpen,
  minPrepTime: vendor.minPrepTime,
  maxPrepTime: vendor.maxPrepTime,
  deliveryFee: vendor.deliveryFee,
  openingTime: vendor.openingTime,
  closingTime: vendor.closingTime,
});

/* @desc   Get all approved, active restaurants (public, no login required)
@route  GET /api/customer/restaurants*/
export const getAllRestaurants = asyncHandler(async (req, res) => {
  const { search, cuisine } = req.query;

  /* Base filter, only show vendors that are approved by admin and not deactivated.
   intentionally do NOT filter out isOpen:false 
   closed restaurants are still shown, just marked with a "Closed" badge on the frontend.
   customer can see closed restaurnt but can't order*/
  const filter = {
    role: "vendor",
    isApproved: true,
    isActive: true,
  };

  // Optional search by shop name (case-insensitive partial match)
  if (search?.trim()) {
    filter.shopName = { $regex: search.trim(), $options: "i" };
  }

  // Optional filter by cuisine
  if (cuisine?.trim() && cuisine.trim() !== "All") {
    filter.cuisine = { $regex: `^${cuisine.trim()}$`, $options: "i" };
  }

  const vendors = await User.find(filter).sort({ createdAt: -1 });

// Aggregate reviews to compute average rating and review count for each restaurant
  const vendorIds = vendors.map((v) => v._id);
  const ratingAggregates = await Review.aggregate([
    { $match: { vendor: { $in: vendorIds } } },
    { $group: { _id: "$vendor", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  const ratingMap = {};
  ratingAggregates.forEach((r) => {
    ratingMap[r._id.toString()] = { avgRating: r.avgRating.toFixed(1), count: r.count };
  });

  const restaurants = vendors.map((vendor) => {
    const ratingInfo = ratingMap[vendor._id.toString()];
    return {
      ...restaurantResponse(vendor),
      averageRating: ratingInfo?.avgRating || null,
      reviewCount: ratingInfo?.count || 0,
    };
  });

  res.status(200).json({
    count: vendors.length,
    restaurants,
  });
});

/* @desc   Get a single restaurant's public details (for the restaurant detail page)
  @route  GET /api/customer/restaurants/:id */
export const getRestaurantById = asyncHandler(async (req, res) => {
  const vendor = await User.findOne({
    _id: req.params.id,
    role: "vendor",
    isApproved: true,
    isActive: true,
  });

  if (!vendor) {
    res.status(404);
    throw new Error("Restaurant not found");
  }

  const reviews = await Review.find({ vendor: vendor._id });
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  res.status(200).json({ restaurant: restaurantResponse(vendor), averageRating, reviewCount: reviews.length });
});

/* @desc   Get distinct cuisine types from approved restaurants (for filter chips)
 @route  GET /api/customer/restaurants/cuisines*/
export const getAvailableCuisines = asyncHandler(async (req, res) => {
  const cuisines = await User.distinct("cuisine", {
    role: "vendor",
    isApproved: true,
    isActive: true,
    cuisine: { $ne: "" },
  });

  res.status(200).json({ cuisines });
});

/* @desc   Get menu items for a specific restaurant
@route  GET /api/customer/restaurants/:id/menu */
export const getRestaurantMenu = asyncHandler(async (req, res) => {
  // First confirm the restaurant exists and is a valid, approved vendor
  const vendor = await User.findOne({
    _id: req.params.id,
    role: "vendor",
    isApproved: true,
    isActive: true,
  });
  if (!vendor) {
    res.status(404);
    throw new Error("Restaurant not found");
  }

  // Return all menu items 
  const items = await MenuItem.find({ vendor: req.params.id }).sort({ category: 1, createdAt: -1 });

  res.status(200).json({
    restaurant: restaurantResponse(vendor),
    items,
  });
});