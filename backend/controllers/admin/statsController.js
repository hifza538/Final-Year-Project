// backend/controllers/admin/statsController.js
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import User from "../../models/User.js";

// @desc    Get overview stats for the admin dashboard
// @route   GET /api/admin/stats/overview
// @access  Private (admin only)
export const getOverviewStats = asyncHandler(async (req, res) => {

  // Count users by role - always available since User model is shared.
  const [
    totalCustomers,
    totalVendorsApproved,
    totalVendorsPending,
    totalRidersApproved,
    totalRidersPending,
  ] = await Promise.all([
    User.countDocuments({ role: "customer" }),
    User.countDocuments({ role: "vendor", isApproved: true }),
    User.countDocuments({ role: "vendor", isApproved: false }),
    User.countDocuments({ role: "delivery", isApproved: true }),
    User.countDocuments({ role: "delivery", isApproved: false }),
  ]);

  // Count orders and revenue only if the Order model is available (i.e., the Orders feature is ready)
  let totalOrders = 0;
  let totalRevenue = 0;
  const ordersFeatureReady = !!mongoose.models.Order;

  if (ordersFeatureReady) {
    const Order = mongoose.models.Order;
    totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: "Completed" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    totalRevenue = revenueResult[0]?.total || 0;
  }

  res.status(200).json({
    stats: {
      totalCustomers,
      totalVendors: totalVendorsApproved + totalVendorsPending,
      pendingVendors: totalVendorsPending,
      totalRiders: totalRidersApproved + totalRidersPending,
      pendingRiders: totalRidersPending,
      totalOrders,
      totalRevenue,
      ordersFeatureReady,
    },
  });
});