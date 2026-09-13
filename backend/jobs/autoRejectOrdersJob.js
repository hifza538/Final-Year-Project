// backend/jobs/autoRejectOrdersJob.js
import cron from "node-cron";
import { autoRejectStaleOrders } from "../utils/autoRejectStaleOrders.js";
 
// Start a cron job that runs every minute to check for stale orders which have been pending for too long and auto-rejects them
export const startAutoRejectOrdersJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      await autoRejectStaleOrders();
    } catch (err) {
      console.error("[auto-reject] Failed to run stale order check:", err.message);
    }
  });
 
  console.log("[auto-reject] Background job started - checking every minute");
};