import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => setDarkMode(!darkMode);

  // Saaray colors yahan define kar dein
  const theme = {
    darkMode,
    bg: darkMode ? '#1a1a1a' : '#f4f7f6',
    card: darkMode ? '#2d2d2d' : '#ffffff',
    text: darkMode ? '#f5f5f5' : '#1a1a1a',
    subText: darkMode ? '#aaa' : '#666',
    border: darkMode ? '#3d3d3d' : '#eeeeee',
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
