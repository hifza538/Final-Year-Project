// backend/controllers/admin/cuisineController.js
import asyncHandler from "express-async-handler";
import Cuisine from "../../models/Cuisine.js";
import User from "../../models/User.js";
import { deleteFromCloudinary } from "../../config/cloudinary.js";

const fail = (res, status, message) => {
  res.status(status);
  throw new Error(message);
};

const cleanName = (res, name) => {
  const clean = String(name ?? "").trim();
  if (clean.length < 2 || clean.length > 50) {
    fail(res, 400, "Cuisine name must be between 2 and 50 characters");
  }
  return clean;
};

const handleDuplicate = (res, err, name) => {
  if (err.code === 11000) fail(res, 409, `Cuisine "${name}" already exists`);
  throw err;
};

// @route GET /api/admin/cuisines
export const getCuisines = asyncHandler(async (req, res) => {
  const cuisines = await Cuisine.find({}).sort({ name: 1 });
  res.status(200).json({ cuisines });
});

// @route POST /api/admin/cuisines   (name + required image)
export const createCuisine = asyncHandler(async (req, res) => {
  const name = cleanName(res, req.body.name);
  if (!req.file) fail(res, 400, "Image is required");

  try {
    const cuisine = await Cuisine.create({
      name,
      createdBy: req.user._id,
      image: { url: req.file.path, publicId: req.file.filename },
    });
    res.status(201).json({ message: "Cuisine added", cuisine });
  } catch (err) {
    handleDuplicate(res, err, name);
  }
});

// @route PATCH /api/admin/cuisines/:id   (isActive toggle - Hide/Unhide)
export const updateCuisine = asyncHandler(async (req, res) => {
  const cuisine = await Cuisine.findById(req.params.id);
  if (!cuisine) fail(res, 404, "Cuisine not found");

  if (req.body.isActive !== undefined) cuisine.isActive = !!req.body.isActive;
  await cuisine.save();

  res.status(200).json({ message: "Cuisine updated", cuisine });
});

// @route PATCH /api/admin/cuisines/:id/details   (rename + optional new image)
export const updateCuisineDetails = asyncHandler(async (req, res) => {
  const cuisine = await Cuisine.findById(req.params.id);
  if (!cuisine) fail(res, 404, "Cuisine not found");

  if (req.body.name !== undefined) cuisine.name = cleanName(res, req.body.name);

  if (req.file) {
    if (cuisine.image?.publicId) await deleteFromCloudinary(cuisine.image.publicId);
    cuisine.image = { url: req.file.path, publicId: req.file.filename };
  }

  try {
    await cuisine.save();
    res.status(200).json({ message: "Cuisine updated", cuisine });
  } catch (err) {
    handleDuplicate(res, err, cuisine.name);
  }
});

// @route DELETE /api/admin/cuisines/:id
export const deleteCuisine = asyncHandler(async (req, res) => {
  const cuisine = await Cuisine.findById(req.params.id);
  if (!cuisine) fail(res, 404, "Cuisine not found");

  const vendorCount = await User.countDocuments({ role: "vendor", cuisines: cuisine._id });
  if (vendorCount > 0) {
    fail(res, 400, `${vendorCount} restaurant(s) still use this cuisine. Hide it instead.`);
  }

  if (cuisine.image?.publicId) await deleteFromCloudinary(cuisine.image.publicId);
  await cuisine.deleteOne();

  res.status(200).json({ message: "Cuisine deleted" });
});