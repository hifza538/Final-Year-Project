import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Register from "./pages/Register";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;