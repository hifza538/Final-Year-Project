import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import MenuItem from "../../models/MenuItem.js";
import Category from "../../models/Category.js";
import AddonGroup from "../../models/AddonGroup.js";
import { deleteFromCloudinary } from "../../config/cloudinary.js";

const fail = (res, status, message) => {
  res.status(status);
  throw new Error(message);
};

// multipart/form-data sends arrays as JSON strings
const parseJSON = (value) => {
  if (typeof value !== "string") return value;
  try { return JSON.parse(value); } catch { return null; }
};

// Validate + clean the variants (sizes/prices) array
const cleanVariants = (res, raw) => {
  if (!Array.isArray(raw) || raw.length === 0) fail(res, 400, "At least one price is required");
  if (raw.length > 10) fail(res, 400, "An item can have at most 10 sizes");

  const seen = new Set();
  return raw.map((v) => {
    const label = String(v.label ?? "").trim() || (raw.length === 1 ? "Regular" : "");
    if (!label) fail(res, 400, "Every size needs a label");
    if (label.length > 40) fail(res, 400, "Size label must not exceed 40 characters");
    if (seen.has(label.toLowerCase())) fail(res, 400, `Duplicate size "${label}"`);
    seen.add(label.toLowerCase());

    const price = Number(v.price);
    if (!Number.isFinite(price) || price <= 0) {
      fail(res, 400, `Price for "${label}" must be greater than 0`);
    }

    const cleaned = { label, price, isAvailable: v.isAvailable !== false };
    // keep the _id of existing variants so nothing referencing them breaks
    if (v._id && mongoose.isValidObjectId(v._id)) cleaned._id = v._id;
    return cleaned;
  });
};

// Make sure every attached add-on group really belongs to this vendor
const cleanAddonGroupIds = async (res, vendorId, raw) => {
  if (!Array.isArray(raw)) return [];
  const ids = [...new Set(raw.map(String))];
  if (ids.some((id) => !mongoose.isValidObjectId(id))) fail(res, 400, "Invalid add-on group");
  const count = await AddonGroup.countDocuments({ _id: { $in: ids }, vendor: vendorId });
  if (count !== ids.length) fail(res, 400, "Invalid add-on group");
  return ids;
};

// Category is a GLOBAL list managed by admin - just confirm it exists and is active,
// no vendor ownership check (vendors don't own categories, they only pick from them).
const assertCategory = async (res, categoryId) => {
  if (!categoryId || !mongoose.isValidObjectId(categoryId)) fail(res, 400, "Category is required");
  const category = await Category.findOne({ _id: categoryId, isActive: true });
  if (!category) fail(res, 400, "Invalid category selected");
};

// old clients may still send a single `price` - treat it as one "Regular" variant
const readVariants = (body) => {
  if (body.variants !== undefined) return parseJSON(body.variants);
  if (body.price !== undefined && body.price !== "") return [{ label: "Regular", price: body.price }];
  return undefined;
};

// get all menu items for the logged-in vendor
export const getMenuItems = asyncHandler(async (req, res) => {
  const items = await MenuItem.find({
    vendor: req.user._id,
    category: { $type: "objectId" },
  })
    .populate("category", "name")
    .sort({ createdAt: -1 });

  res.status(200).json({ items });
});

// add new menu item
export const addMenuItem = asyncHandler(async (req, res) => {
  const { name, description, category } = req.body;
  const imageFile = req.file;

  // require fields
  if (!name?.trim()) fail(res, 400, "Item name is required");

  // validation
  if (name.trim().length < 2 || name.trim().length > 100) {
    fail(res, 400, "Name must be between 2 and 100 characters");
  }
  if (description && description.trim().length > 500) {
    fail(res, 400, "Description must not exceed 500 characters");
  }

  await assertCategory(res, category);
  const variants    = cleanVariants(res, readVariants(req.body));
  const addonGroups = await cleanAddonGroupIds(res, req.user._id, parseJSON(req.body.addonGroups) ?? []);

  // create menu item
  const item = await MenuItem.create({
    vendor:      req.user._id,
    name:        name.trim(),
    description: description?.trim() || "",
    category,
    variants,
    addonGroups,
    image: imageFile
      ? { url: imageFile.path, publicId: imageFile.filename }
      : { url: "", publicId: "" },
    inStock: true,
  });

  await item.populate("category", "name");

  res.status(201).json({
    message: "Menu item added successfully",
    item,
  });
});

// update menu item
export const updateMenuItem = asyncHandler(async (req, res) => {
  // Find item - make sure it belongs to this vendor
  const item = await MenuItem.findOne({
    _id:    req.params.id,
    vendor: req.user._id,
  });

  if (!item) fail(res, 404, "Menu item not found");

  const { name, description, category } = req.body;
  const imageFile = req.file;

  // validation
  if (name !== undefined) {
    if (!name.trim()) fail(res, 400, "Item name cannot be empty");
    if (name.trim().length < 2 || name.trim().length > 100) {
      fail(res, 400, "Name must be between 2 and 100 characters");
    }
  }
  if (description !== undefined && description.trim().length > 500) {
    fail(res, 400, "Description must not exceed 500 characters");
  }
  if (category !== undefined) await assertCategory(res, category);

  const rawVariants = readVariants(req.body);
  if (rawVariants !== undefined) item.variants = cleanVariants(res, rawVariants);

  if (req.body.addonGroups !== undefined) {
    item.addonGroups = await cleanAddonGroupIds(res, req.user._id, parseJSON(req.body.addonGroups) ?? []);
  }

  // update fields if provided
  if (name        !== undefined) item.name        = name.trim();
  if (description !== undefined) item.description = description.trim();
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
  await updated.populate("category", "name");

  res.status(200).json({
    message: "Menu item updated successfully",
    item:    updated,
  });
});

// delete menu item
export const deleteMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findOne({
    _id:    req.params.id,
    vendor: req.user._id,
  });

  if (!item) fail(res, 404, "Menu item not found");

  // Delete image from Cloudinary
  if (item.image?.publicId) {
    await deleteFromCloudinary(item.image.publicId);
  }

  await item.deleteOne();

  res.status(200).json({
    message: "Menu item deleted successfully",
  });
});

// toggle stock status of menu item
export const toggleStock = asyncHandler(async (req, res) => {
  const item = await MenuItem.findOne({
    _id:    req.params.id,
    vendor: req.user._id,
  }).populate("category", "name");

  if (!item) fail(res, 404, "Menu item not found");

  // toggle stock status
  item.inStock = !item.inStock;
  await item.save();

  res.status(200).json({
    message: `Item marked as ${item.inStock ? "In Stock" : "Out of Stock"}`,
    item,
  });
});
