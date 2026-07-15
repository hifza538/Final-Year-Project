import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// protect routes middleware to ensure user is authenticated
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database (exclude password)
      req.user = await User.findById(decoded.id).select("-password");

      // Check if user still exists in database
      if (!req.user) {
        res.status(401);
        throw new Error("User no longer exists");
      }

      // Check if account is active
      if (!req.user.isActive) {
        res.status(403);
        throw new Error("Your account has been deactivated. Contact support.");
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }
});

// vendor middleware to ensure user is a vendor and approved by admin
export const vendorOnly = (req, res, next) => {
  if (req.user?.role !== "vendor" && req.user?.role !== "admin") {
    res.status(403);
    throw new Error("Access denied, vendor only");
  }

  // Check vendor is approved by admin
  if (req.user?.role === "vendor" && !req.user?.isApproved) {
    res.status(403);
    throw new Error("Your account is pending admin approval");
  }

  next();
};

// admin only middleware to ensure user is an admin
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    res.status(403);
    throw new Error("Access denied, admin only");
  }
  next();
};

// customer only middleware to ensure user is a customer
export const customerOnly = (req, res, next) => {
  if (req.user?.role !== "customer") {
    res.status(403);
    throw new Error("Access denied, customers only");
  }
  next();
};