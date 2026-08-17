//backend/controllers/admin/vendorController.js
import asyncHandler from "express-async-handler";
import User from "../../models/User.js";

// all vendors pending approval
export const getPendingVendors = asyncHandler(async (req, res) => {
  const pendingVendors = await User.find({
    role: "vendor",
    isApproved: false,
  }).select("-password");

  res.status(200).json({ vendors: pendingVendors });
});

// get all vendors with optional search + status filter
export const getAllVendors = asyncHandler(async (req, res) => {
  const { status, search } = req.query;

  const query = { role: "vendor" };

  if (status === "pending") {
    query.isApproved = false;
    query.isActive = true;
  } else if (status === "approved") {
    query.isApproved = true;
    query.isActive = true;
  } else if (status === "blocked") {
    query.isActive = false;
  }
  // Search by shopName, fullname or email (case-insensitive)

  if (search?.trim()) {
    const regex = new RegExp(search.trim(), "i");
    query.$or = [{ shopName: regex }, { fullName: regex }, { email: regex }];
  }

  const vendors = await User.find(query).select("-password").sort({ createdAt: -1 });
  res.status(200).json({ vendors });
});

// A single vendor's full details
export const getVendorById = asyncHandler(async (req, res) => {
  const vendor = await User.findOne({ _id: req.params.id, role: "vendor" })
    .select("-password")
    .populate("approvedBy", "fullName")
    .populate("rejectedBy", "fullName")
    .populate("blockedBy", "fullName");

  if (!vendor) {
    res.status(404);
    throw new Error("Vendor not found");
  }

  res.status(200).json({ vendor });
});

// Approve a vendor
export const approveVendor = asyncHandler(async (req, res) => {
  const vendor = await User.findOne({ _id: req.params.id, role: "vendor" });

  if (!vendor) {
    res.status(404);
    throw new Error("Vendor not found");
  }

  vendor.isApproved = true;
  vendor.approvedBy = req.user._id;
  vendor.approvedAt = new Date();
  // Clear any previous rejection record since the vendor is now approved
  vendor.rejectionReason = null;
  await vendor.save();

  res.status(200).json({ message: "Vendor approved successfully" });
});

// Reject a vendor (deactivates account, records reason)
export const rejectVendor = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  if (!reason?.trim()) {
    res.status(400);
    throw new Error("A rejection reason is required");
  }

  const vendor = await User.findOne({ _id: req.params.id, role: "vendor" });

  if (!vendor) {
    res.status(404);
    throw new Error("Vendor not found");
  }

  vendor.isActive = false;
  vendor.isApproved = false;
  vendor.rejectionReason = reason.trim();
  vendor.rejectedBy = req.user._id;
  vendor.rejectedAt = new Date();
  await vendor.save();

  res.status(200).json({ message: "Vendor rejected" });
});

// Block or unblock a vendor (toggles isActive)
export const toggleVendorBlock = asyncHandler(async (req, res) => {
  const vendor = await User.findOne({ _id: req.params.id, role: "vendor" });

  if (!vendor) {
    res.status(404);
    throw new Error("Vendor not found");
  }

  vendor.isActive = !vendor.isActive;

  // Only record who blocked it - unblocking doesn't need a separate trail here
  if (!vendor.isActive) {
    vendor.blockedBy = req.user._id;
    vendor.blockedAt = new Date();
  }

  await vendor.save();

  res.status(200).json({
    message: vendor.isActive ? "Vendor unblocked" : "Vendor blocked",
    isActive: vendor.isActive,
  });
});