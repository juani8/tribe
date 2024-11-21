import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { RadioButton } from 'react-native-paper';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import I18n, { switchLanguage, useDeviceLanguage } from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import { useTheme } from 'context/ThemeContext';
import LottieView from 'lottie-react-native';


const LanguageSelectionScreen = () => {
  const { theme } = useTheme();
  const [checked, setChecked] = useState('device'); // Default to device language

  const handleLanguageChange = (value) => {
    setChecked(value);
    if (value === 'en') {
      switchLanguage('en');
    } else if (value === 'es') {
      switchLanguage('es');
    } else {
      useDeviceLanguage();
    }
  };

  return (
    <View style={{ padding: 20, marginTop: 30, gap: 50 }}>
      <View style={{ width: '100%' }}>
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
          onPress={() => handleLanguageChange('en')}>
          <RadioButton
            value="en"
            status={checked === 'en' ? 'checked' : 'unchecked'}
          />
          <CustomTextNunito style={{ fontSize: 18, color: theme.colors.text }}>English</CustomTextNunito>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
          onPress={() => handleLanguageChange('es')}>
          <RadioButton
            value="es"
            status={checked === 'es' ? 'checked' : 'unchecked'}
          />
          <CustomTextNunito style={{ fontSize: 18, color: theme.colors.text }}>Español</CustomTextNunito>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
          onPress={() => handleLanguageChange('device')}>
          <RadioButton
            value="device"
            status={checked === 'device' ? 'checked' : 'unchecked'}
          />
          <CustomTextNunito style={{ fontSize: 18, color: theme.colors.text }}>{I18n.t(TextKey.deviceLanguage)}</CustomTextNunito>
        </TouchableOpacity>
      </View>
      <LottieView
        source={require('assets/lottie/languageLottie.json')}
        autoPlay
        loop
        style={{ width: 250, height: 250, alignSelf: 'center', marginLeft: -25 }}
      />
    </View>
  );
};

export default LanguageSelectionScreen;