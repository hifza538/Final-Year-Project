// backend/utils/autoRejectStaleOrders.js
import Order from "../models/Order.js";
 
// Vendors get this long to accept a new order before it's auto-rejected
const ACCEPT_TIMEOUT_MINUTES = 5;
 
// Automatically reject stale orders that have been pending for too long
export const autoRejectStaleOrders = async () => {
  const cutoff = new Date(Date.now() - ACCEPT_TIMEOUT_MINUTES * 60 * 1000);
 
  const result = await Order.updateMany(
    { orderStatus: "Pending", createdAt: { $lt: cutoff } },
    { $set: { orderStatus: "Rejected" } }
  );
 
  if (result.modifiedCount > 0) {
    console.log(`[auto-reject] ${result.modifiedCount} stale order(s) auto-rejected`);
  }
};