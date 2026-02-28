import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { useTheme } from 'context/ThemeContext';
import LottieView from 'lottie-react-native';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import { SunFill, MoonAltFill, SettingsNew, CheckFill } from 'assets/images';

const ThemeSelectionScreen = () => {
  const { switchToLightTheme, switchToDarkTheme, switchToSystemTheme, isDarkMode, theme } = useTheme();
  const styles = createStyles(theme, isDarkMode);
  const [checked, setChecked] = useState('system');

  useEffect(() => {
    // Detect current theme on mount
    // This is a simplified detection - in real app would check actual setting
  }, []);

  const handleThemeChange = (value) => {
    setChecked(value);
    if (value === 'light') {
      switchToLightTheme();
    } else if (value === 'dark') {
      switchToDarkTheme();
    } else {
      switchToSystemTheme();
    }
  };

  const ThemeOption = ({ value, icon, title, subtitle }) => {
    const isSelected = checked === value;
    return (
      <TouchableOpacity 
        style={[styles.optionCard, isSelected && styles.optionCardSelected]}
        onPress={() => handleThemeChange(value)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
          <Image source={icon} style={[styles.optionIcon, isSelected && styles.optionIconSelected]} />
        </View>
        <View style={styles.optionContent}>
          <CustomTextNunito weight="SemiBold" style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
            {title}
          </CustomTextNunito>
          <CustomTextNunito style={styles.optionSubtitle}>
            {subtitle}
          </CustomTextNunito>
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
          source={isDarkMode ? require('assets/lottie/moonLottie.json') : require('assets/lottie/sunLottie.json')}
          autoPlay
          loop
          style={styles.animation}
        />
      </View>

      {/* Title */}
      <View style={styles.headerSection}>
        <CustomTextNunito weight="Bold" style={styles.title}>
          {I18n.locale?.startsWith('es') ? 'Elige tu tema' : 'Choose your theme'}
        </CustomTextNunito>
        <CustomTextNunito style={styles.subtitle}>
          {I18n.locale?.startsWith('es') 
            ? 'Personaliza cómo se ve la aplicación' 
            : 'Customize how the app looks'}
        </CustomTextNunito>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        <ThemeOption
          value="light"
          icon={SunFill}
          title={I18n.t(TextKey.lightTheme)}
          subtitle={I18n.locale?.startsWith('es') ? 'Fondo claro' : 'Light background'}
        />
        
        <ThemeOption
          value="dark"
          icon={MoonAltFill}
          title={I18n.t(TextKey.darkTheme)}
          subtitle={I18n.locale?.startsWith('es') ? 'Fondo oscuro' : 'Dark background'}
        />
        
        <ThemeOption
          value="system"
          icon={SettingsNew}
          title={I18n.t(TextKey.systemTheme)}
          subtitle={I18n.locale?.startsWith('es') ? 'Seguir ajustes del dispositivo' : 'Follow device settings'}
        />
      </View>
    </View>
  );
};

const createStyles = (theme, isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  animationContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  animation: {
    width: 150,
    height: 150,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    color: theme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.detailText || '#666',
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card || theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconContainerSelected: {
    backgroundColor: theme.colors.primary,
  },
  optionIcon: {
    width: 24,
    height: 24,
    tintColor: theme.colors.detailText || '#666',
  },
  optionIconSelected: {
    tintColor: '#FFF',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 2,
  },
  optionTitleSelected: {
    color: theme.colors.primary,
  },
  optionSubtitle: {
    fontSize: 13,
    color: theme.colors.detailText || '#666',
  },
  checkContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    width: 16,
    height: 16,
    tintColor: '#FFF',
  },
});

export default ThemeSelectionScreen;