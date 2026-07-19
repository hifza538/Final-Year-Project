// admin-frontend/src/App.jsx

import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: { background: "#333", color: "#fff" },
            success: {
              iconTheme: { primary: "#E8590C", secondary: "#fff" },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
