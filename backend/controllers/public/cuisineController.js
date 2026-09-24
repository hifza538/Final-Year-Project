// backend/controllers/public/cuisineController.js
import asyncHandler from "express-async-handler";
import Cuisine from "../../models/Cuisine.js";

// @route GET /api/cuisines
export const getActiveCuisines = asyncHandler(async (req, res) => {
  const cuisines = await Cuisine.find({ isActive: true }).sort({ name: 1 });
  res.status(200).json({ cuisines });
});