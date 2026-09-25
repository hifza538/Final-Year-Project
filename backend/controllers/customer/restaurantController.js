// backend/controllers/customer/restaurantController.js

import asyncHandler from "express-async-handler";
import User from "../../models/User.js";
import Cuisine from "../../models/Cuisine.js";
import MenuItem from "../../models/MenuItem.js";
import Review from "../../models/Review.js";
import { getDistanceKm } from "../../utils/distance.js";

// Helper function to format restaurant response for the customer frontend
const restaurantResponse = (vendor, distanceKm = null) => {
  const cuisines = (vendor.cuisines || []).map((cuisine) =>
    typeof cuisine === "string" ? cuisine : cuisine.name
  ).filter(Boolean);
  if (cuisines.length === 0 && vendor.cuisine) cuisines.push(vendor.cuisine);

  return {
  _id: vendor._id,
  shopName: vendor.shopName,
  cuisines,
  cuisine: cuisines[0] || "",
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
  deliveryRadius: vendor.deliveryRadius,
  distanceKm: distanceKm !== null ? Number(distanceKm.toFixed(1)) : null,
  };
};

/* @desc   Get all approved, active restaurants (public, no login required)
@route  GET /api/customer/restaurants*/
export const getAllRestaurants = asyncHandler(async (req, res) => {
  const { search, cuisine, lat, lng } = req.query;

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
    const matchingCuisine = await Cuisine.findOne({
      name: { $regex: `^${cuisine.trim()}$`, $options: "i" },
      isActive: true,
    }).select("_id");
    filter.$or = matchingCuisine
      ? [{ cuisines: matchingCuisine._id }, { cuisine: matchingCuisine.name }]
      : [{ _id: null }];
  }

  const vendors = await User.find(filter).populate("cuisines", "name").sort({ createdAt: -1 });

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

  const customerLat = lat !== undefined ? Number(lat) : null;
  const customerLng = lng !== undefined ? Number(lng) : null;
  const hasCustomerLocation =
    customerLat !== null && customerLng !== null && !Number.isNaN(customerLat) && !Number.isNaN(customerLng);

  let restaurants = vendors.map((vendor) => {
    const ratingInfo = ratingMap[vendor._id.toString()];
    let distanceKm = null;
    if (hasCustomerLocation && vendor.coordinates?.lat != null && vendor.coordinates?.lng != null) {
      distanceKm = getDistanceKm(customerLat, customerLng, vendor.coordinates.lat, vendor.coordinates.lng);
    }
    return {
      ...restaurantResponse(vendor, distanceKm),
      averageRating: ratingInfo?.avgRating || null,
      reviewCount: ratingInfo?.count || 0,
    };
  });
   if (hasCustomerLocation) {
    // Filter out restaurants that are beyond their delivery radius and sort by distance
    restaurants = restaurants
      .filter((r) => r.distanceKm !== null && r.distanceKm <= (r.deliveryRadius ?? 3))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }

  res.status(200).json({
    count: restaurants.length,
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
  }).populate("cuisines", "name");

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


/* @desc   Get menu items for a specific restaurant, grouped by category
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

  // Categories are global/shared across the platform - fetch this vendor's
  // items first, then group them under whichever categories they actually use
  // (in the platform-wide category order set by admin).
  const items = await MenuItem.find({
    vendor: req.params.id,
    category: { $type: "objectId" },
  })
    .populate({ path: "addonGroups", match: { isActive: true } })
    .populate({ path: "category", match: { isActive: true }, select: "name slug sortOrder" })
    .sort({ createdAt: -1 })
    .lean();

  const itemsByCategory = new Map();
  items.forEach((item) => {
    if (!item.category) return; // category was hidden by admin - don't show the item
    const key = String(item.category._id);
    if (!itemsByCategory.has(key)) itemsByCategory.set(key, { ...item.category, items: [] });
    itemsByCategory.get(key).items.push(item);
  });

  const menu = [...itemsByCategory.values()].sort(
    (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)
  );

  res.status(200).json({
    restaurant: restaurantResponse(vendor),
    menu,
  });
});