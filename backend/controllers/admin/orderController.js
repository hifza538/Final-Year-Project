//backend/controllers/admin/orderController.js
import asyncHandler from "express-async-handler";
import Order from "../../models/Order.js";
import User from "../../models/User.js";
import { notifyUser } from "../../socket.js";

// get all orders with optional filters for status and search
export const getAllOrders = asyncHandler(async (req, res) => {
  const { status, search, startDate, endDate } = req.query;

  const query = {};

  if (status && status !== "all") {
    query.orderStatus = status;
  }
  
   if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {
      query.createdAt.$gte = new Date(`${startDate}T00:00:00.000Z`);
    }
    if (endDate) {
      query.createdAt.$lte = new Date(`${endDate}T23:59:59.999Z`);
    }
  }

  if (search?.trim()) {
    const regex = new RegExp(search.trim(), "i");

// Search for users matching the search term in fullName, email, or shopName
    const matchingUsers = await User.find({
      $or: [{ fullName: regex }, { email: regex }, { shopName: regex }],
    }).select("_id");

    const userIds = matchingUsers.map((u) => u._id);
    query.$or = [{ customer: { $in: userIds } }, { vendor: { $in: userIds } }];
  }

  const orders = await Order.find(query)
    .populate("customer", "fullName email phone")
    .populate("vendor", "shopName")
    .populate("deliveryRider", "fullName")
    .sort({ createdAt: -1 });

  res.status(200).json({ orders });
});

// get a single order's complete details
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("customer", "fullName email phone")
    .populate("vendor", "shopName phone city")
    .populate("deliveryRider", "fullName phone vehicleType vehicleNumber");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.status(200).json({ order });
});

// cancel an order
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (["Completed", "Rejected"].includes(order.orderStatus)) {
    res.status(400);
    throw new Error(`Cannot cancel an order that is already ${order.orderStatus.toLowerCase()}`);
  }

  order.orderStatus = "Rejected";
  await order.save();

  // Let both the customer and the vendor know admin stepped in and
  // cancelled this order
  notifyUser(order.customer, "orderUpdate", {
    orderId: order._id,
    status: "Rejected",
    message: "Your order was cancelled by LocalBites support.",
  });
  notifyUser(order.vendor, "orderUpdate", {
    orderId: order._id,
    status: "Rejected",
    message: "An order was cancelled by LocalBites support.",
  });

  res.status(200).json({ message: "Order cancelled successfully" });
});