// backend/controllers/customer/addressController.js

import asyncHandler from "express-async-handler";
import User from "../../models/User.js";

const phoneRegex = /^(\+92|0)?3\d{9}$/;

/*@desc   Get all saved addresses for the logged-in customer
@route  GET /api/customer/addresses*/
export const getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({ addresses: user.addresses });
});

/*@desc   Add a new saved address
@route  POST /api/customer/addresses*/
export const addAddress = asyncHandler(async (req, res) => {
  const { label, fullName, phone, address, city, notes, isDefault } = req.body;

  if (!fullName?.trim() || !phone?.trim() || !address?.trim() || !city?.trim()) {
    res.status(400);
    throw new Error("Full name, phone, address and city are required");
  }
  if (!phoneRegex.test(phone.trim())) {
    res.status(400);
    throw new Error("Please enter a valid Pakistani phone number e.g. 03001234567");
  }
  if (address.trim().length < 10) {
    res.status(400);
    throw new Error("Please provide a complete address (minimum 10 characters)");
  }
  if (!city.trim()) {
    res.status(400);
    throw new Error("City cannot be empty");
  }

  const user = await User.findById(req.user._id);

// Determine if this new address should be the default one
  const shouldBeDefault = isDefault || user.addresses.length === 0;
  if (shouldBeDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }

  user.addresses.push({
    label: label?.trim() || "Home",
    fullName: fullName.trim(),
    phone: phone.trim(),
    address: address.trim(),
    city: city.trim(),
    notes: notes?.trim() || "",
    isDefault: shouldBeDefault,
  });

  await user.save();

  res.status(201).json({
    message: "Address added successfully",
    addresses: user.addresses,
  });
});

/*@desc   Update a saved address
@route  PUT /api/customer/addresses/:addressId*/
export const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const addr = user.addresses.id(req.params.addressId);

  if (!addr) {
    res.status(404);
    throw new Error("Address not found");
  }

  const { label, fullName, phone, address, city, notes, isDefault } = req.body;

  if (fullName !== undefined) {
    if (!fullName.trim()) {
      res.status(400);
      throw new Error("Full name cannot be empty");
    }
    addr.fullName = fullName.trim();
  }
  if (phone !== undefined) {
    if (!phoneRegex.test(phone.trim())) {
      res.status(400);
      throw new Error("Please enter a valid Pakistani phone number e.g. 03001234567");
    }
    addr.phone = phone.trim();
  }
  if (address !== undefined) {
    if (address.trim().length < 10) {
      res.status(400);
      throw new Error("Please provide a complete address");
    }
    addr.address = address.trim();
  }
  if (city !== undefined) {
    if (!city.trim()) {
      res.status(400);
      throw new Error("City cannot be empty");
    }
    addr.city = city.trim();
  }
  if (label !== undefined) addr.label = label.trim();
  if (notes !== undefined) addr.notes = notes.trim();

  if (isDefault === true) {
    user.addresses.forEach((a) => (a.isDefault = false));
    addr.isDefault = true;
  }

  await user.save();

  res.status(200).json({
    message: "Address updated successfully",
    addresses: user.addresses,
  });
});

/*@desc   Delete a saved address
@route  DELETE /api/customer/addresses/:addressId*/
export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const addr = user.addresses.id(req.params.addressId);

  if (!addr) {
    res.status(404);
    throw new Error("Address not found");
  }

  const wasDefault = addr.isDefault;
  addr.deleteOne();

  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();

  res.status(200).json({
    message: "Address deleted successfully",
    addresses: user.addresses,
  });
});