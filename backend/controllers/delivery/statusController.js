// backend/controllers/delivery/statusController.js
import asyncHandler from "express-async-handler";
import User from "../../models/User.js";

// @desc   rider's toggle online/offline status
// @route  PATCH /api/delivery/status
export const updateOnlineStatus = asyncHandler(async (req, res) => {
  const { isOnline } = req.body;

  // Validate isOnline is a boolean
  if (typeof isOnline !== "boolean") {
    res.status(400);
    throw new Error("isOnline must be true or false");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { isOnline },
    { new: true }
  );

  res.status(200).json({
    message: isOnline ? "You are now online" : "You are now offline",
    isOnline: user.isOnline,
  });
});