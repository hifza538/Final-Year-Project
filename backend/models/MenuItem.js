import mongoose from "mongoose";

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
    price: {
      type:     Number,
      required: [true, "Price is required"],
      min:      [1,    "Price must be greater than 0"],
    },
    category: {
      type:     String,
      required: [true, "Category is required"],
      enum: [
        "Burgers",
        "Pizza",
        "Biryani",
        "Drinks",
        "Desserts",
        "Sides",
        "Salads",
        "Breakfast",
        "Other",
      ],
    },

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

const MenuItem = mongoose.model("MenuItem", menuItemSchema);
export default MenuItem;