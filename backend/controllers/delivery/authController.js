import asyncHandler from "express-async-handler";
import User from "../../models/User.js";
import generateToken from "../../utils/generateToken.js";

// Delivery response format
const deliveryResponse = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  role: user.role,
  cnicNumber: user.cnicNumber,
  vehicleType: user.vehicleType,
  vehicleNumber: user.vehicleNumber,
  isApproved: user.isApproved,
  isActive: user.isActive,
});

/*@desc   Register a new delivery rider
 @route  POST /api/delivery/register */
export const registerDelivery = asyncHandler(async (req, res) => {
  const { fullName, email, password, phone, cnicNumber, vehicleType, vehicleNumber } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(\+92|0)?3\d{9}$/;
  const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
  const validVehicleTypes = ["bike", "car", "bicycle"];

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
  if (!cnicNumber?.trim()) {
    res.status(400);
    throw new Error("CNIC number is required");
  }
  if (!vehicleType?.trim()) {
    res.status(400);
    throw new Error("Vehicle type is required");
  }
  if (!vehicleNumber?.trim()) {
    res.status(400);
    throw new Error("Vehicle number is required");
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
    throw new Error("Please enter a valid Pakistani phone number");
  }
  if (password.length < 6 || password.length > 50) {
    res.status(400);
    throw new Error("Password must be between 6 and 50 characters");
  }
  if (!cnicRegex.test(cnicNumber.trim())) {
    res.status(400);
    throw new Error("CNIC must be in format: XXXXX-XXXXXXX-X");
  }
  if (!validVehicleTypes.includes(vehicleType.trim())) {
    res.status(400);
    throw new Error("Vehicle type must be bike, car, or bicycle");
  }

  // Check duplicates - email, phone or CNIC already registered
  const existingUser = await User.findOne({
    $or: [
      { email: email.trim().toLowerCase() },
      { phone: phone.trim() },
      { cnicNumber: cnicNumber.trim() },
    ],
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
    if (existingUser.cnicNumber === cnicNumber.trim()) {
      res.status(400);
      throw new Error("This CNIC is already registered");
    }
  }

  const rider = await User.create({
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    password,
    phone: phone.trim(),
    role: "delivery",
    cnicNumber: cnicNumber.trim(),
    vehicleType: vehicleType.trim(),
    vehicleNumber: vehicleNumber.trim(),
    isApproved: false, // Admin must approve before rider can go online
  });

  res.status(201).json({
    message: "Registration submitted! Please wait for admin approval.",
    user: deliveryResponse(rider),
    token: generateToken(rider._id),
  });
});

/*@desc   Login delivery rider
 @route  POST /api/delivery/login */
export const loginDelivery = asyncHandler(async (req, res) => {
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

  // Check if the user is a delivery rider
  if (user.role !== "delivery") {
    res.status(403);
    throw new Error("This app is for delivery riders only.");
  }

  // Rider must be approved by admin before logging in
  if (!user.isApproved) {
    res.status(403);
    throw new Error("Your account is pending admin approval. Please wait.");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("Your account has been deactivated. Please contact support.");
  }

  res.status(200).json({
    user: deliveryResponse(user),
    token: generateToken(user._id),
  });
});

/* @desc   Get logged-in delivery rider details
 @route  GET /api/delivery/me */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({ user: deliveryResponse(user) });
});
