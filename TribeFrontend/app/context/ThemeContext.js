import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { useColorScheme } from 'react-native'; // For detecting system theme
import colorsLightMode from 'assets/constants/colorsLightMode';
import colorsDarkMode from 'assets/constants/colorsDarkMode';
import { LogoDarkMode, LogoLightMode } from '../assets/images';

import changeNavigationBarColor from 'react-native-navigation-bar-color';

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  // Detect system-wide theme (light/dark)
  const systemColorScheme = useColorScheme();
  
  // State to determine whether to follow the system theme
  const [useSystemTheme, setUseSystemTheme] = useState(true);
  
  // State to manually control dark mode if not using system theme
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  
  // Toggle theme manually when not using system theme
  const toggleTheme = () => {
    if (!useSystemTheme) {
      setIsDarkMode((prevMode) => !prevMode);
    }
  };
  
  // Determine the active theme
  const isCurrentlyDarkMode = useMemo(() => {
    return useSystemTheme ? (systemColorScheme === 'dark') : isDarkMode;
  }, [useSystemTheme, systemColorScheme, isDarkMode]);
  
  // Memoize the theme and logos to avoid unnecessary re-renders
  const theme = useMemo(() => ({
    colors: isCurrentlyDarkMode ? colorsDarkMode : colorsLightMode,
    logo: isCurrentlyDarkMode ? LogoDarkMode : LogoLightMode
  }), [isCurrentlyDarkMode]);

  // Function to toggle whether to use the system theme
  const toggleSystemThemeUsage = () => {
    setUseSystemTheme((prev) => !prev);
  };

  // Update navigation bar color whenever the theme changes
  useEffect(() => {
    changeNavigationBarColor(theme.colors.background, true);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{
      isDarkMode: isCurrentlyDarkMode,
      useSystemTheme,
      theme,
      toggleTheme,
      toggleSystemThemeUsage
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
