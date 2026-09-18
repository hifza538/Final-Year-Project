// backend/utils/autoRejectStaleOrders.js
import Order from "../models/Order.js";
import { notifyUser } from "../socket.js";
 
// Vendors get this long to accept a new order before it's auto-rejected
const ACCEPT_TIMEOUT_MINUTES = 5;
 
// Automatically reject stale orders that have been pending for too long
export const autoRejectStaleOrders = async () => {
  const cutoff = new Date(Date.now() - ACCEPT_TIMEOUT_MINUTES * 60 * 1000);
 
  // Find all orders that are still pending and were created before the cutoff time
  const staleOrders = await Order.find({
    orderStatus: "Pending",
    createdAt: { $lt: cutoff },
  }).select("_id customer");
 
  if (staleOrders.length === 0) return;
 
  const staleOrderIds = staleOrders.map((o) => o._id);
 
  await Order.updateMany(
    { _id: { $in: staleOrderIds } },
    { $set: { orderStatus: "Rejected" } }
  );
 
  staleOrders.forEach((order) => {
    notifyUser(order.customer, "orderUpdate", {
      orderId: order._id,
      status: "Rejected",
      message: "The restaurant didn't respond in time, so your order was automatically cancelled.",
    });
  });
 
  console.log(`[auto-reject] ${staleOrders.length} stale order(s) auto-rejected`);
};