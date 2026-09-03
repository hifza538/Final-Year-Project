//backend/routes/categoryRoutes.js
import express from "express";
import { getActiveCategories } from "../controllers/public/categoryController.js";

const router = express.Router();

// Public route to get all active categories
router.get("/", getActiveCategories);

export default router;