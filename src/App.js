import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Vendors from './pages/Vendors';
import Customers from './pages/Customers';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { useTheme } from './ThemeContext'; // Theme use karein

function App() {
  const { bg, text } = useTheme(); // Colors nikaalein

  return (
    <Router>
      <div style={{ display: 'flex', backgroundColor: bg, color: text, minHeight: '100vh', transition: '0.3s' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <div style={{ padding: '40px', overflowY: 'auto' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
