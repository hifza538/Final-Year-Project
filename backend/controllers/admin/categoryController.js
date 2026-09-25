import asyncHandler from "express-async-handler";
import Category from "../../models/Category.js";
import MenuItem from "../../models/MenuItem.js";

export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.status(200).json({ categories });
});

export const createCategory = asyncHandler(async (req, res) => {
  const name = String(req.body.name ?? "").trim();
  if (!name) { res.status(400); throw new Error("Category name is required"); }
  const category = await Category.create({ name, createdBy: req.user._id });
  res.status(201).json({ category, message: "Category created" });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) { res.status(404); throw new Error("Category not found"); }
  if (req.body.name !== undefined) category.name = String(req.body.name).trim();
  if (typeof req.body.isActive === "boolean") category.isActive = req.body.isActive;
  await category.save();
  res.status(200).json({ category, message: "Category updated" });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) { res.status(404); throw new Error("Category not found"); }
  const itemCount = await MenuItem.countDocuments({ category: category._id });
  if (itemCount > 0) {
    res.status(400);
    throw new Error(`${itemCount} menu item(s) still use this category. Hide it instead.`);
  }
  await category.deleteOne();
  res.status(200).json({ message: "Category deleted" });
});