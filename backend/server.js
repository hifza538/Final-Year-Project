import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";

import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();
connectDB();

const app = express();

// frontend cors configuration
app.use(cors({
  origin: [
    "http://localhost:5173", // vendor frontend
    "http://localhost:5174", // customer frontend
    "http://localhost:5175", // delivery frontend
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// check if the server is running
app.get("/", (req, res) => {
  res.json({ message: "LocalBites API is running..." });
});

// auth routes
app.use("/api/auth", authRoutes);
app.use("/api/vendor", vendorRoutes);

app.use("/api/customer", customerRoutes);

// delivery routes
app.use("/api/delivery", deliveryRoutes);
// error handling middleware
app.use(notFound);
app.use(errorHandler);

// start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;