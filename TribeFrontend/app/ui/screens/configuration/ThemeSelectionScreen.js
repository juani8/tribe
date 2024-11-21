import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { RadioButton } from 'react-native-paper';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { useTheme } from 'context/ThemeContext';
import LottieView from 'lottie-react-native';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

const ThemeSelectionScreen = () => {
  const { switchToLightTheme, switchToDarkTheme, switchToSystemTheme, isDarkMode } = useTheme();
  const [checked, setChecked] = useState('system'); // Default to system theme

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

  return (
    <View style={{ padding: 20, marginTop: 30, gap: 50 }}>
      <View style={{ width: '100%' }}>
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
          onPress={() => handleThemeChange('light')}>
          <RadioButton
            value="light"
            status={checked === 'light' ? 'checked' : 'unchecked'}
          />
          <CustomTextNunito style={{ fontSize: 18 }}>{I18n.t(TextKey.lightTheme)}</CustomTextNunito>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
          onPress={() => handleThemeChange('dark')}>
          <RadioButton
            value="dark"
            status={checked === 'dark' ? 'checked' : 'unchecked'}
          />
          <CustomTextNunito style={{ fontSize: 18 }}>{I18n.t(TextKey.darkTheme)}</CustomTextNunito>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
          onPress={() => handleThemeChange('system')}>
          <RadioButton
            value="system"
            status={checked === 'system' ? 'checked' : 'unchecked'}
          />
          <CustomTextNunito style={{ fontSize: 18 }}>{I18n.t(TextKey.systemTheme)}</CustomTextNunito>
        </TouchableOpacity>
      </View>
      <LottieView
        source={isDarkMode ? require('assets/lottie/moonLottie.json') : require('assets/lottie/sunLottie.json')}
        autoPlay
        loop
        style={{ width: 200, height: 200, alignSelf: 'center' }}
      />
    </View>
  );
};

export default ThemeSelectionScreen;