import express from "express";
import { registerVendor } from "../controllers/auth/authController.js";
import {uploadCnic} from "../config/cloudinary.js";
const router = express.Router();

// public route for vendor registration
router.post(
  "/register",
  uploadCnic.fields([
    { name: "cnicFront", maxCount: 1 },
    { name: "cnicBack", maxCount: 1 },
  ]),
  registerVendor
);


export default router;