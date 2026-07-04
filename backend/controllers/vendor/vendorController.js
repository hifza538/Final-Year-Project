import asyncHandler from "express-async-handler";
import Order from "../../models/Order.js";

/* @desc    Get vendor dashboard statistics
   @route   GET /api/vendor/dashboard-stats
   @access  Private (vendor)
*/
export const getDashboardStats = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
  res.status(401);
  throw new Error("Not authorized");
}
const vendorId = req.user._id; 

  // Run all queries in parallel for better performance
  const [
    totalOrders,
    pendingOrders,
    completedOrders,
    uniqueCustomers,
  ] = await Promise.all([
    // Total orders count
    Order.countDocuments({ vendor: vendorId }),

    // Pending orders count
    Order.countDocuments({
      vendor: vendorId,
      orderStatus: "Pending",
    }),

    // Completed orders for earnings calculation
    Order.find({
      vendor: vendorId,
      orderStatus: "Completed",
    }).select("totalPrice"),

    // Unique customers
    Order.distinct("customer", { vendor: vendorId }),
  ]);

  // Calculate total earnings from completed orders
  const totalEarnings = completedOrders.reduce(
    (sum, order) => sum + (order.totalPrice || 0),
    0
  );

  res.status(200).json({
    stats: {
      totalOrders,
      pendingOrders,
      totalEarnings,
      totalCustomers: uniqueCustomers.length,
    },
  });
});