import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";

// generate token for user authentication
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// format user response to exclude sensitive information
const userResponse = (user) => ({
  _id:          user._id,
  fullName:     user.fullName,
  email:        user.email,
  phone:        user.phone,
  role:         user.role,
  shopName:     user.shopName,
  shopLocation: user.shopLocation,
  openingTime:  user.openingTime,
  closingTime:  user.closingTime,
  serviceTypes: user.serviceTypes,
  isApproved:   user.isApproved,
  isActive:     user.isActive,
});

/* ─────────────────────────────────────────────────────────
   @desc    Register new vendor
   @route   POST /api/auth/register
   @access  Public
───────────────────────────────────────────────────────── */
export const registerVendor = asyncHandler(async (req, res) => {
  const {
    // Owner info
    firstName, lastName, email, password, phone,

    // Basic details
    shopName, cuisine, city, zone, shopAddress,
    minPrepTime, maxPrepTime,
    coverPhoto, logo,
    coordinates,

    // Legal
    cnicNumber, ntnNumber, hasFoodLicense,
    cnicFront, cnicBack, signature,

    // Payout
    withdrawalMethod, bankDetails,
  } = req.body;

  // Validation regex patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(\+92|0)?3\d{9}$/;
  const cnicRegex  = /^\d{5}-\d{7}-\d{1}$/;

  // ── required fields validation 
  if (!firstName?.trim()) {
    res.status(400);
    throw new Error("First name is required");
  }
  if (!lastName?.trim()) {
    res.status(400);
    throw new Error("Last name is required");
  }
  if (!email?.trim()) {
    res.status(400);
    throw new Error("Email is required");
  }
  if (!password) {
    res.status(400);
    throw new Error("Password is required");
  }
  if (!phone?.trim()) {
    res.status(400);
    throw new Error("Phone number is required");
  }
  if (!shopName?.trim()) {
    res.status(400);
    throw new Error("Shop name is required");
  }
  if (!cuisine?.trim()) {
    res.status(400);
    throw new Error("Cuisine type is required");
  }
  if (!city?.trim()) {
    res.status(400);
    throw new Error("City is required");
  }
  if (!shopAddress?.trim()) {
    res.status(400);
    throw new Error("Shop address is required");
  }
  if (!cnicNumber?.trim()) {
    res.status(400);
    throw new Error("CNIC number is required");
  }

  // ── Format Validation ───────────────────────────────────
  if (firstName.trim().length < 2 || firstName.trim().length > 50) {
    res.status(400);
    throw new Error("First name must be between 2 and 50 characters");
  }
  if (lastName.trim().length < 2 || lastName.trim().length > 50) {
    res.status(400);
    throw new Error("Last name must be between 2 and 50 characters");
  }
  if (!emailRegex.test(email.trim())) {
    res.status(400);
    throw new Error("Please enter a valid email address");
  }
  if (!phoneRegex.test(phone.trim())) {
    res.status(400);
    throw new Error("Please enter a valid Pakistani phone number e.g. 03001234567");
  }
  if (password.length < 6 || password.length > 50) {
    res.status(400);
    throw new Error("Password must be between 6 and 50 characters");
  }
  if (shopName.trim().length < 3 || shopName.trim().length > 100) {
    res.status(400);
    throw new Error("Shop name must be between 3 and 100 characters");
  }
  if (shopAddress.trim().length < 10) {
    res.status(400);
    throw new Error("Please provide a complete address (minimum 10 characters)");
  }
  if (!cnicRegex.test(cnicNumber.trim())) {
    res.status(400);
    throw new Error("CNIC must be in format: XXXXX-XXXXXXX-X");
  }

  // time validation for minPrepTime and maxPrepTime
  if (
    minPrepTime !== undefined &&
    minPrepTime !== "" &&
    (Number(minPrepTime) < 5 || Number(minPrepTime) > 120)
  ) {
    res.status(400);
    throw new Error("Minimum prep time must be between 5 and 120 minutes");
  }
  if (
    maxPrepTime !== undefined &&
    maxPrepTime !== "" &&
    Number(maxPrepTime) < Number(minPrepTime || 5)
  ) {
    res.status(400);
    throw new Error("Maximum prep time must be greater than minimum prep time");
  }

  // check if the email is already registered
  const existingUser = await User.findOne({
    email: email.trim().toLowerCase(),
  });
  if (existingUser) {
    res.status(400);
    throw new Error("Email is already registered");
  }

  // create a new vendor user
  const vendor = await User.create({
    fullName:    `${firstName.trim()} ${lastName.trim()}`,
    firstName:   firstName.trim(),
    lastName:    lastName.trim(),
    email:       email.trim().toLowerCase(),
    password,
    phone:       phone.trim(),
    role:        "vendor",

    shopName:    shopName.trim(),
    cuisine:     cuisine.trim(),
    city:        city.trim(),
    zone:        zone        || "",
    shopAddress: shopAddress.trim(),
    minPrepTime: minPrepTime || 15,
    maxPrepTime: maxPrepTime || 45,
    coverPhoto:  coverPhoto  || "",
    logo:        logo        || "",
    coordinates: {
      lat: coordinates?.lat || null,
      lng: coordinates?.lng || null,
    },
    cnicNumber:  cnicNumber.trim(),
    ntnNumber:   ntnNumber   || "",
    hasFoodLicense: hasFoodLicense || false,
    cnicFront:   cnicFront   || "",
    cnicBack:    cnicBack    || "",
    signature:   signature   || "",
    withdrawalMethod: withdrawalMethod || "",
    bankDetails: bankDetails || "",
    isApproved:  false,
  });

  res.status(201).json({
    message: "Registration submitted! Please wait for admin approval.",
    user:    userResponse(vendor),
    token:   generateToken(vendor._id),
  });
});