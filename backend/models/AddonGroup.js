// backend/models/AddonGroup.js
import mongoose from "mongoose";

// Price of an option for one specific size
const sizePriceSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true, maxlength: 40 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const optionSchema = new mongoose.Schema({
  name: {
    type:      String,
    required:  [true, "Option name is required"],
    trim:      true,
    maxlength: [60, "Option name must not exceed 60 characters"],
  },
  // Flat price. Used when the option has no size-specific price
  price: { type: Number, default: 0, min: 0 },
  sizePrices:  { type: [sizePriceSchema], default: [] },
  isAvailable: { type: Boolean, default: true },
});

// AddonGroup schema
const addonGroupSchema = new mongoose.Schema(
  {
    vendor: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
      index:    true,
    },
    name: {
      type:      String,
      required:  [true, "Group name is required"],
      trim:      true,
      minlength: [2,  "Group name must be at least 2 characters"],
      maxlength: [50, "Group name must not exceed 50 characters"],
    },
    // minSelect > 0 means the customer MUST choose (required group)
    minSelect: { type: Number, default: 0, min: 0 },
    // maxSelect 0 means unlimited
    maxSelect: { type: Number, default: 0, min: 0 },
    options: {
      type: [optionSchema],
      validate: [(v) => v.length > 0, "At least one option is required"],
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

addonGroupSchema.pre("validate", function () {
  if (this.maxSelect > 0 && this.maxSelect < this.minSelect) {
    throw new Error("Max selection cannot be less than min selection");
  }
  if (this.minSelect > this.options.length) {
    throw new Error("Min selection cannot be more than the number of options");
  }
});

const AddonGroup = mongoose.model("AddonGroup", addonGroupSchema);
export default AddonGroup;
