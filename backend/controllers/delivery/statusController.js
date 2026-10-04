// backend/controllers/delivery/statusController.js
import asyncHandler from "express-async-handler";
import User from "../../models/User.js";
import { SLOT_DEFINITIONS, getTodayDateString, isWithinSlot } from "../../utils/deliverySlots.js";

// @desc   Toggle rider's online/offline status
// @route  PATCH /api/delivery/status
export const updateOnlineStatus = asyncHandler(async (req, res) => {
  const { isOnline } = req.body;

  if (typeof isOnline !== "boolean") {
    res.status(400);
    throw new Error("isOnline must be true or false");
  }

  // Going online requires a valid, currently-active slot booking
  if (isOnline) {
    const rider = await User.findById(req.user._id);
    const today = getTodayDateString();

    if (!rider.todaySlot || rider.todaySlotDate !== today) {
      res.status(400);
      throw new Error("Please book today's delivery slot before going online");
    }
    if (!isWithinSlot(rider.todaySlot)) {
      res.status(400);
      throw new Error(
        `You can only go online during your booked slot (${SLOT_DEFINITIONS[rider.todaySlot].label})`
      );
    }
  }

  const user = await User.findByIdAndUpdate(req.user._id, { isOnline }, { new: true });

  res.status(200).json({
    message: isOnline ? "You are now online" : "You are now offline",
    isOnline: user.isOnline,
  });
});

// @desc   Book today's delivery slot
// @route  PATCH /api/delivery/status/slot
export const selectSlot = asyncHandler(async (req, res) => {
  const { slot } = req.body;

  if (!SLOT_DEFINITIONS[slot]) {
    res.status(400);
    throw new Error("Invalid slot selected");
  }

  const today = getTodayDateString();
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { todaySlot: slot, todaySlotDate: today },
    { new: true }
  );

  res.status(200).json({
    message: `Slot booked: ${SLOT_DEFINITIONS[slot].label}`,
    todaySlot: user.todaySlot,
  });
});

// @desc   Get today's booked slot (and the available slot options)
// @route  GET /api/delivery/status/slot
export const getTodaySlot = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const today = getTodayDateString();
  const hasValidSlot = user.todaySlot && user.todaySlotDate === today;

  res.status(200).json({
    todaySlot: hasValidSlot ? user.todaySlot : null,
    slots: SLOT_DEFINITIONS,
  });
});