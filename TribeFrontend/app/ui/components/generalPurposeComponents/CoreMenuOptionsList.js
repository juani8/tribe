import React from 'react';
import { View, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { useTheme } from 'context/ThemeContext';
import { Lamp, Aa, SettingFill, ChartPin, SignInSquare } from 'assets/images';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import { logoutUser } from 'networking/api/usersApi';
import { navigateToWelcome } from 'helper/navigationHandlers/CoreNavigationHandlers';
import { navigateToLanguageSelection, navigateToThemeSelection, navigateToMetrics, navigateToAccountSettings } from 'helper/navigationHandlers/ConfigurationNavigationHandlers';
import { useUserContext } from 'context/UserContext';

const CoreMenuOptionsList = ({ onClose }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();
  const { setUser } = useUserContext();

  const CoreMenuOptions = [
    {
      icon: Lamp,
      label: I18n.t(TextKey.settingsOptionTheme),
      onPress: () => navigateToThemeSelection(navigation),
    },
    {
      icon: Aa,
      label: I18n.t(TextKey.settingsOptionLanguage),
      onPress: () => navigateToLanguageSelection(navigation),
    },
    {
      icon: SettingFill,
      label: I18n.t(TextKey.settingsOptionAccountOptions),
      onPress: () => navigateToAccountSettings(navigation),
    },
    {
      icon: ChartPin,
      label: I18n.t(TextKey.settingsOptionMetrics),
      onPress: () => navigateToMetrics(navigation),
    },
    {
      icon: SignInSquare,
      label: I18n.t(TextKey.settingsOptionLogout),
      onPress: () => {logoutUser(), setUser(null),navigateToWelcome(navigation)},
    },
  ];

  return (
    <FlatList
      data={CoreMenuOptions}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => {
            item.onPress();
            onClose();
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {item.icon && (
              <Image
                source={item.icon}
                style={{ width: 24, height: 24, resizeMode: 'contain', marginRight: 12 }}
              />
            )}
            <CustomTextNunito style={{ color: theme.colors.options, fontSize: 18 }}>
              {item.label}
            </CustomTextNunito>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const createStyles = (theme) => StyleSheet.create({
  optionContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
});

export default CoreMenuOptionsList;