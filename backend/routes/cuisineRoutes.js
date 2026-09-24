//backend/routes/cuisineRoutes.js
import express from "express";
import { getActiveCuisines } from "../controllers/public/cuisineController.js";

const router = express.Router();

// Public route to get all active cuisines
router.get("/", getActiveCuisines);

export default router;