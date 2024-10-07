import { View, Text, Button } from 'react-native';
import React from 'react';

import {NavigateToHome} from 'helper/navigationHandlers/CoreNavigationHandlers';

import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

import CustomButton from 'ui/components/generalPurposeComponents/CustomButton';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';

const PasswordRecoveryScreen = ({navigation}) => {
  return (
    <View>
      <CustomTextNunito>{I18n.t(TextKey.passwordRecoveryTitle)}</CustomTextNunito>
      <CustomButton title={I18n.t(TextKey.passwordRecoveryButton)} onPress={() => NavigateToHome(navigation)} />
    </View>
  );
}

export default PasswordRecoveryScreen;