//backend/controllers/admin/deliveryController.js
import asyncHandler from "express-async-handler";
import User from "../../models/User.js";
import Order from "../../models/Order.js";
import { sendEmailSafe } from "../../utils/sendEmail.js";
import { approvalEmail, rejectionEmail } from "../../utils/emailTemplates.js";
import escapeRegex from "../../utils/escapeRegex.js";

// Get all riders pending approval

export const getPendingRiders = asyncHandler(async (req, res) => {
  const pendingRiders = await User.find({
    role: "delivery",
    isApproved: false,
    isActive: true,
  }).select("-password");

  res.status(200).json({ riders: pendingRiders });
});

// Get all riders with optional search + status filter
// status: pending | approved | rejected
// from / to: registration date range (YYYY-MM-DD, both inclusive)
export const getAllRiders = asyncHandler(async (req, res) => {
  const { status, search, from, to } = req.query;

  const query = { role: "delivery" };

  if (status === "pending") {
    query.isApproved = false;
    query.isActive = true;
  } else if (status === "approved") {
    query.isApproved = true;
    query.isActive = true;
  } else if (status === "rejected") {
    query.isActive = false;
  }

  // Registration date range
  if (from || to) {
    const range = {};
    const fromDate = from ? new Date(`${from}T00:00:00`) : null;
    const toDate = to ? new Date(`${to}T23:59:59.999`) : null;
    if (fromDate && !isNaN(fromDate)) range.$gte = fromDate;
    if (toDate && !isNaN(toDate)) range.$lte = toDate;
    if (Object.keys(range).length) query.createdAt = range;
  }

  if (search?.trim()) {
    const regex = new RegExp(escapeRegex(search.trim().slice(0, 100)), "i");
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
    .populate("rejectedBy", "fullName");

  if (!rider) {
    res.status(404);
    throw new Error("Rider not found");
  }

  // Calculate rider's performance stats
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [totalDeliveries, last30Days, lastDelivery, activeOrder] = await Promise.all([
    Order.countDocuments({ deliveryRider: rider._id, orderStatus: "Completed" }),
    Order.countDocuments({ deliveryRider: rider._id, orderStatus: "Completed", updatedAt: { $gte: since } }),
    Order.findOne({ deliveryRider: rider._id, orderStatus: "Completed" }).sort({ updatedAt: -1 }).select("updatedAt"),
    Order.findOne({ deliveryRider: rider._id, orderStatus: "OutForDelivery" }).select("deliveryStage"),
  ]);

  const stats = {
    totalDeliveries,
    last30Days,
    lastDeliveryAt: lastDelivery?.updatedAt || null,
    activeStage: activeOrder?.deliveryStage || null,
  };

  res.status(200).json({ rider, stats });
});

// Approve a rider + send approval email
export const approveRider = asyncHandler(async (req, res) => {
  const rider = await User.findOne({ _id: req.params.id, role: "delivery" });

  if (!rider) {
    res.status(404);
    throw new Error("Rider not found");
  }

  rider.isApproved = true;
  rider.isActive = true; // also reactivates a previously rejected account
  rider.approvedBy = req.user._id;
  rider.approvedAt = new Date();
  rider.rejectionReason = null;
  rider.rejectedBy = null;
  rider.rejectedAt = null;
  await rider.save();

  const emailSent = await sendEmailSafe({
    to: rider.email,
    ...approvalEmail({ name: rider.fullName, role: "delivery" }),
  });

  res.status(200).json({ message: "Rider approved successfully", emailSent });
});

// Reject a rider (deactivates account, records reason) + send rejection email
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

  const wasApproved = rider.isApproved;

  rider.isActive = false;
  rider.isApproved = false;
  rider.rejectionReason = reason.trim();
  rider.rejectedBy = req.user._id;
  rider.rejectedAt = new Date();
  await rider.save();

  const emailSent = await sendEmailSafe({
    to: rider.email,
    ...rejectionEmail({ name: rider.fullName, role: "delivery", reason: rider.rejectionReason, wasApproved }),
  });

  res.status(200).json({ message: "Rider rejected", emailSent });
});