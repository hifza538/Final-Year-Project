//backend/controllers/vendor/orderController.js
import asyncHandler from "express-async-handler";
import Order from "../../models/Order.js";
import { notifyUser, notifyRole } from "../../socket.js";

// Helper function to format order response
export const getVendorOrders = asyncHandler(async (req, res) => {
  const { status } = req.query;

  // Build filter object
  const filter = { vendor: req.user._id };
  if (status) filter.orderStatus = status;

  const orders = await Order.find(filter)
    .populate("customer", "fullName phone email")
    .sort({ createdAt: -1 });

  res.status(200).json({ orders });
});

// get a single order details
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id:    req.params.id,
    vendor: req.user._id,
  }).populate("customer", "fullName phone email");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.status(200).json({ order });
});

// update order status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  // Valid status values
  const validStatuses = [
    "Accepted",
    "Preparing",
    "Ready",
    "OutForDelivery",
    "Completed",
    "Rejected",
  ];

  if (!status || !validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid status value");
  }

  // Find the order and ensure it belongs to this vendor
  const order = await Order.findOne({
    _id:    req.params.id,
    vendor: req.user._id,
  });

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Define allowed status transitions
  const statusFlow = {
    Pending:        ["Accepted", "Rejected"],
    Accepted:       ["Preparing"],
    Preparing:      ["Ready"],
    Ready:          [],
    OutForDelivery: [],
    Completed:      [],
    Rejected:       [],
  };

  const allowedNext = statusFlow[order.orderStatus] || [];
  if (!allowedNext.includes(status)) {
    res.status(400);
    throw new Error(
      `Cannot change status from "${order.orderStatus}" to "${status}"`
    );
  }

  order.orderStatus = status;

    // Vendor rejected the order themselves - counts against the vendor's performance
  if (status === "Rejected") {
    order.cancelReason = "vendor_rejected";
  }

  // Mark as delivered when completed
  if (status === "Completed") {
    order.isDelivered = true;
  }

  await order.save();

  // Notify the customer about the status change
  const statusMessages = {
    Accepted: "Your order has been accepted by the restaurant!",
    Preparing: "Your order is being prepared.",
    Ready: "Your order is ready and waiting for a delivery rider.",
    Rejected: "Your order was rejected by the restaurant.",
  };

  if (statusMessages[status]) {
    notifyUser(order.customer, "orderUpdate", {
      orderId: order._id,
      status: order.orderStatus,
      message: statusMessages[status],
    });
  }
 
  // Notify delivery riders when the order is ready for pickup
  if (status === "Ready") {
    notifyRole("delivery", "orderUpdate", {
      orderId: order._id,
      status: "Ready",
      message: "A new order is available for pickup!",
    });
  }

  res.status(200).json({
    message: "Order status updated successfully",
    order,
  });
});