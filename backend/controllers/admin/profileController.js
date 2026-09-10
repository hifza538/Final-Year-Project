//backend/controllers/admin/profileController.js
import asyncHandler from "express-async-handler";
import User from "../../models/User.js";

// get admin's own profile details
export const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, phone } = req.body;

  const admin = await User.findById(req.user._id);
  if (!admin) {
    res.status(404);
    throw new Error("Admin not found");
  }

  if (fullName?.trim()) admin.fullName = fullName.trim();
  if (phone?.trim()) admin.phone = phone.trim();

  await admin.save();

  res.status(200).json({
    user: {
      _id: admin._id,
      fullName: admin.fullName,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
    },
    message: "Profile updated successfully",
  });
});

// change admin's password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error("Current and new password are both required");
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error("New password must be at least 6 characters");
  }

  // Check if the current password is correct
  const admin = await User.findById(req.user._id).select("+password");
  if (!admin) {
    res.status(404);
    throw new Error("Admin not found");
  }

  const isMatch = await admin.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  admin.password = newPassword; // pre-save hook in User.js hashes this automatically
  await admin.save();

  res.status(200).json({ message: "Password changed successfully" });
});