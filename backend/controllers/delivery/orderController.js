// backend/controllers/delivery/orderController.js
import asyncHandler from "express-async-handler";
import Order from "../../models/Order.js";

// Define the sequence of delivery stages for validation and progression
const STAGE_SEQUENCE = ["Accepted", "ArrivedAtRestaurant", "PickedUp", "OnTheWay", "Delivered"];

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
  deliveryStage: order.deliveryStage,
  isPaid: order.isPaid,
  isDelivered: order.isDelivered,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
});

// Get all available orders for delivery riders
export const getAvailableOrders = asyncHandler(async (req, res) => {
  // Check if the rider is online before fetching available orders
  // This is important because we do not want offline riders to accept orders and then not deliver them
  if (!req.user.isOnline) {
    return res.status(200).json({ orders: [], isOnline: false });
  }

  const orders = await Order.find({ orderStatus: "Ready", deliveryRider: null })
    .populate("vendor", "shopName phone shopAddress")
    .sort({ createdAt: 1 }); // oldest ready order first - fair pickup order

  res.status(200).json({ orders: orders.map(orderResponse), isOnline: true });
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
    { deliveryRider: req.user._id, orderStatus: "OutForDelivery", deliveryStage: "Accepted" },
    { new: true }
  ).populate("vendor", "shopName phone shopAddress");

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
    .populate("vendor", "shopName phone shopAddress")
    .sort({ updatedAt: -1 });

  res.status(200).json({ orders: orders.map(orderResponse) });
});

// Move the order to its next delivery stage
export const advanceOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    deliveryRider: req.user._id,
    orderStatus: "OutForDelivery",
  });

  if (!order) {
    res.status(404);
    throw new Error("Order not found or not assigned to you");
  }

  const currentIndex = STAGE_SEQUENCE.indexOf(order.deliveryStage);
  const nextStage = STAGE_SEQUENCE[currentIndex + 1];

  if (!nextStage) {
    res.status(400);
    throw new Error("This order has already been delivered");
  }

  order.deliveryStage = nextStage;

  // If the order has reached the "Delivered" stage, we also mark it as completed
  if (nextStage === "Delivered") {
    order.orderStatus = "Completed";
    order.isDelivered = true;
  }

  await order.save();
  await order.populate("vendor", "shopName phone shopAddress");

  res.status(200).json({
    message:
      nextStage === "Delivered" ? "Order marked as delivered" : `Order status updated to ${nextStage}`,
    order: orderResponse(order),
  });
});

// Get the rider's order history (completed orders)
export const getOrderHistory = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    deliveryRider: req.user._id,
    orderStatus: "Completed",
  })
    .populate("vendor", "shopName phone shopAddress")
    .sort({ updatedAt: -1 });

  res.status(200).json({ orders: orders.map(orderResponse) });
});