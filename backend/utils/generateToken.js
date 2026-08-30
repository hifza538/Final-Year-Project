// server/src/utils/generateToken.js

import jwt from "jsonwebtoken";

// Shared across vendor, customer and (future) delivery controllers
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export default generateToken;