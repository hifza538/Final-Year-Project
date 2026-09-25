import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      minlength: [2, "Category name must be at least 2 characters"],
      maxlength: [50, "Category name must not exceed 50 characters"],
    },
    slug: { type: String, trim: true, lowercase: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

categorySchema.pre("save", function () {
  if (this.isModified("name")) this.slug = this.name.trim().toLowerCase().replace(/\s+/g, "-");
});

export default mongoose.model("Category", categorySchema);