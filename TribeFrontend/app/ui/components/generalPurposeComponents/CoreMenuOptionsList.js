import React from 'react';
import { View, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { useTheme } from 'context/ThemeContext';
import { InvertColors, Aa, SettingsNew, Analytics, ExitToApp } from 'assets/images';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import { logoutUser } from 'networking/api/usersApi';
import { navigateToWelcome } from 'helper/navigationHandlers/CoreNavigationHandlers';
import { navigateToLanguageSelection, navigateToThemeSelection, navigateToMetrics, navigateToAccountSettings } from 'helper/navigationHandlers/ConfigurationNavigationHandlers';
import { useUserContext } from 'context/UserContext';

const CoreMenuOptionsList = ({ onClose }) => {
  const { theme, isDarkMode } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();
  const { setUser } = useUserContext();

  const CoreMenuOptions = [
    {
      icon: InvertColors,
      label: I18n.t(TextKey.settingsOptionTheme),
      onPress: () => navigateToThemeSelection(navigation),
    },
    {
      icon: Aa,
      label: I18n.t(TextKey.settingsOptionLanguage),
      onPress: () => navigateToLanguageSelection(navigation),
    },
    {
      icon: SettingsNew,
      label: I18n.t(TextKey.settingsOptionAccountOptions),
      onPress: () => navigateToAccountSettings(navigation),
    },
    {
      icon: Analytics,
      label: I18n.t(TextKey.settingsOptionMetrics),
      onPress: () => navigateToMetrics(navigation),
    },
    {
      icon: ExitToApp,
      label: I18n.t(TextKey.settingsOptionLogout),
      onPress: () => {logoutUser(), setUser(null),navigateToWelcome(navigation)},
      isDestructive: true,
    },
  ];

  return (
    <View style={styles.container}>
      {CoreMenuOptions.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionContainer,
            index === CoreMenuOptions.length - 1 && styles.lastOption
          ]}
          onPress={() => {
            item.onPress();
            onClose();
          }}
          activeOpacity={0.7}
        >
          <View style={styles.optionContent}>
            <View style={[styles.iconWrapper, item.isDestructive && styles.destructiveIconWrapper]}>
              <Image
                source={item.icon}
                style={[
                  styles.icon,
                  { tintColor: item.isDestructive ? '#EF4444' : theme.colors.primary }
                ]}
              />
            </View>
            <CustomTextNunito 
              weight="SemiBold"
              style={[
                styles.label, 
                item.isDestructive && styles.destructiveLabel
              ]}
            >
              {item.label}
            </CustomTextNunito>
          </View>
          <View style={styles.chevron}>
            <CustomTextNunito style={styles.chevronText}>›</CustomTextNunito>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 12,
    backgroundColor: theme.colors.card || 'rgba(255, 255, 255, 0.05)',
  },
  lastOption: {
    marginTop: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  destructiveIconWrapper: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  icon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  label: {
    color: theme.colors.text,
    fontSize: 16,
  },
  destructiveLabel: {
    color: '#EF4444',
  },
  chevron: {
    paddingLeft: 8,
  },
  chevronText: {
    color: theme.colors.detailText || '#666',
    fontSize: 20,
  },
});

export default CoreMenuOptionsList;