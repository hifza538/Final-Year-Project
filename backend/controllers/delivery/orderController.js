import asyncHandler from "express-async-handler";
import Order from "../../models/Order.js";

// Helper function to format order response
const orderResponse = (order) => ({
  _id: order._id,
  vendor: order.vendor,
  customer: order.customer,
  orderItems: order.orderItems,
  deliveryAddress: order.deliveryAddress,
  itemsPrice: order.itemsPrice,
  deliveryFee: order.deliveryFee,
  taxPrice: order.taxPrice,
  totalPrice: order.totalPrice,
  orderStatus: order.orderStatus,
  isPaid: order.isPaid,
  isDelivered: order.isDelivered,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
});

// Get all available orders for delivery riders
export const getAvailableOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ orderStatus: "Ready", deliveryRider: null })
    .populate("vendor", "fullName restaurantName phone")
    .sort({ createdAt: 1 }); // oldest ready order first - fair pickup order

  res.status(200).json({ orders: orders.map(orderResponse) });
});

// Accept an order for delivery
export const acceptOrder = asyncHandler(async (req, res) => {

 // Check if the rider already has an active order
  const activeOrder = await Order.findOne({
    deliveryRider: req.user._id,
    orderStatus: "OutForDelivery",
  });

  if (activeOrder) {
    res.status(400);
    throw new Error("Finish your current delivery before accepting a new order");
  }

 // Attempt to assign the order to the rider only if it is still available
  const order = await Order.findOneAndUpdate(
    { _id: req.params.id, orderStatus: "Ready", deliveryRider: null },
    { deliveryRider: req.user._id, orderStatus: "OutForDelivery" },
    { new: true }
  ).populate("vendor", "fullName restaurantName phone");

  if (!order) {
    res.status(409);
    throw new Error("This order was already accepted by another rider");
  }

  res.status(200).json({ message: "Order accepted", order: orderResponse(order) });
});

// Get the rider's current active orders (out for delivery)
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    deliveryRider: req.user._id,
    orderStatus: "OutForDelivery",
  })
    .populate("vendor", "fullName restaurantName phone")
    .sort({ updatedAt: -1 });

  res.status(200).json({ orders: orders.map(orderResponse) });
});

// Mark an order as delivered
export const deliverOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOneAndUpdate(
    { _id: req.params.id, deliveryRider: req.user._id, orderStatus: "OutForDelivery" },
    { orderStatus: "Completed", isDelivered: true },
    { new: true }
  ).populate("vendor", "fullName restaurantName phone");

  if (!order) {
    res.status(404);
    throw new Error("Order not found or not assigned to you");
  }

  res.status(200).json({ message: "Order marked as delivered", order: orderResponse(order) });
});

// Get the rider's order history (completed orders)
export const getOrderHistory = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    deliveryRider: req.user._id,
    orderStatus: "Completed",
  })
    .populate("vendor", "fullName restaurantName phone")
    .sort({ updatedAt: -1 });

  res.status(200).json({ orders: orders.map(orderResponse) });
});