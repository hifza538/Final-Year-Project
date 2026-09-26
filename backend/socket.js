// backend/socket.js
 
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
 
// Keep this in sync with the allowedOrigins list in server.js
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "https://localbites-customer.vercel.app",
  "https://localbites-vendor-zeta.vercel.app",
  "https://locatbites-rider.vercel.app",
  "https://localbites-admin.vercel.app",
];
 
let io;
 
// Initialize the Socket.IO server and set up authentication and event handling
export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    },
  });
 
  // Authenticate every socket connection using the same JWT the REST API uses
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Authentication required"));
    }
 
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("_id role");
 
      if (!user) {
        return next(new Error("User not found"));
      }
 
      socket.userId = user._id.toString();
      socket.userRole = user.role;
      next();
    } catch (err) {
      next(new Error("Invalid or expired token"));
    }
  });
 
  io.on("connection", (socket) => {
    socket.join(socket.userId);
    socket.join(`role:${socket.userRole}`);
    console.log(`[socket] ${socket.userRole} ${socket.userId} connected`);
 
    socket.on("disconnect", () => {
      console.log(`[socket] ${socket.userRole} ${socket.userId} disconnected`);
    });
  });
 
  return io;
};
 
// Sends an event to exactly one user, by their user ID
export const notifyUser = (userId, event, payload) => {
  if (!io) return;
  io.to(userId.toString()).emit(event, payload);
};
 
// Sends an event to all users of a specific role 
export const notifyRole = (role, event, payload) => {
  if (!io) return;
  io.to(`role:${role}`).emit(event, payload);
};
 
export const getIO = () => io;
 