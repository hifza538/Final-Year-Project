import asyncHandler from "express-async-handler";
import User from "../../models/User.js";

// Safe fields to return in response
const profileResponse = (vendor) => ({
  _id:          vendor._id,
  fullName:     vendor.fullName,
  email:        vendor.email,
  phone:        vendor.phone,
  role:         vendor.role,
  shopName:     vendor.shopName,
  shopAddress:  vendor.shopAddress,
  city:         vendor.city,
  zone:         vendor.zone,
  cuisine:      vendor.cuisine,
  coverPhoto:   vendor.coverPhoto,
  logo:         vendor.logo,
  minPrepTime:  vendor.minPrepTime,
  maxPrepTime:  vendor.maxPrepTime,
  openingTime:  vendor.openingTime,
  closingTime:  vendor.closingTime,
  serviceTypes: vendor.serviceTypes,
  isApproved:   vendor.isApproved,
  isActive:     vendor.isActive,
});

/* @desc    Get vendor profile
   @route   GET /api/vendor/profile
   @access  Private (vendor) */
export const getProfile = asyncHandler(async (req, res) => {
  const vendor = await User.findById(req.user._id);

  if (!vendor) {
    res.status(404);
    throw new Error("Vendor not found");
  }

  res.status(200).json({ vendor: profileResponse(vendor) });
});

/* @desc    Update vendor profile
   @route   PUT /api/vendor/profile
   @access  Private (vendor) */
export const updateProfile = asyncHandler(async (req, res) => {
  const vendor = await User.findById(req.user._id);

  if (!vendor) {
    res.status(404);
    throw new Error("Vendor not found");
  }

  const {
    shopName,
    shopAddress,
    city,
    zone,
    cuisine,
    openingTime,
    closingTime,
    minPrepTime,
    maxPrepTime,
    serviceTypes,
  } = req.body;

  // validation
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

  if (shopName !== undefined) {
    if (!shopName.trim()) {
      res.status(400);
      throw new Error("Shop name cannot be empty");
    }
    if (shopName.trim().length < 3 || shopName.trim().length > 100) {
      res.status(400);
      throw new Error("Shop name must be between 3 and 100 characters");
    }
  }

  if (shopAddress !== undefined) {
    if (!shopAddress.trim()) {
      res.status(400);
      throw new Error("Shop address cannot be empty");
    }
    if (shopAddress.trim().length < 10) {
      res.status(400);
      throw new Error("Please provide a complete address");
    }
  }

  if (openingTime !== undefined && !timeRegex.test(openingTime)) {
    res.status(400);
    throw new Error("Opening time must be in HH:MM format");
  }

  if (closingTime !== undefined && !timeRegex.test(closingTime)) {
    res.status(400);
    throw new Error("Closing time must be in HH:MM format");
  }

  if (openingTime && closingTime && openingTime >= closingTime) {
    res.status(400);
    throw new Error("Closing time must be after opening time");
  }

  if (minPrepTime !== undefined && (Number(minPrepTime) < 5 || Number(minPrepTime) > 120)) {
    res.status(400);
    throw new Error("Minimum prep time must be between 5 and 120 minutes");
  }

  if (maxPrepTime !== undefined && Number(maxPrepTime) < Number(minPrepTime || vendor.minPrepTime)) {
    res.status(400);
    throw new Error("Maximum prep time must be greater than minimum prep time");
  }

  // update fields if provided
  if (shopName     !== undefined) vendor.shopName    = shopName.trim();
  if (shopAddress  !== undefined) vendor.shopAddress = shopAddress.trim();
  if (city         !== undefined) vendor.city        = city.trim();
  if (zone         !== undefined) vendor.zone        = zone.trim();
  if (cuisine      !== undefined) vendor.cuisine     = cuisine.trim();
  if (openingTime  !== undefined) vendor.openingTime = openingTime;
  if (closingTime  !== undefined) vendor.closingTime = closingTime;
  if (minPrepTime  !== undefined) vendor.minPrepTime = Number(minPrepTime);
  if (maxPrepTime  !== undefined) vendor.maxPrepTime = Number(maxPrepTime);
  if (serviceTypes !== undefined) vendor.serviceTypes = serviceTypes;

  const updated = await vendor.save();

  res.status(200).json({
    message: "Profile updated successfully",
    vendor:  profileResponse(updated),
  });
});