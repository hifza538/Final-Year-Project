//backend/controllers/admin/vendorController.js
import asyncHandler from "express-async-handler";
import User from "../../models/User.js";
import Order from "../../models/Order.js";
import { sendEmailSafe } from "../../utils/sendEmail.js";
import { approvalEmail, rejectionEmail, warningEmail } from "../../utils/emailTemplates.js";
import {
  getVendorStats,
  STATS_PERIOD_DAYS,
  MIN_ORDERS_FOR_RATING,
  AT_RISK_RATE,
} from "../../utils/vendorPerformance.js";
import escapeRegex from "../../utils/escapeRegex.js";

// Get all vendors pending approval
export const getPendingVendors = asyncHandler(async (req, res) => {
  const pendingVendors = await User.find({
    role: "vendor",
    isApproved: false,
    isActive: true,
  }).select("-password");

  res.status(200).json({ vendors: pendingVendors });
});

// Get all vendors with optional search + status filter
// status: pending | approved | rejected | atrisk
// from / to: registration date range (YYYY-MM-DD, both inclusive)
export const getAllVendors = asyncHandler(async (req, res) => {
  const { status, search, from, to } = req.query;

  const query = { role: "vendor" };

  if (status === "pending") {
    query.isApproved = false;
    query.isActive = true;
  } else if (status === "approved") {
    query.isApproved = true;
    query.isActive = true;
  } else if (status === "rejected") {
    query.isActive = false;
  } else if (status === "atrisk") {
   
    query.isApproved = true;
    query.isActive = true;
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

  // Search by shopName, fullname or email (case-insensitive)
  if (search?.trim()) {
    const regex = new RegExp(escapeRegex(search.trim().slice(0, 100)), "i");
    query.$or = [{ shopName: regex }, { fullName: regex }, { email: regex }];
  }

  const vendors = await User.find(query).select("-password").sort({ createdAt: -1 }).lean();

  // Calculate performance stats for each vendor in a single aggregation query
  const since = new Date(Date.now() - STATS_PERIOD_DAYS * 24 * 60 * 60 * 1000);
  const perf = await Order.aggregate([
    { $match: { vendor: { $in: vendors.map((v) => v._id) }, createdAt: { $gte: since } } },
    {
      $group: {
        _id: "$vendor",
        total: { $sum: 1 },
        vendorCancelled: {
          $sum: { $cond: [{ $in: ["$cancelReason", ["vendor_timeout", "vendor_rejected"]] }, 1, 0] },
        },
      },
    },
  ]);
  const perfMap = new Map(perf.map((p) => [String(p._id), p]));

  let result = vendors.map((v) => {
    const p = perfMap.get(String(v._id));
    const total = p?.total || 0;
    const cancellationRate = total ? Math.round((p.vendorCancelled / total) * 100) : 0;
    return {
      ...v,
      performance: {
        total,
        cancellationRate,
        periodDays: STATS_PERIOD_DAYS,
        atRisk: v.isApproved && v.isActive && total >= MIN_ORDERS_FOR_RATING && cancellationRate >= AT_RISK_RATE,
      },
    };
  });

  if (status === "atrisk") {
    result = result.filter((v) => v.performance.atRisk);
  }

  res.status(200).json({ vendors: result });
});

// Get a single vendor's full details
export const getVendorById = asyncHandler(async (req, res) => {
  const vendor = await User.findOne({ _id: req.params.id, role: "vendor" })
    .select("-password")
    .populate("approvedBy", "fullName")
    .populate("rejectedBy", "fullName")
    .populate("warnings.sentBy", "fullName");

  if (!vendor) {
    res.status(404);
    throw new Error("Vendor not found");
  }

  const stats = await getVendorStats(vendor._id);

  res.status(200).json({ vendor, stats });
});

// Approve a vendor + send approval email
export const approveVendor = asyncHandler(async (req, res) => {
  const vendor = await User.findOne({ _id: req.params.id, role: "vendor" });

  if (!vendor) {
    res.status(404);
    throw new Error("Vendor not found");
  }

  vendor.isApproved = true;
  vendor.isActive = true; // also reactivates a previously rejected account
  vendor.approvedBy = req.user._id;
  vendor.approvedAt = new Date();
  // Clear any previous rejection record since the vendor is now approved
  vendor.rejectionReason = null;
  vendor.rejectedBy = null;
  vendor.rejectedAt = null;
  await vendor.save();

  const emailSent = await sendEmailSafe({
    to: vendor.email,
    ...approvalEmail({ name: vendor.fullName, role: "vendor", shopName: vendor.shopName }),
  });

  res.status(200).json({ message: "Vendor approved successfully", emailSent });
});

// Reject a vendor (deactivates account, records reason) + send rejection email
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

  const wasApproved = vendor.isApproved;

  vendor.isActive = false;
  vendor.isApproved = false;
  vendor.rejectionReason = reason.trim();
  vendor.rejectedBy = req.user._id;
  vendor.rejectedAt = new Date();
  await vendor.save();

  const emailSent = await sendEmailSafe({
    to: vendor.email,
    ...rejectionEmail({
      name: vendor.fullName,
      role: "vendor",
      shopName: vendor.shopName,
      reason: vendor.rejectionReason,
      wasApproved,
    }),
  });

  res.status(200).json({ message: "Vendor rejected", emailSent });
});

// Send a performance warning email to an approved vendor and keep a record of it
export const warnVendor = asyncHandler(async (req, res) => {
  const note = (req.body.message || "").trim();

  if (note.length > 500) {
    res.status(400);
    throw new Error("Note must not exceed 500 characters");
  }

  const vendor = await User.findOne({ _id: req.params.id, role: "vendor" });

  if (!vendor) {
    res.status(404);
    throw new Error("Vendor not found");
  }

  if (!vendor.isApproved || !vendor.isActive) {
    res.status(400);
    throw new Error("Warnings can only be sent to approved, active vendors");
  }

  const stats = await getVendorStats(vendor._id);

  // Send first: a warning that never reached the vendor shouldn't be recorded
  const emailSent = await sendEmailSafe({
    to: vendor.email,
    ...warningEmail({ name: vendor.fullName, shopName: vendor.shopName, stats, note }),
  });

  if (!emailSent) {
    res.status(502);
    throw new Error("Could not send the warning email. Please try again.");
  }

  vendor.warnings.push({
    message: note,
    cancellationRate: stats.cancellationRate,
    sentBy: req.user._id,
    sentAt: new Date(),
  });
  await vendor.save();

  res.status(200).json({ message: "Warning sent to vendor", emailSent: true });
});