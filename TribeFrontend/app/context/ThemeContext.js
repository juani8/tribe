import React, { createContext, useState, useContext, useMemo } from 'react';
import colorsLightMode from 'assets/constants/colorsLightMode';
import colorsDarkMode from 'assets/constants/colorsDarkMode';
import { LogoDarkMode, LogoLightMode } from '../assets/images';

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Memoize the theme and logos to avoid unnecessary re-renders
  const theme = useMemo(() => ({
    colors: isDarkMode ? colorsDarkMode : colorsLightMode,
    logo: isDarkMode ? LogoDarkMode : LogoLightMode
  }), [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
