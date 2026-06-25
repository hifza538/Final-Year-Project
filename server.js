import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();

// frontend cors configuration
app.use(cors({
  origin: [
    "http://localhost:5173", // vendor frontend
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// check if the server is running
app.get("/", (req, res) => {
  res.json({ message: "LocalBites API is running..." });
});


// start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;