import express from "express";
import { registerVendor } from "../controllers/auth/authController.js";

const router = express.Router();

// public route for vendor registration
router.post("/register", registerVendor);


export default router;