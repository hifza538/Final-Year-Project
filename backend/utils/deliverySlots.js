// backend/utils/deliverySlots.js
// Single source of truth for the 3 fixed daily slots and their time windows.
export const SLOT_DEFINITIONS = {
  Morning: { label: "8:00 AM - 2:00 PM", startHour: 8, endHour: 14 },
  Afternoon: { label: "2:00 PM - 8:00 PM", startHour: 14, endHour: 20 },
  Night: { label: "8:00 PM - 2:00 AM", startHour: 20, endHour: 26 }, // wraps past midnight
};

export const getTodayDateString = () => new Date().toISOString().split("T")[0];

export const isWithinSlot = (slotName) => {
  const def = SLOT_DEFINITIONS[slotName];
  if (!def) return false;
  const now = new Date();
  let hour = now.getHours() + now.getMinutes() / 60;
  // For a wrapping slot (e.g. 8pm-2am), hours after midnight (0-2) need +24
  // to compare correctly against the 20-26 range.
  if (def.endHour > 24 && hour < def.endHour - 24) {
    hour += 24;
  }
  return hour >= def.startHour && hour < def.endHour;
};