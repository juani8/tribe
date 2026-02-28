import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import { useTheme } from 'context/ThemeContext';
import { useLanguage } from 'context/LanguageContext';
import LottieView from 'lottie-react-native';
import { CheckFill, SettingsNew } from 'assets/images';
import * as RNLocalize from 'react-native-localize';

const LanguageSelectionScreen = () => {
  const { theme } = useTheme();
  const { locale, changeLanguage, useDeviceLanguage: setDeviceLanguage } = useLanguage();
  const styles = createStyles(theme);
  
  // Determine initial checked state based on current locale
  const getInitialChecked = () => {
    const deviceLocale = RNLocalize.getLocales()[0]?.languageCode || 'es';
    if (locale === deviceLocale) return 'device';
    if (locale?.startsWith('en')) return 'en';
    if (locale?.startsWith('es')) return 'es';
    return 'device';
  };
  
  const [checked, setChecked] = useState(getInitialChecked);

  // Update checked when locale changes
  useEffect(() => {
    const deviceLocale = RNLocalize.getLocales()[0]?.languageCode || 'es';
    if (locale === deviceLocale && checked !== 'en' && checked !== 'es') {
      setChecked('device');
    }
  }, [locale]);

  const handleLanguageChange = async (value) => {
    setChecked(value);
    if (value === 'en') {
      await changeLanguage('en');
    } else if (value === 'es') {
      await changeLanguage('es');
    } else {
      await setDeviceLanguage();
    }
  };

  const isSpanish = locale?.startsWith('es');

  const LanguageOption = ({ value, flag, title, subtitle }) => {
    const isSelected = checked === value;
    return (
      <TouchableOpacity 
        style={[styles.optionCard, isSelected && styles.optionCardSelected]}
        onPress={() => handleLanguageChange(value)}
        activeOpacity={0.7}
      >
        <View style={[styles.flagContainer, isSelected && styles.flagContainerSelected]}>
          {flag ? (
            <CustomTextNunito style={styles.flagEmoji}>{flag}</CustomTextNunito>
          ) : (
            <Image source={SettingsNew} style={[styles.deviceIcon, isSelected && styles.deviceIconSelected]} />
          )}
        </View>
        <View style={styles.optionContent}>
          <CustomTextNunito weight="SemiBold" style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
            {title}
          </CustomTextNunito>
          {subtitle && (
            <CustomTextNunito style={styles.optionSubtitle}>
              {subtitle}
            </CustomTextNunito>
          )}
        </View>
        {isSelected && (
          <View style={styles.checkContainer}>
            <Image source={CheckFill} style={styles.checkIcon} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Animation */}
      <View style={styles.animationContainer}>
        <LottieView
          source={require('assets/lottie/languageLottie.json')}
          autoPlay
          loop
          style={styles.animation}
        />
      </View>

      {/* Title */}
      <View style={styles.headerSection}>
        <CustomTextNunito weight="Bold" style={styles.title}>
          {isSpanish ? 'Elige tu idioma' : 'Choose your language'}
        </CustomTextNunito>
        <CustomTextNunito style={styles.subtitle}>
          {isSpanish 
            ? 'Selecciona el idioma de la aplicación' 
            : 'Select the app language'}
        </CustomTextNunito>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        <LanguageOption
          value="en"
          flag="🇺🇸"
          title="English"
          subtitle="United States"
        />
        
        <LanguageOption
          value="es"
          flag="🇪🇸"
          title="Español"
          subtitle="España"
        />
        
        <LanguageOption
          value="device"
          title={isSpanish ? 'Idioma del Dispositivo' : 'Device Language'}
          subtitle={isSpanish ? 'Usar idioma del sistema' : 'Use system language'}
        />
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <CustomTextNunito style={styles.infoText}>
          {isSpanish 
            ? 'El cambio de idioma se aplicará inmediatamente.'
            : 'Language change will be applied immediately.'}
        </CustomTextNunito>
      </View>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  animationContainer: {
    alignItems: 'center',
    marginVertical: 5,
  },
  animation: {
    width: 120,
    height: 120,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    color: theme.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.detailText || '#666',
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card || theme.colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  flagContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  flagContainerSelected: {
    backgroundColor: theme.colors.primary + '20',
  },
  flagEmoji: {
    fontSize: 22,
  },
  deviceIcon: {
    width: 20,
    height: 20,
    tintColor: theme.colors.detailText || '#666',
  },
  deviceIconSelected: {
    tintColor: theme.colors.primary,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    color: theme.colors.text,
    marginBottom: 1,
  },
  optionTitleSelected: {
    color: theme.colors.primary,
  },
  optionSubtitle: {
    fontSize: 12,
    color: theme.colors.detailText || '#666',
  },
  checkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    width: 14,
    height: 14,
    tintColor: '#FFF',
  },
  infoContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: theme.colors.primary + '10',
    borderRadius: 10,
  },
  infoText: {
    fontSize: 12,
    color: theme.colors.detailText || '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default LanguageSelectionScreen;