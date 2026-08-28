// backend/controllers/admin/deliveryController.js
import asyncHandler from "express-async-handler";
import User from "../../models/User.js";

// Get all riders pending approval
export const getPendingRiders = asyncHandler(async (req, res) => {
  const pendingRiders = await User.find({
    role: "delivery",
    isApproved: false,
  }).select("-password");

  res.status(200).json({ riders: pendingRiders });
});

// Get all riders with optional search + status filter
export const getAllRiders = asyncHandler(async (req, res) => {
  const { status, search } = req.query;

  const query = { role: "delivery" };

  if (status === "pending") {
    query.isApproved = false;
    query.isActive = true;
  } else if (status === "approved") {
    query.isApproved = true;
    query.isActive = true;
  } else if (status === "blocked") {
    query.isActive = false;
  }

  if (search?.trim()) {
    const regex = new RegExp(search.trim(), "i");
    query.$or = [{ fullName: regex }, { email: regex }, { vehicleNumber: regex }];
  }

  const riders = await User.find(query).select("-password").sort({ createdAt: -1 });
  res.status(200).json({ riders });
});

// Get a single rider's full details
export const getRiderById = asyncHandler(async (req, res) => {
  const rider = await User.findOne({ _id: req.params.id, role: "delivery" })
    .select("-password")
    .populate("approvedBy", "fullName")
    .populate("rejectedBy", "fullName")
    .populate("blockedBy", "fullName");

  if (!rider) {
    res.status(404);
    throw new Error("Rider not found");
  }

  res.status(200).json({ rider });
});

// Approve a rider
export const approveRider = asyncHandler(async (req, res) => {
  const rider = await User.findOne({ _id: req.params.id, role: "delivery" });

  if (!rider) {
    res.status(404);
    throw new Error("Rider not found");
  }

  rider.isApproved = true;
  rider.approvedBy = req.user._id;
  rider.approvedAt = new Date();
  rider.rejectionReason = null;
  await rider.save();

  res.status(200).json({ message: "Rider approved successfully" });
});

// Reject a rider (deactivates account, records reason)
export const rejectRider = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  if (!reason?.trim()) {
    res.status(400);
    throw new Error("A rejection reason is required");
  }

  const rider = await User.findOne({ _id: req.params.id, role: "delivery" });

  if (!rider) {
    res.status(404);
    throw new Error("Rider not found");
  }

  rider.isActive = false;
  rider.isApproved = false;
  rider.rejectionReason = reason.trim();
  rider.rejectedBy = req.user._id;
  rider.rejectedAt = new Date();
  await rider.save();

  res.status(200).json({ message: "Rider rejected" });
});

// Block or unblock a rider (toggles isActive)
export const toggleRiderBlock = asyncHandler(async (req, res) => {
  const rider = await User.findOne({ _id: req.params.id, role: "delivery" });

  if (!rider) {
    res.status(404);
    throw new Error("Rider not found");
  }

  rider.isActive = !rider.isActive;

  if (!rider.isActive) {
    rider.blockedBy = req.user._id;
    rider.blockedAt = new Date();
  }

  await rider.save();

  res.status(200).json({
    message: rider.isActive ? "Rider unblocked" : "Rider blocked",
    isActive: rider.isActive,
  });
});