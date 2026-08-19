// server/controllers/customer/orderController.js

import asyncHandler from "express-async-handler";
import Order from "../../models/Order.js";
import MenuItem from "../../models/MenuItem.js";
import User from "../../models/User.js";
import Review from "../../models/Review.js";

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
    const menuItem = await MenuItem.findOne({ _id: cartItem._id, vendor: vendorId });

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

    const lineTotal = menuItem.price * cartItem.quantity;
    itemsPrice += lineTotal;

    orderItems.push({
      name: menuItem.name,
      qty: cartItem.quantity,
      price: menuItem.price,
      menuItem: menuItem._id,
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
    },
    itemsPrice,
    deliveryFee,
    taxPrice: 0,
    totalPrice,
    orderStatus: "Pending",
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