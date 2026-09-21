//backend/controllers/admin/reportsController.js
import asyncHandler from "express-async-handler";
import Order from "../../models/Order.js";

// Helper function to build a date filter for MongoDB queries
const buildDateFilter = (startDate, endDate) => {
  const end = endDate ? new Date(endDate) : new Date();
  end.setHours(23, 59, 59, 999);

  const start = startDate ? new Date(startDate) : new Date(end);
  if (!startDate) start.setDate(start.getDate() - 30);
  start.setHours(0, 0, 0, 0);

  return { createdAt: { $gte: start, $lte: end } };
};

// Get reports overview for a given date range
export const getReportsOverview = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const dateFilter = buildDateFilter(startDate, endDate);

  // 1. Orders and revenue trend over time (daily)
  const trend = await Order.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        orders: { $sum: 1 },
        revenue: {
          $sum: {
            $cond: [{ $eq: ["$orderStatus", "Completed"] }, "$totalPrice", 0],
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const ordersTrend = trend.map((t) => ({ label: t._id, orders: t.orders }));
  const revenueTrend = trend.map((t) => ({ label: t._id, revenue: t.revenue }));

  // 2. Top vendors by revenue within the range
  const topVendorsRaw = await Order.aggregate([
    { $match: { ...dateFilter, orderStatus: "Completed" } },
    {
      $group: {
        _id: "$vendor",
        totalRevenue: { $sum: "$totalPrice" },
        totalOrders: { $sum: 1 },
      },
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "vendorInfo",
      },
    },
    { $unwind: "$vendorInfo" },
    {
      $project: {
        vendorName: "$vendorInfo.shopName",
        totalRevenue: 1,
        totalOrders: 1,
      },
    },
  ]);

  // 3. Order status breakdown within the range
  const statusBreakdownRaw = await Order.aggregate([
    { $match: dateFilter },
    { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
  ]);

  const statusBreakdown = statusBreakdownRaw.map((s) => ({
    status: s._id,
    count: s.count,
  }));

  // Summary totals for the selected range
  const totalOrders = trend.reduce((sum, t) => sum + t.orders, 0);
  const totalRevenue = trend.reduce((sum, t) => sum + t.revenue, 0);

  res.status(200).json({
    ordersTrend,
    revenueTrend,
    topVendors: topVendorsRaw,
    statusBreakdown,
    totalOrders,
    totalRevenue,
  });
});