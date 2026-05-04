// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

/* ===== PROTECT ROUTE ===== */
// JWT token check karta hai aur user attach karta hai

export const protect = async (req, res, next) => {
  try {
    let token;

    // Bearer token check
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Please login first.",
      });
    }

    // Token verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // User find - password exclude
    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Token invalid.",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    // Token expired ya invalid
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

/* ===== AUTHORIZE ROLES ===== */
// Specific roles ko allow karta hai

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Only ${roles.join(", ")} can access this.`,
      });
    }
    next();
  };
};