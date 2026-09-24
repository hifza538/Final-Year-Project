// backend/models/MenuItem.js
import mongoose from "mongoose";

// Price of a menu item variant
const variantSchema = new mongoose.Schema({
  label: {
    type:      String,
    required:  [true, "Size label is required"],
    trim:      true,
    maxlength: [40, "Size label must not exceed 40 characters"],
  },
  price: {
    type:     Number,
    required: [true, "Price is required"],
    min:      [1, "Price must be greater than 0"],
  },
  isAvailable: { type: Boolean, default: true },
});

const menuItemSchema = new mongoose.Schema(
  {
    // Vendor who owns this menu item
    vendor: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },

    // Basic Info
    name: {
      type:      String,
      required:  [true, "Item name is required"],
      trim:      true,
      minlength: [2,   "Name must be at least 2 characters"],
      maxlength: [100, "Name must not exceed 100 characters"],
    },
    description: {
      type:      String,
      trim:      true,
      default:   "",
      maxlength: [500, "Description must not exceed 500 characters"],
    },

    // Category of this menu item
    category: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "Category",
      required: [true, "Category is required"],
    },

    // Variants (sizes) of this menu item
    variants: {
      type: [variantSchema],
      validate: [(v) => v.length > 0, "At least one variant is required"],
    },

    // Addon groups that can be attached to this menu item
    addonGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: "AddonGroup" }],

    // Price of the menu item (minimum price among variants)
    price: { type: Number, min: 1 },

    // Item Image
    image: {
      url:      { type: String, default: "" },
      publicId: { type: String, default: "" },
    },

    // Availability
    inStock: {
      type:    Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

menuItemSchema.pre("validate", function () {
  if (this.variants?.length) {
    this.price = Math.min(...this.variants.map((v) => v.price));
  }
});

menuItemSchema.index({ vendor: 1, category: 1 });

const MenuItem = mongoose.model("MenuItem", menuItemSchema);
export default MenuItem;
