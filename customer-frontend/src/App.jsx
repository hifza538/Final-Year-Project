// customer-frontend/src/App.jsx

import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      {/* authprovider and cartprovider are used to provide global state to all components */}
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
          {/* Global toast notifications for success and error messages */}
          <Toaster position="top-center" />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
