//backend/controllers/public/categoryController.js
import asyncHandler from "express-async-handler";
import Category from "../../models/Category.js";

// get all active categories for public use
export const getActiveCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true })
    .select("name slug")
    .sort({ name: 1 });

  res.status(200).json({ categories });
});