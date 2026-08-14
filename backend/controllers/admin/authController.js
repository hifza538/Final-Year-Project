// backend/controllers/admin/authController.js

import asyncHandler from "express-async-handler";
import User from "../../models/User.js";
import generateToken from "../../utils/generateToken.js";

// Admin response format
const adminResponse = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
});

 /*@desc   Login admin
 @route  POST /api/admin/login
@note   No register endpoint-admin accounts are created only via the seed script*/
export const loginAdmin = asyncHandler(async (req, res) => {
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

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // CRITICAL: only admin role can log in through this endpoint
  if (user.role !== "admin") {
    res.status(403);
    throw new Error("This panel is for administrators only.");
  }

  res.status(200).json({
    user: adminResponse(user),
    token: generateToken(user._id),
  });
});

/*@desc   Get logged-in admin details
 @route  GET /api/admin/me*/
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({ user: adminResponse(user) });
});
