// backend/seeders/createAdmin.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();
// Admin seeder script to create an initial admin account if none exists
const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database");

    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("An admin account already exists:", existingAdmin.email);
      process.exit(0);
    }

    const admin = await User.create({
      fullName: "LocalBites Admin",
      email: "admin@localbites.com",
      password: "Admin123",
      phone: "03000000000",
      role: "admin",
      isActive: true,
    });

    console.log("Admin account created successfully:");
    console.log("Email:", admin.email);
    console.log("Please log in and consider changing the password.");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
