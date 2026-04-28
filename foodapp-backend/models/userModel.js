// models/userModel.js
import mongoose from "mongoose";

/* ====USER MODEL === */
// This schema stores user account data and password reset OTP

const otpSchema = new mongoose.Schema(
  {
    code: String,
    expiresAt: Date,
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["customer", "restaurantOwner"],
      default: "customer",
    },

    resetOtp: {
      type: String,
      default: null,
    },

    resetOtpExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


export default mongoose.model("User", userSchema);
