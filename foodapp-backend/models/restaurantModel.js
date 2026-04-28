// models/Restaurant.js
import mongoose from "mongoose";

/* -------------------------------------------------------------------------- */
/*                               Review Schema                                */
/* -------------------------------------------------------------------------- */
const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    date: {
      type: String,
      default: "Just now",
    },

    comment: {
      type: String,
      required: true,
      trim: true,
    },

    avatar: {
      type: String,
      default: "",
    },
  },
  { _id: true },
);

/* -------------------------------------------------------------------------- */
/*                               Deal Schema                                  */
/* -------------------------------------------------------------------------- */
const dealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    expiry: {
      type: String,
      default: "",
    },

    minOrder: {
      type: String,
      default: "",
    },
  },
  { _id: true },
);

/* -------------------------------------------------------------------------- */
/*                              Menu Item Schema                              */
/* -------------------------------------------------------------------------- */
const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    image: {
      type: String,
      default: "",
    },
  },
  { _id: true },
);

/* -------------------------------------------------------------------------- */
/*                              Menu Schema                                   */
/* -------------------------------------------------------------------------- */
const menuSchema = new mongoose.Schema(
  {
    categories: {
      type: [String],
      default: [],
    },

    items: {
      type: [menuItemSchema],
      default: [],
    },
  },
  { _id: false },
);

/* -------------------------------------------------------------------------- */
/*                              Reviews Summary                               */
/* -------------------------------------------------------------------------- */
const reviewsSchema = new mongoose.Schema(
  {
    average: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      default: 0,
    },

    items: {
      type: [reviewSchema],
      default: [],
    },
  },
  { _id: false },
);

/* -------------------------------------------------------------------------- */
/*                             Restaurant Schema                              */
/* -------------------------------------------------------------------------- */
const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    cuisine: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      default: "",
      trim: true,
    },

    rating: {
      type: Number,
      default: 0,
    },

    reviewsCount: {
      type: Number,
      default: 0,
    },

    distance: {
      type: String,
      default: "",
    },

    deliveryTime: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    hours: {
      type: String,
      default: "",
    },

    bannerImage: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    menu: {
      type: menuSchema,
      default: () => ({
        categories: [],
        items: [],
      }),
    },

    deals: {
      type: [dealSchema],
      default: [],
    },

    reviews: {
      type: reviewsSchema,
      default: () => ({
        average: 0,
        total: 0,
        items: [],
      }),
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Restaurant", restaurantSchema);
