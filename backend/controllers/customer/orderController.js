// server/controllers/customer/orderController.js

import asyncHandler from "express-async-handler";
import Order from "../../models/Order.js";
import MenuItem from "../../models/MenuItem.js";
import User from "../../models/User.js";
import Review from "../../models/Review.js";
import { notifyUser } from "../../socket.js";
import { calculateLinePrice } from "../../utils/menuPricing.js";

/* @desc   Place a new order
@route  POST /api/customer/orders*/
export const placeOrder = asyncHandler(async (req, res) => {
  const { vendorId, items, deliveryAddress } = req.body;

  // Basic required-field validation
  if (!vendorId) {
    res.status(400);
    throw new Error("Vendor is required");
  }
  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("Cart is empty");
  }
  if (!deliveryAddress?.fullName?.trim() || !deliveryAddress?.phone?.trim() || !deliveryAddress?.address?.trim() || !deliveryAddress?.city?.trim() ) {
    res.status(400);
    throw new Error("Full name, phone, address and city are required");
  }

  // Confirm the vendor exists, is approved and is currently open
  const vendor = await User.findOne({
    _id: vendorId,
    role: "vendor",
    isApproved: true,
    isActive: true,
  });
  if (!vendor) {
    res.status(404);
    throw new Error("Restaurant not found");
  }
  if (!vendor.isOpen) {
    res.status(400);
    throw new Error("This restaurant is currently closed and not accepting orders");
  }

  /* Re-fetch each menu item from the database and recompute prices server-side
  to prevent tampering with the order data on the client side. */
  let itemsPrice = 0;
  const orderItems = [];

  for (const cartItem of items) {
    const menuItem = await MenuItem.findOne({ _id: cartItem._id, vendor: vendorId }).populate({
      path: "addonGroups",
      match: { isActive: true },
    });

    if (!menuItem) {
      res.status(400);
      throw new Error(`Item "${cartItem.name || cartItem._id}" is no longer available`);
    }
    if (!menuItem.inStock) {
      res.status(400);
      throw new Error(`"${menuItem.name}" is currently out of stock`);
    }
    if (!cartItem.quantity || cartItem.quantity < 1) {
      res.status(400);
      throw new Error(`Invalid quantity for "${menuItem.name}"`);
    }

    const priceInfo = calculateLinePrice(menuItem, cartItem.variantId, cartItem.addonOptionIds || []);
    const lineTotal = priceInfo.unitPrice * cartItem.quantity;
    itemsPrice += lineTotal;

    orderItems.push({
      name: menuItem.name,
      qty: cartItem.quantity,
      price: priceInfo.unitPrice,
      menuItem: menuItem._id,
      variantId: priceInfo.variant?._id || null,
      variantLabel: priceInfo.variant?.label || "",
      addonOptions: priceInfo.addons.map((a) => ({
        groupId: a.groupId,
        groupName: a.groupName,
        optionId: a.optionId,
        name: a.name,
        price: a.price,
      })),
    });
  }

  const deliveryFee = vendor.deliveryFee ?? 50;
  const totalPrice = itemsPrice + deliveryFee;

  const order = await Order.create({
    customer: req.user._id,
    vendor: vendorId,
    orderItems,
    deliveryAddress: {
      fullName: deliveryAddress.fullName.trim(),
      phone: deliveryAddress.phone.trim(),
      address: deliveryAddress.address.trim(),
      notes: deliveryAddress.notes?.trim() || "",
      city: deliveryAddress.city.trim(),
      coordinates: deliveryAddress.coordinates || { lat: null, lng: null },
    },
    itemsPrice,
    deliveryFee,
    totalPrice,
    orderStatus: "Pending",
  });

  // Let the vendor know a new order just came in
  notifyUser(order.vendor, "orderUpdate", {
    orderId: order._id,
    status: "Pending",
    message: "You have a new order!",
  });

  res.status(201).json({
    message: "Order placed successfully",
    order,
  });
});

/* @desc   Get logged-in customer's order history
 @route  GET /api/customer/orders*/
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.user._id })
    .populate("vendor", "shopName logo")
    .sort({ createdAt: -1 });

// Check which of these orders have already been reviewed by the customer
  const orderIds = orders.map((o) => o._id);
  const reviewedOrderIds = await Review.find({ order: { $in: orderIds } }).distinct("order");
  const reviewedSet = new Set(reviewedOrderIds.map((id) => id.toString()));

  const ordersWithReviewStatus = orders.map((order) => ({
    ...order.toObject(),
    hasReview: reviewedSet.has(order._id.toString()),
  }));

  res.status(200).json({ orders: ordersWithReviewStatus });
});

/* @desc   Get single order details (customer's own order only)
@route  GET /api/customer/orders/:id*/
export const getMyOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    customer: req.user._id,
  }).populate("vendor", "shopName logo phone");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.status(200).json({ order });
});

// @desc   Cancel a pending order (customer's own order only)
// @route  PUT /api/customer/orders/:id/cancel
export const cancelMyOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    customer: req.user._id,
  });
 
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
 
  if (order.orderStatus !== "Pending") {
    res.status(400);
    throw new Error(
      "This order can no longer be cancelled since the restaurant has already accepted it"
    );
  }
 
  order.orderStatus = "Rejected";
  order.cancelReason = "customer_cancelled";
  await order.save();

  // Let the vendor know this order was cancelled by the customer
  notifyUser(order.vendor, "orderUpdate", {
    orderId: order._id,
    status: "Rejected",
    message: "A customer cancelled order before you accepted it.",
  });
 
  res.status(200).json({ message: "Order cancelled successfully", order });
});