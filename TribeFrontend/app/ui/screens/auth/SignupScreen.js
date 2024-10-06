import { View, Text, Button } from 'react-native';
import React from 'react';

import {NavigateToInitialConfiguration, NavigateToLogin} from 'helper/navigationHandlers/AuthNavigationHandlers';

import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

import CustomButton from 'ui/components/generalPurposeComponents/CustomButton';
import CustomHighlightedTextNunito from 'ui/components/generalPurposeComponents/CustomHighlightedTextNunito';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';

const SignupScreen = ({navigation}) => {
  return (
    <View>
      <CustomTextNunito>{I18n.t(TextKey.signupTitle)}</CustomTextNunito>
      <CustomButton title={I18n.t(TextKey.signupButton)} onPress={() => NavigateToInitialConfiguration(navigation)} />
      <CustomHighlightedTextNunito onPress={() => NavigateToLogin(navigation)}>{I18n.t(TextKey.goToLoginButton)}</CustomHighlightedTextNunito>
    </View>
  );
}

export default SignupScreen;