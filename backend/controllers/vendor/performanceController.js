// backend/controllers/vendor/performanceController.js
import asyncHandler from "express-async-handler";
import User from "../../models/User.js";
import { getVendorStats } from "../../utils/vendorPerformance.js";
import { ACCEPT_TIMEOUT_MINUTES } from "../../utils/autoRejectStaleOrders.js";

// An admin warning stays visible on the dashboard for this many days
const WARNING_VISIBLE_DAYS = 14;

// @desc   Logged-in vendor's own order performance + any recent admin warning
// @route  GET /api/vendor/performance
export const getMyPerformance = asyncHandler(async (req, res) => {
  const stats = await getVendorStats(req.user._id);

  const vendor = await User.findById(req.user._id).select("warnings");
  const last = vendor?.warnings?.length ? vendor.warnings[vendor.warnings.length - 1] : null;
  const isRecent =
    last && Date.now() - new Date(last.sentAt).getTime() <= WARNING_VISIBLE_DAYS * 24 * 60 * 60 * 1000;

  res.status(200).json({
    performance: {
      ...stats,
      acceptTimeoutMinutes: ACCEPT_TIMEOUT_MINUTES,
      // Show the banner if the vendor is at risk OR an admin warned them recently
      showWarning: stats.atRisk || Boolean(isRecent),
      latestWarning: isRecent ? { message: last.message, sentAt: last.sentAt } : null,
    },
  });
});