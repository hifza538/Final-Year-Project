// customer-frontend/src/App.jsx

import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { LocationProvider } from "./context/LocationContext";
import { NotificationProvider } from "./context/NotificationContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      {/* authprovider, cartprovider, locationprovider and notificationprovider
          are used to provide global state to all components */}
      <AuthProvider>
        <CartProvider>
          <LocationProvider>
            <NotificationProvider>
              <AppRoutes />
              {/* Global toast notifications for success and error messages */}
              <Toaster position="top-center" />
            </NotificationProvider>
          </LocationProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;