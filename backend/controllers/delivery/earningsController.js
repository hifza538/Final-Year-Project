// backend/controllers/delivery/earningsController.js
import asyncHandler from "express-async-handler";
import Order from "../../models/Order.js";

const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const startOfWeek = () => {
  const d = startOfToday();
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1; // week starts Monday
  d.setDate(d.getDate() - diff);
  return d;
};
const startOfMonth = () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); };

// @desc   Get rider's earnings summary (today/week/month/lifetime)
// @route  GET /api/delivery/earnings/summary
export const getEarningsSummary = asyncHandler(async (req, res) => {
  const riderId = req.user._id;

  const buildRange = async (fromDate) => {
    const match = { deliveryRider: riderId, orderStatus: "Completed" };
    if (fromDate) match.updatedAt = { $gte: fromDate };
    const result = await Order.aggregate([
      { $match: match },
      { $group: { _id: null, earnings: { $sum: "$deliveryFee" }, deliveries: { $sum: 1 } } },
    ]);
    return result[0]
      ? { earnings: result[0].earnings, deliveries: result[0].deliveries }
      : { earnings: 0, deliveries: 0 };
  };

  const [today, week, month, lifetime] = await Promise.all([
    buildRange(startOfToday()),
    buildRange(startOfWeek()),
    buildRange(startOfMonth()),
    buildRange(null),
  ]);

  res.status(200).json({ today, week, month, lifetime });
});

// @desc   Get rider's recent completed deliveries (for the earnings list)
// @route  GET /api/delivery/earnings/recent
export const getRecentEarnings = asyncHandler(async (req, res) => {
  const orders = await Order.find({ deliveryRider: req.user._id, orderStatus: "Completed" })
    .populate("vendor", "shopName")
    .sort({ updatedAt: -1 })
    .limit(10);

  res.status(200).json({
    orders: orders.map((o) => ({
      _id: o._id,
      vendor: o.vendor,
      deliveryFee: o.deliveryFee,
      updatedAt: o.updatedAt,
    })),
  });
});