// backend/controllers/admin/statsController.js

import asyncHandler from "express-async-handler";
import User from "../../models/User.js";
import Order from "../../models/Order.js";

// @desc    Get overview stats for the admin dashboard
// @route   GET /api/admin/stats/overview
// @access  Private (admin only)
export const getOverviewStats = asyncHandler(async (req, res) => {
  const [
    totalCustomers,
    totalVendorsApproved,
    totalVendorsPending,
    totalRidersApproved,
    totalRidersPending,
    totalOrders,
  ] = await Promise.all([
    User.countDocuments({ role: "customer" }),
    User.countDocuments({ role: "vendor", isApproved: true }),
    User.countDocuments({ role: "vendor", isApproved: false }),
    User.countDocuments({ role: "delivery", isApproved: true }),
    User.countDocuments({ role: "delivery", isApproved: false }),
    Order.countDocuments(),
  ]);

  // All-time revenue from completed orders
  const totalRevenueResult = await Order.aggregate([
    { $match: { orderStatus: "Completed" } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  const totalRevenue = totalRevenueResult[0]?.total || 0;

  // Today / This Week / This Month revenue breakdown
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday as week start
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const revenueSince = async (sinceDate) => {
    const result = await Order.aggregate([
      { $match: { orderStatus: "Completed", createdAt: { $gte: sinceDate } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    return result[0]?.total || 0;
  };

  const [todayRevenue, weekRevenue, monthRevenue] = await Promise.all([
    revenueSince(startOfToday),
    revenueSince(startOfWeek),
    revenueSince(startOfMonth),
  ]);

  res.status(200).json({
    stats: {
      totalCustomers,
      totalVendors: totalVendorsApproved + totalVendorsPending,
      pendingVendors: totalVendorsPending,
      totalRiders: totalRidersApproved + totalRidersPending,
      pendingRiders: totalRidersPending,
      totalOrders,
      totalRevenue,
      revenueBreakdown: {
        today: todayRevenue,
        week: weekRevenue,
        month: monthRevenue,
      },
    },
  });
});

// @desc    Get last 7 days of orders/revenue for dashboard charts
// @route   GET /api/admin/stats/orders-timeline
// @access  Private (admin only)
export const getOrdersTimeline = asyncHandler(async (req, res) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // include today = 7 days total
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const results = await Order.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        orders: { $sum: 1 },
        revenue: {
          $sum: { $cond: [{ $eq: ["$orderStatus", "Completed"] }, "$totalPrice", 0] },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Fill in any missing days with zero, so the chart always shows 7 points
  const timeline = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(sevenDaysAgo);
    date.setDate(date.getDate() + i);
    const dateKey = date.toISOString().split("T")[0];
    const match = results.find((r) => r._id === dateKey);

    timeline.push({
      label: date.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      orders: match?.orders || 0,
      revenue: match?.revenue || 0,
    });
  }

  res.status(200).json({ timeline });
});

// @desc    Get most recent orders across all vendors
// @route   GET /api/admin/stats/recent-orders
// @access  Private (admin only)
export const getRecentOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("customer", "fullName")
    .populate("vendor", "shopName")
    .sort({ createdAt: -1 })
    .limit(8);

  const formatted = orders.map((order) => ({
    _id: order._id,
    customerName: order.customer?.fullName || "Unknown",
    vendorName: order.vendor?.shopName || "Unknown",
    amount: order.totalPrice,
    status: order.orderStatus,
    createdAt: order.createdAt,
  }));

  res.status(200).json({ orders: formatted });
});