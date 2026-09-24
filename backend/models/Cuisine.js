//backend/models/Cuisine.js
import mongoose from "mongoose";

const cuisineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Cuisine name is required"],
      trim: true,
      unique: true,
      minlength: [2, "Cuisine name must be at least 2 characters"],
      maxlength: [50, "Cuisine name must not exceed 50 characters"],
    },
    slug: { type: String, trim: true, lowercase: true },
    image: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    isActive: { type: Boolean, default: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

cuisineSchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = this.name.trim().toLowerCase().replace(/\s+/g, "-");
  }
});

const Cuisine = mongoose.model("Cuisine", cuisineSchema);
export default Cuisine;