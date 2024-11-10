import React from 'react';
import { View, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { useTheme } from 'context/ThemeContext';
import { Lamp, Aa, SettingFill, ChartPin, SignInSquare } from 'assets/images';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

const CoreMenuOptionsList = ({ onClose }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const CoreMenuOptions = [
    {
      icon: Lamp,
      label: I18n.t(TextKey.settingsOptionTheme),
      onPress: () => console.log('Theme option selected'),
    },
    {
      icon: Aa,
      label: I18n.t(TextKey.settingsOptionLanguage),
      onPress: () => console.log('Language option selected'),
    },
    {
      icon: SettingFill,
      label: I18n.t(TextKey.settingsOptionAccountOptions),
      onPress: () => console.log('Account options selected'),
    },
    {
      icon: ChartPin,
      label: I18n.t(TextKey.settingsOptionMetrics),
      onPress: () => console.log('Metrics selected'),
    },
    {
      icon: SignInSquare,
      label: I18n.t(TextKey.settingsOptionLogout),
      onPress: () => console.log('Logout selected'),
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