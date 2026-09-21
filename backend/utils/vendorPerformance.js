// backend/utils/vendorPerformance.js
import Order from "../models/Order.js";

// Performance is judged over a recent window, and only once there are enough orders
export const STATS_PERIOD_DAYS = 30;
export const MIN_ORDERS_FOR_RATING = 2;
// A vendor is "At Risk" when this % (or more) of their orders were vendor-caused cancellations
export const AT_RISK_RATE = 30;

// Only vendor-caused cancellations (timeout / vendor rejected) count against the vendor.
export const getVendorStats = async (vendorId) => {
  const since = new Date(Date.now() - STATS_PERIOD_DAYS * 24 * 60 * 60 * 1000);
  const grouped = await Order.aggregate([
    { $match: { vendor: vendorId, createdAt: { $gte: since } } },
    { $group: { _id: { status: "$orderStatus", reason: "$cancelReason" }, count: { $sum: 1 } } },
  ]);

  let total = 0, completed = 0, timedOut = 0, rejectedByVendor = 0;
  grouped.forEach(({ _id, count }) => {
    total += count;
    if (_id.status === "Completed") completed += count;
    if (_id.reason === "vendor_timeout") timedOut += count;
    if (_id.reason === "vendor_rejected") rejectedByVendor += count;
  });

  const vendorCancelled = timedOut + rejectedByVendor;
  const cancellationRate = total ? Math.round((vendorCancelled / total) * 100) : 0;
  const enoughData = total >= MIN_ORDERS_FOR_RATING;

  return {
    periodDays: STATS_PERIOD_DAYS,
    minOrders: MIN_ORDERS_FOR_RATING,
    total,
    completed,
    timedOut,
    rejectedByVendor,
    cancellationRate,
    enoughData,
    atRisk: enoughData && cancellationRate >= AT_RISK_RATE,
  };
};