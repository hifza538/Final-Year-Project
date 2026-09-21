// delivery-frontend/src/utils/deliveryStages.js
// This file defines the delivery stages and their labels for the delivery rider interface. 
export const STAGE_SEQUENCE = ["Accepted", "ArrivedAtRestaurant", "PickedUp", "OnTheWay", "Delivered"];

export const STAGE_LABELS = {
  Accepted: "Accepted",
  ArrivedAtRestaurant: "Arrived at Restaurant",
  PickedUp: "Picked Up",
  OnTheWay: "On the Way",
  Delivered: "Delivered",
};

// What the action button should say based on the CURRENT stage
export const NEXT_ACTION_LABEL = {
  Accepted: "Arrived at Restaurant",
  ArrivedAtRestaurant: "Mark Picked Up",
  PickedUp: "Start Delivery",
  OnTheWay: "Mark Delivered",
};