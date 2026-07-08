import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // basic user information
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [3, "Full name must be at least 3 characters"],
      maxlength: [100, "Full name must not exceed 100 characters"],
    },
    firstName: {
      type: String,
      trim: true,
      default: "",
    },
    lastName: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // never returned in queries by default
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    role: {
      type: String,
      enum: ["customer", "vendor", "delivery", "admin"],
      default: "customer",
    },

    // Vendor Specific Fields
    shopName: { type: String, trim: true, default: "" },
    shopLocation: { type: String, trim: true, default: "" },
    shopAddress: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    zone: { type: String, trim: true, default: "" },
    cuisine: { type: String, trim: true, default: "" },

    coverPhoto: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    logo: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    isOpen: { type: Boolean, default: false },

    minPrepTime: { type: Number, default: 15 },
    maxPrepTime: { type: Number, default: 45 },
    coordinates: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },

    // Operational Hours & Service Types
    openingTime: { type: String, default: "09:00" },
    closingTime: { type: String, default: "22:00" },
    serviceTypes: {
      delivery: { type: Boolean, default: true },
      pickup: { type: Boolean, default: true },
    },

    // legal & Verification Fields
    cnicNumber: { type: String, trim: true, default: "" },
    ntnNumber: { type: String, trim: true, default: "" },
    hasFoodLicense: { type: Boolean, default: false },

    // cnic images
    cnicFront: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    cnicBack: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },

    // Account Status Fields
    isApproved: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    // Timestamps
  },
  { timestamps: true },
);

// hash the password before saving the user document
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// method to compare entered password with hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
