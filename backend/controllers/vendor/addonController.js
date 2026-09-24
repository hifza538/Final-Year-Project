// backend/controllers/vendor/addonController.js

import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import AddonGroup from "../../models/AddonGroup.js";
import MenuItem from "../../models/MenuItem.js";

const fail = (res, status, message) => {
  res.status(status);
  throw new Error(message);
};

const toPrice = (res, value, what) => {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n) || n < 0) fail(res, 400, `${what} must be 0 or more`);
  return n;
};

// Validate + clean the request body for create and update
const cleanGroupBody = (res, body) => {
  const name = String(body.name ?? "").trim();
  if (name.length < 2 || name.length > 50) {
    fail(res, 400, "Group name must be between 2 and 50 characters");
  }

  const minSelect = Number(body.minSelect ?? 0);
  const maxSelect = Number(body.maxSelect ?? 0);
  if (!Number.isInteger(minSelect) || minSelect < 0 || !Number.isInteger(maxSelect) || maxSelect < 0) {
    fail(res, 400, "Min and max selection must be whole numbers (0 or more)");
  }
  if (maxSelect > 0 && maxSelect < minSelect) {
    fail(res, 400, "Max selection cannot be less than min selection");
  }

  if (!Array.isArray(body.options) || body.options.length === 0) {
    fail(res, 400, "Add at least one option");
  }
  if (body.options.length > 40) fail(res, 400, "A group can have at most 40 options");
  if (minSelect > body.options.length) {
    fail(res, 400, "Min selection cannot be more than the number of options");
  }

  const options = body.options.map((o) => {
    const optName = String(o.name ?? "").trim();
    if (!optName || optName.length > 60) {
      fail(res, 400, "Every option needs a name (max 60 characters)");
    }
    const cleaned = {
      name:        optName,
      price:       toPrice(res, o.price, `Price of "${optName}"`),
      isAvailable: o.isAvailable !== false,
      sizePrices:  (Array.isArray(o.sizePrices) ? o.sizePrices : []).map((s) => {
        const label = String(s.label ?? "").trim();
        if (!label) fail(res, 400, "Every size price needs a size label");
        return { label, price: toPrice(res, s.price, `Price of "${optName}" for ${label}`) };
      }),
    };
    if (o._id && mongoose.isValidObjectId(o._id)) cleaned._id = o._id;
    return cleaned;
  });

  return { name, minSelect, maxSelect, options, isActive: body.isActive !== false };
};

// @route GET /api/vendor/addon-groups
export const getAddonGroups = asyncHandler(async (req, res) => {
  const addonGroups = await AddonGroup.find({ vendor: req.user._id }).sort({ createdAt: 1 });
  res.status(200).json({ addonGroups });
});

// @route POST /api/vendor/addon-groups
export const addAddonGroup = asyncHandler(async (req, res) => {
  const data = cleanGroupBody(res, req.body);
  const addonGroup = await AddonGroup.create({ ...data, vendor: req.user._id });
  res.status(201).json({ message: "Add-on group created", addonGroup });
});

// @route PUT /api/vendor/addon-groups/:id
export const updateAddonGroup = asyncHandler(async (req, res) => {
  const group = await AddonGroup.findOne({ _id: req.params.id, vendor: req.user._id });
  if (!group) fail(res, 404, "Add-on group not found");

  const data = cleanGroupBody(res, req.body);
  group.set(data);
  await group.save();

  res.status(200).json({ message: "Add-on group updated", addonGroup: group });
});

// @route DELETE /api/vendor/addon-groups/:id
export const deleteAddonGroup = asyncHandler(async (req, res) => {
  const group = await AddonGroup.findOne({ _id: req.params.id, vendor: req.user._id });
  if (!group) fail(res, 404, "Add-on group not found");

  // Detach from every item that uses it, then delete
  await MenuItem.updateMany(
    { vendor: req.user._id, addonGroups: group._id },
    { $pull: { addonGroups: group._id } }
  );
  await group.deleteOne();

  res.status(200).json({ message: "Add-on group deleted" });
});
