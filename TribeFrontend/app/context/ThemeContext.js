import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import colorsLightMode from 'assets/constants/colorsLightMode';
import colorsDarkMode from 'assets/constants/colorsDarkMode';
import { LogoDarkMode, LogoLightMode } from '../assets/images';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  
  const [useSystemTheme, setUseSystemTheme] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  
  const toggleTheme = () => {
    if (!useSystemTheme) {
      setIsDarkMode((prevMode) => !prevMode);
    }
  };
  
  const isCurrentlyDarkMode = useMemo(() => {
    return useSystemTheme ? (systemColorScheme === 'dark') : isDarkMode;
  }, [useSystemTheme, systemColorScheme, isDarkMode]);
  
  const theme = useMemo(() => ({
    colors: isCurrentlyDarkMode ? colorsDarkMode : colorsLightMode,
    logo: isCurrentlyDarkMode ? LogoDarkMode : LogoLightMode
  }), [isCurrentlyDarkMode]);

  const toggleSystemThemeUsage = () => {
    setUseSystemTheme((prev) => !prev);
  };

  useEffect(() => {
    changeNavigationBarColor(theme.colors.primary, true);
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
