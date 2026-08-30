import asyncHandler from "express-async-handler";
import MenuItem from "../../models/MenuItem.js";
import { deleteFromCloudinary } from "../../config/cloudinary.js";

/* @desc    Get all menu items of logged in vendor
   @route   GET /api/vendor/menu
   @access  Private (vendor)*/
export const getMenuItems = asyncHandler(async (req, res) => {
  const items = await MenuItem.find({ vendor: req.user._id })
    .sort({ createdAt: -1 });

  res.status(200).json({ items });
});

/* @desc    Add new menu item
   @route   POST /api/vendor/menu
   @access  Private (vendor)*/
export const addMenuItem = asyncHandler(async (req, res) => {
  const { name, description, price, category } = req.body;
  const imageFile = req.file;

  // require fields
  if (!name?.trim()) {
    res.status(400);
    throw new Error("Item name is required");
  }
  if (!price) {
    res.status(400);
    throw new Error("Price is required");
  }
  if (!category) {
    res.status(400);
    throw new Error("Category is required");
  }

  // validation
  if (name.trim().length < 2 || name.trim().length > 100) {
    res.status(400);
    throw new Error("Name must be between 2 and 100 characters");
  }
  if (Number(price) <= 0) {
    res.status(400);
    throw new Error("Price must be greater than 0");
  }
  if (description && description.trim().length > 500) {
    res.status(400);
    throw new Error("Description must not exceed 500 characters");
  }

  // validate category against allowed categories
  const validCategories = [
    "Burgers", "Pizza", "Biryani", "Drinks",
    "Desserts", "Sides", "Salads", "Breakfast", "Other",
  ];
  if (!validCategories.includes(category)) {
    res.status(400);
    throw new Error("Invalid category selected");
  }

  // create menu item
  const item = await MenuItem.create({
    vendor:      req.user._id,
    name:        name.trim(),
    description: description?.trim() || "",
    price:       Number(price),
    category,
    image: imageFile
      ? { url: imageFile.path, publicId: imageFile.filename }
      : { url: "", publicId: "" },
    inStock: true,
  });

  res.status(201).json({
    message: "Menu item added successfully",
    item,
  });
});

/* @desc    Update menu item
   @route   PUT /api/vendor/menu/:id
   @access  Private (vendor) */
export const updateMenuItem = asyncHandler(async (req, res) => {
  // Find item - make sure it belongs to this vendor
  const item = await MenuItem.findOne({
    _id:    req.params.id,
    vendor: req.user._id,
  });

  if (!item) {
    res.status(404);
    throw new Error("Menu item not found");
  }

  const { name, description, price, category } = req.body;
  const imageFile = req.file;

  // validation
  if (name !== undefined) {
    if (!name.trim()) {
      res.status(400);
      throw new Error("Item name cannot be empty");
    }
    if (name.trim().length < 2 || name.trim().length > 100) {
      res.status(400);
      throw new Error("Name must be between 2 and 100 characters");
    }
  }

  if (price !== undefined && Number(price) <= 0) {
    res.status(400);
    throw new Error("Price must be greater than 0");
  }

  if (description !== undefined && description.trim().length > 500) {
    res.status(400);
    throw new Error("Description must not exceed 500 characters");
  }

  // update fields if provided
  if (name        !== undefined) item.name        = name.trim();
  if (description !== undefined) item.description = description.trim();
  if (price       !== undefined) item.price       = Number(price);
  if (category    !== undefined) item.category    = category;

  // update image if a new one is uploaded
  if (imageFile) {
    // Delete old image from Cloudinary
    if (item.image?.publicId) {
      await deleteFromCloudinary(item.image.publicId);
    }
    item.image = {
      url:      imageFile.path,
      publicId: imageFile.filename,
    };
  }

  const updated = await item.save();

  res.status(200).json({
    message: "Menu item updated successfully",
    item:    updated,
  });
});

/* @desc    Delete menu item
   @route   DELETE /api/vendor/menu/:id
   @access  Private (vendor) */
export const deleteMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findOne({
    _id:    req.params.id,
    vendor: req.user._id,
  });

  if (!item) {
    res.status(404);
    throw new Error("Menu item not found");
  }

  // Delete image from Cloudinary
  if (item.image?.publicId) {
    await deleteFromCloudinary(item.image.publicId);
  }

  await item.deleteOne();

  res.status(200).json({
    message: "Menu item deleted successfully",
  });
});

/* @desc    Toggle item in stock / out of stock
   @route   PATCH /api/vendor/menu/:id/toggle-stock
   @access  Private (vendor) */
export const toggleStock = asyncHandler(async (req, res) => {
  const item = await MenuItem.findOne({
    _id:    req.params.id,
    vendor: req.user._id,
  });

  if (!item) {
    res.status(404);
    throw new Error("Menu item not found");
  }

  // toggle stock status
  item.inStock = !item.inStock;
  await item.save();

  res.status(200).json({
    message: `Item marked as ${item.inStock ? "In Stock" : "Out of Stock"}`,
    item,
  });
});