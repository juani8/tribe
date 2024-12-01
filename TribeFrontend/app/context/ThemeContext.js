import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import colorsLightMode from 'assets/constants/colorsLightMode';
import colorsDarkMode from 'assets/constants/colorsDarkMode';
import { LogoDarkMode, LogoLightMode } from '../assets/images';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { FavoriteFill, FavoriteFillNight, 
  BookmarkFill, BookmarkFillNight, 
  UserCircleLight, UserCircleLightNight,
  MenuNight, Menu,
  BellFillNight, BellFill

} from 'assets/images';
import { FingerprintBlack, LockBlack, EditBlack, EditNight, LockNight, FingerprintNight } from 'assets/images';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  
  const [useSystemTheme, setUseSystemTheme] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const storedUseSystemTheme = await AsyncStorage.getItem('useSystemTheme');
        const storedIsDarkMode = await AsyncStorage.getItem('isDarkMode');

        if (storedUseSystemTheme !== null) {
          setUseSystemTheme(JSON.parse(storedUseSystemTheme));
        }
        if (storedIsDarkMode !== null) {
          setIsDarkMode(JSON.parse(storedIsDarkMode));
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };

    loadThemePreference();
  }, []);

  const saveThemePreference = async (useSystemTheme, isDarkMode) => {
    try {
      await AsyncStorage.setItem('useSystemTheme', JSON.stringify(useSystemTheme));
      await AsyncStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    if (!useSystemTheme) {
      setIsDarkMode((prevMode) => {
        const newMode = !prevMode;
        saveThemePreference(useSystemTheme, newMode);
        return newMode;
      });
    }
  };

  const switchToLightTheme = () => {
    setUseSystemTheme(false);
    setIsDarkMode(false);
    saveThemePreference(false, false);
  };

  const switchToDarkTheme = () => {
    setUseSystemTheme(false);
    setIsDarkMode(true);
    saveThemePreference(false, true);
  };

  const switchToSystemTheme = () => {
    setUseSystemTheme(true);
    saveThemePreference(true, isDarkMode);
  };
  
  const isCurrentlyDarkMode = useMemo(() => {
    return useSystemTheme ? (systemColorScheme === 'dark') : isDarkMode;
  }, [useSystemTheme, systemColorScheme, isDarkMode]);
  
  const theme = useMemo(() => ({
    colors: isCurrentlyDarkMode ? colorsDarkMode : colorsLightMode,
    logo: isCurrentlyDarkMode ? LogoDarkMode : LogoLightMode,
    FavoriteFill: isCurrentlyDarkMode ? FavoriteFillNight : FavoriteFill,
    BookmarkFill: isCurrentlyDarkMode ? BookmarkFillNight : BookmarkFill,
    UserCircle: isCurrentlyDarkMode ? UserCircleLightNight : UserCircleLight,
    Menu: isCurrentlyDarkMode ? MenuNight : Menu,
    BellFill: isCurrentlyDarkMode ? BellFillNight : BellFill,
    Fingerprint: isCurrentlyDarkMode ? FingerprintNight : FingerprintBlack,
    Lock: isCurrentlyDarkMode ? LockNight : LockBlack,
    Edit: isCurrentlyDarkMode ? EditNight : EditBlack,
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
      switchToLightTheme,
      switchToDarkTheme,
      switchToSystemTheme,
      toggleSystemThemeUsage
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
