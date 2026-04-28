// script/seedRestaurant.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import restaurantModel from "../models/restaurantModel.js";
import restaurantSeedData from "../data/restaurantSeedData.js";

dotenv.config();

const seedRestaurants = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await restaurantModel.deleteMany();
    console.log("Old restaurants removed");

    await restaurantModel.insertMany(restaurantSeedData);
    console.log("Restaurants seeded successfully");

    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedRestaurants();