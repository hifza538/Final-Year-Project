import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // Customer who placed the order
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Vendor who received the order
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Delivery rider assigned to order
    deliveryRider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Items in the order
    orderItems: [
      {
        name: {
          type: String,
          required: true,
        },
        qty: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
        price: {
          type: Number,
          required: true,
        },
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
        },
      },
    ],

    // Delivery address details
    deliveryAddress: {
      fullName: { type: String, default: "" },
      phone:    { type: String, default: "" },
      address:  { type: String, default: "" },
      city:     { type: String, default: "" },
      notes:    { type: String, default: "" },
    },

    // Price breakdown
    itemsPrice:   { type: Number, default: 0 },
    deliveryFee:  { type: Number, default: 0 },
    taxPrice:     { type: Number, default: 0 },
    totalPrice:   { type: Number, default: 0 },

    // Order status flow
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Preparing",
        "Ready",
        "OutForDelivery",
        "Completed",
        "Rejected",
      ],
      default: "Pending",
    },

    // Payment status
    isPaid:       { type: Boolean, default: false },
    isDelivered:  { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;