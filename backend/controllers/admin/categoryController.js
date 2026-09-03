//backend/controllers/admin/categoryController.js
import asyncHandler from "express-async-handler";
import Category from "../../models/Category.js";

// get all categories
export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.status(200).json({ categories });
});

// create a new category
export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name?.trim()) {
    res.status(400);
    throw new Error("Category name is required");
  }

  const existing = await Category.findOne({ name: name.trim() });
  if (existing) {
    res.status(400);
    throw new Error("This category already exists");
  }

  const category = await Category.create({
    name: name.trim(),
    createdBy: req.user._id,
  });

  res.status(201).json({ category, message: "Category created" });
});

// update a category
export const updateCategory = asyncHandler(async (req, res) => {
  const { name, isActive } = req.body;

  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  if (name?.trim()) {
    const existing = await Category.findOne({
      name: name.trim(),
      _id: { $ne: category._id },
    });
    if (existing) {
      res.status(400);
      throw new Error("Another category with this name already exists");
    }
    category.name = name.trim();
  }

  if (typeof isActive === "boolean") {
    category.isActive = isActive;
  }

  await category.save();
  res.status(200).json({ category, message: "Category updated" });
});

// delete a category
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  await category.deleteOne();
  res.status(200).json({ message: "Category deleted" });
});