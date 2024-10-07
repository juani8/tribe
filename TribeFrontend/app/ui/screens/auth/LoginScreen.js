import { View, Text, Button } from 'react-native'
import React from 'react'

import {NavigateToHome} from 'helper/navigationHandlers/CoreNavigationHandlers';
import {NavigateToSignup, NavigateToPasswordRecovery} from 'helper/navigationHandlers/AuthNavigationHandlers';

import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

import CustomButton from 'ui/components/generalPurposeComponents/CustomButton';
import CustomHighlightedTextNunito from 'ui/components/generalPurposeComponents/CustomHighlightedTextNunito';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';

const LoginScreen = ({navigation}) => {
  return (
    <View>
      <CustomTextNunito>{I18n.t(TextKey.loginTitle)}</CustomTextNunito>
      <CustomTextNunito>{I18n.t(TextKey.loginMessage)}</CustomTextNunito>
      <CustomButton title={I18n.t(TextKey.loginButton)} onPress={() => NavigateToHome(navigation)} />
      <CustomHighlightedTextNunito onPress={() => NavigateToSignup(navigation)}>{I18n.t(TextKey.goToSignup)}</CustomHighlightedTextNunito>
      <CustomHighlightedTextNunito onPress={() => NavigateToPasswordRecovery(navigation)}>{I18n.t(TextKey.goToRecoverPassword)}</CustomHighlightedTextNunito>
    </View>
  )
}

export default LoginScreen