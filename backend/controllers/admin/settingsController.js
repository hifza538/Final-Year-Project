//backend/controllers/admin/settingsController.js
import asyncHandler from "express-async-handler";
import AppSettings from "../../models/AppSettings.js";

const getOrCreateSettings = async () => {
  let settings = await AppSettings.findOne();
  if (!settings) {
    settings = await AppSettings.create({});
  }
  return settings;
};

// get current app settings
export const getSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  res.status(200).json({ settings });
});

// update app settings
export const updateSettings = asyncHandler(async (req, res) => {
  const { commissionPercentage, defaultDeliveryFee, minOrderAmount } = req.body;

  const settings = await getOrCreateSettings();

  if (commissionPercentage !== undefined) settings.commissionPercentage = commissionPercentage;
  if (defaultDeliveryFee !== undefined) settings.defaultDeliveryFee = defaultDeliveryFee;
  if (minOrderAmount !== undefined) settings.minOrderAmount = minOrderAmount;
  settings.updatedBy = req.user._id;

  await settings.save();
  res.status(200).json({ settings, message: "Settings updated successfully" });
});