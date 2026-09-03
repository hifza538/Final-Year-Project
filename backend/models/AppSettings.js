//backend/models/AppSettings.js
import mongoose from "mongoose";

const appSettingsSchema = new mongoose.Schema(
  {
    commissionPercentage: {
      type: Number,
      default: 10,
      min: [0, "Commission cannot be negative"],
      max: [100, "Commission cannot exceed 100%"],
    },
    defaultDeliveryFee: {
      type: Number,
      default: 50,
      min: [0, "Delivery fee cannot be negative"],
    },
    minOrderAmount: {
      type: Number,
      default: 200,
      min: [0, "Minimum order amount cannot be negative"],
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const AppSettings = mongoose.model("AppSettings", appSettingsSchema);
export default AppSettings;