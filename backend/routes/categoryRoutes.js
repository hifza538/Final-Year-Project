import express from "express";
import { getActiveCategories } from "../controllers/public/categoryController.js";

const router = express.Router();
router.get("/", getActiveCategories);

export default router;