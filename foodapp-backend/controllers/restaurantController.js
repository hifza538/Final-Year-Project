// controllers/restaurantController.js
import restaurantModel from "../models/restaurantModel.js";
import restaurantSeedData from "../data/restaurantSeedData.js";

/* -------------------------------------------------------------------------- */
/*                           GET ALL RESTAURANTS                              */
/* -------------------------------------------------------------------------- */
/*
  Features:
  - search by name
  - filter by cuisine
  - sort by rating / latest
*/
export const getAllRestaurants = async (req, res) => {
  try {
    const { search, cuisine, sort } = req.query;

    let query = {};

    // Search by restaurant name
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Filter by cuisine
    if (cuisine) {
      query.cuisine = { $regex: `^${cuisine}$`, $options: "i" };
    }

    let restaurantsQuery = restaurantModel.find(query);

    // Sorting
    if (sort === "rating") {
      restaurantsQuery = restaurantsQuery.sort({ rating: -1 });
    } else if (sort === "latest") {
      restaurantsQuery = restaurantsQuery.sort({ createdAt: -1 });
    } else {
      restaurantsQuery = restaurantsQuery.sort({ createdAt: -1 });
    }

    const restaurants = await restaurantsQuery;

    res.status(200).json({
      count: restaurants.length,
      restaurants,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to fetch restaurants",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                         GET SINGLE RESTAURANT BY ID                        */
/* -------------------------------------------------------------------------- */
export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await restaurantModel.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to fetch restaurant",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                           GET UNIQUE CUISINES                              */
/* -------------------------------------------------------------------------- */
export const getAllCuisines = async (req, res) => {
  try {
    const cuisines = await restaurantModel.distinct("cuisine");

    res.status(200).json(cuisines);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to fetch cuisines",
    });
  }
};
/* -------------------------------------------------------------------------- */
/*                           SEED RESTAURANTS DATA                            */
/* -------------------------------------------------------------------------- */
export const seedRestaurants = async (req, res) => {
  try {
    // Purana data delete karo
    await restaurantModel.deleteMany();

    // Naya data insert karo
    const inserted = await restaurantModel.insertMany(restaurantSeedData);

    res.status(201).json({
      message: "Data seeded successfully",
      count: inserted.length,
      restaurants: inserted,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Seeding failed",
    });
  }
};