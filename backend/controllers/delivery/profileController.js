// backend/controllers/delivery/profileController.js
import asyncHandler from "express-async-handler";
import User from "../../models/User.js";

const phoneRegex = /^(\+92|0)?3\d{9}$/;
const validVehicleTypes = ["bike", "car", "bicycle"];

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
  isOnline: user.isOnline,
});

// @desc   Get logged-in rider's profile
// @route  GET /api/delivery/profile
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({ user: deliveryResponse(user) });
});

// @desc   Update logged-in rider profile
// @route  PATCH /api/delivery/profile
export const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, phone, vehicleType, vehicleNumber } = req.body;

  // rider profile validation
  if (!fullName?.trim()) {
    res.status(400);
    throw new Error("Full name is required");
  }
  if (fullName.trim().length < 3 || fullName.trim().length > 100) {
    res.status(400);
    throw new Error("Full name must be between 3 and 100 characters");
  }
  if (!phone?.trim()) {
    res.status(400);
    throw new Error("Phone number is required");
  }
  if (!phoneRegex.test(phone.trim())) {
    res.status(400);
    throw new Error("Please enter a valid Pakistani phone number...");
  }
  if (!vehicleType?.trim() || !validVehicleTypes.includes(vehicleType.trim())) {
    res.status(400);
    throw new Error("Vehicle type must be bike or car");
  }
  if (!vehicleNumber?.trim()) {
    res.status(400);
    throw new Error("Vehicle number is required");
  }

  // Check if the phone number is already registered to another user
  const existingUser = await User.findOne({
    phone: phone.trim(),
    _id: { $ne: req.user._id },
  });

  if (existingUser) {
    res.status(400);
    throw new Error("This phone number is already registered to another account");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      fullName: fullName.trim(),
      phone: phone.trim(),
      vehicleType: vehicleType.trim(),
      vehicleNumber: vehicleNumber.trim(),
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    message: "Profile updated successfully",
    user: deliveryResponse(updatedUser),
  });
});