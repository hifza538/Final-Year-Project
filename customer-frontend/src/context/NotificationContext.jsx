// customer-frontend/src/context/NotificationContext.jsx

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { showSuccessToast } from "../utils/toast";

// Socket.io connects to the server root, not the "/api" REST path
const SOCKET_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(
  /\/api\/?$/,
  ""
);

const NotificationContext = createContext();

// Connects to the backend over Socket.io whenever the customer is logged
// in, listens for order-status updates, and keeps a running list of them
// for the notification bell.
export const NotificationProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    // Not logged in - make sure any old connection is closed and stop here
    if (!isAuthenticated || !token) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    const socket = io(SOCKET_URL, {
      auth: { token },
    });
    socketRef.current = socket;

    socket.on("orderUpdate", (payload) => {
      setNotifications((prev) => [
        { ...payload, id: `${payload.orderId}-${Date.now()}`, read: false, receivedAt: new Date() },
        ...prev,
      ]);
      showSuccessToast(payload.message);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, token]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);