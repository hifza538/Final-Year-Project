// utils/generateToken.js
import jwt from "jsonwebtoken";

/* == JWT GENERATOR == */
// This function creates a signed JWT token for logged-in user

const generateToken = (userId) => {
  return jwt.sign({ id:userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export default generateToken;