// backend/controllers/delivery/locationController.js
import asyncHandler from "express-async-handler";
import User from "../../models/User.js";

const MAX_RADIUS_KM = 20;

// @desc   Set rider's current location and delivery radius
// @route  PATCH /api/delivery/location
export const updateLocationAndRadius = asyncHandler(async (req, res) => {
  const { lat, lng, radius } = req.body;

  if (typeof lat !== "number" || typeof lng !== "number") {
    res.status(400);
    throw new Error("Please pin your location on the map");
  }
  if (typeof radius !== "number" || radius <= 0) {
    res.status(400);
    throw new Error("Please select a valid delivery radius");
  }
  if (radius > MAX_RADIUS_KM) {
    res.status(400);
    throw new Error(`Maximum delivery radius is ${MAX_RADIUS_KM} km`);
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { currentLocation: { lat, lng }, deliveryRadius: radius },
    { new: true }
  );

  res.status(200).json({
    message: "Delivery range updated",
    currentLocation: user.currentLocation,
    deliveryRadius: user.deliveryRadius,
  });
});

// @desc   Get rider's current saved location and radius
// @route  GET /api/delivery/location
export const getLocationAndRadius = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    currentLocation: user.currentLocation,
    deliveryRadius: user.deliveryRadius,
    maxRadius: MAX_RADIUS_KM,
  });
});