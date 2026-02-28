import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';
import I18n from 'assets/localization/i18n';

const LANGUAGE_STORAGE_KEY = '@tribe_language';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(I18n.locale);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved language on mount
  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage) {
          I18n.locale = savedLanguage;
          setLocale(savedLanguage);
        }
      } catch (error) {
        console.error('Error loading saved language:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSavedLanguage();
  }, []);

  const changeLanguage = useCallback(async (languageCode) => {
    try {
      I18n.locale = languageCode;
      setLocale(languageCode);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  }, []);

  const useDeviceLanguage = useCallback(async () => {
    try {
      const locales = RNLocalize.getLocales();
      const deviceLocale = locales[0]?.languageCode || 'es';
      I18n.locale = deviceLocale;
      setLocale(deviceLocale);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, deviceLocale);
    } catch (error) {
      console.error('Error setting device language:', error);
    }
  }, []);

  // Helper to translate with current locale
  const t = useCallback((key) => {
    return I18n.t(key);
  }, [locale]); // Re-create when locale changes

  // Helper to check if current locale is Spanish
  const isSpanish = locale?.startsWith('es');

  const value = {
    locale,
    isSpanish,
    changeLanguage,
    useDeviceLanguage,
    t,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
