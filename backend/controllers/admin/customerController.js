//backend/controllers/admin/customerController.js
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import User from "../../models/User.js";

// get all customers with optional filters for status and search
export const getAllCustomers = asyncHandler(async (req, res) => {
  const { status, search } = req.query;

  const query = { role: "customer" };

  if (status === "active") {
    query.isActive = true;
  } else if (status === "blocked") {
    query.isActive = false;
  }

  if (search?.trim()) {
    const regex = new RegExp(search.trim(), "i");
    query.$or = [{ fullName: regex }, { email: regex }, { phone: regex }];
  }

  const customers = await User.find(query).select("-password").sort({ createdAt: -1 });
  res.status(200).json({ customers });
});

// get a single customer's details + order history
export const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await User.findOne({ _id: req.params.id, role: "customer" })
    .select("-password")
    .populate("blockedBy", "fullName");

  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  // Check if the Order model exists
  let orders = [];
  let ordersFeatureReady = false;

  if (mongoose.models.Order) {
    ordersFeatureReady = true;
    const Order = mongoose.models.Order;
    orders = await Order.find({ customer: customer._id })
      .sort({ createdAt: -1 })
      .limit(20);
  }

  res.status(200).json({ customer, orders, ordersFeatureReady });
});

// toggle a customer's active status (block/unblock)
export const toggleCustomerBlock = asyncHandler(async (req, res) => {
  const customer = await User.findOne({ _id: req.params.id, role: "customer" });

  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  customer.isActive = !customer.isActive;

  if (!customer.isActive) {
    customer.blockedBy = req.user._id;
    customer.blockedAt = new Date();
  }

  await customer.save();

  res.status(200).json({
    message: customer.isActive ? "Customer unblocked" : "Customer blocked",
    isActive: customer.isActive,
  });
});