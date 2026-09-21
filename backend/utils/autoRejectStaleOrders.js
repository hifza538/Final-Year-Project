// backend/utils/autoRejectStaleOrders.js
import Order from "../models/Order.js";
import { notifyUser } from "../socket.js";

// Time in minutes after which a pending order is considered stale and should be auto-rejected
export const ACCEPT_TIMEOUT_MINUTES = 10;

// Automatically reject stale orders that have been pending for too long
export const autoRejectStaleOrders = async () => {
  const cutoff = new Date(Date.now() - ACCEPT_TIMEOUT_MINUTES * 60 * 1000);

  // Find all orders that are still pending and were created before the cutoff time
  const staleOrders = await Order.find({
    orderStatus: "Pending",
    createdAt: { $lt: cutoff },
  }).select("_id customer vendor");

  if (staleOrders.length === 0) return;

  let rejectedCount = 0;

  for (const order of staleOrders) {
    // Only update the order if it is still pending (to avoid race conditions)
    const updated = await Order.findOneAndUpdate(
      { _id: order._id, orderStatus: "Pending" },
      { $set: { orderStatus: "Rejected", cancelReason: "vendor_timeout" } },
      { new: true }
    );

    if (!updated) continue;
    rejectedCount++;

    notifyUser(order.customer, "orderUpdate", {
      orderId: order._id,
      status: "Rejected",
      message: "The restaurant didn't respond in time, so your order was automatically cancelled.",
    });

    notifyUser(order.vendor, "orderUpdate", {
      orderId: order._id,
      status: "Rejected",
      message: "An order was automatically cancelled because it wasn't accepted in time.",
    });
  }

  if (rejectedCount > 0) {
    console.log(`[auto-reject] ${rejectedCount} stale order(s) auto-rejected`);
  }
};