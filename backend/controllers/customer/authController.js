// server/controllers/customer/authController.js

import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import generateToken from "../../utils/generateToken.js";

// Customer response format
const customerResponse = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  role: user.role,
  isActive: user.isActive,
});

/* @desc   Register a new customer
@route  POST /api/customer/register*/
export const registerCustomer = asyncHandler(async (req, res) => {
  const { fullName, email, password, phone } = req.body;

  // Validation regex patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(\+92|0)?3\d{9}$/;

  // Required fields validation
  if (!fullName?.trim()) {
    res.status(400);
    throw new Error("Full name is required");
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

  // Format validation
  if (fullName.trim().length < 3 || fullName.trim().length > 100) {
    res.status(400);
    throw new Error("Full name must be between 3 and 100 characters");
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

  // Check if email or phone already registered
  const existingUser = await User.findOne({
    $or: [{ email: email.trim().toLowerCase() }, { phone: phone.trim() }],
  });

  if (existingUser) {
    if (existingUser.email === email.trim().toLowerCase()) {
      res.status(400);
      throw new Error("Email is already registered");
    }
    if (existingUser.phone === phone.trim()) {
      res.status(400);
      throw new Error("This phone number is already registered");
    }
  }

  // Create customer
  const customer = await User.create({
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    password,
    phone: phone.trim(),
    role: "customer",
  });

  res.status(201).json({
    message: "Registration successful!",
    user: customerResponse(customer),
    token: generateToken(customer._id),
  });
});

/* @desc   Login customer
@route  POST /api/customer/login */
export const loginCustomer = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim()) {
    res.status(400);
    throw new Error("Email is required");
  }
  if (!password) {
    res.status(400);
    throw new Error("Password is required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    res.status(400);
    throw new Error("Please enter a valid email address");
  }

  // Find user by email and include password for comparison
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");

  // generic error message for both cases to prevent user enumeration
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Account active check
  if (!user.isActive) {
    res.status(403);
    throw new Error("Your account has been deactivated. Please contact support.");
  }

  // Role check - ensure only customers can log in through this route
  if (user.role !== "customer") {
    res.status(403);
    throw new Error("This app is for customers only. Please use the vendor panel.");
  }

  res.status(200).json({
    user: customerResponse(user),
    token: generateToken(user._id),
  });
});

/* @desc   Get logged-in customer details
@route  GET /api/customer/me */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({ user: customerResponse(user) });
});

/* @desc   Update logged-in customer's profile
@route  PUT /api/customer/profile */
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  const { fullName, phone } = req.body;

  const phoneRegex = /^(\+92|0)?3\d{9}$/;

  if (fullName !== undefined) {
    if (!fullName.trim()) {
      res.status(400);
      throw new Error("Full name cannot be empty");
    }
    if (fullName.trim().length < 3 || fullName.trim().length > 100) {
      res.status(400);
      throw new Error("Full name must be between 3 and 100 characters");
    }
  }
  if (phone !== undefined) {
    if (!phone.trim()) {
      res.status(400);
      throw new Error("Phone number cannot be empty");
    }
    if (!phoneRegex.test(phone.trim())) {
      res.status(400);
      throw new Error("Please enter a valid Pakistani phone number");
    }
  }

  if (fullName !== undefined) user.fullName = fullName.trim();
  if (phone !== undefined) user.phone = phone.trim();

  const updated = await user.save();

  res.status(200).json({
    message: "Profile updated successfully",
    user: customerResponse(updated),
  });
});