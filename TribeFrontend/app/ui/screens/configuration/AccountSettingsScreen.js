import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { navigateToChangePassword, navigateToDeleteAccount, navigateToEditPersonalData, navigateToEnableBiometrics } from 'helper/navigationHandlers/AccountSettingsNavigationHandlers'
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { useTheme } from 'context/ThemeContext';
import {Trash} from 'assets/images';

const AccountSettingsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  
  return (
    <View>
      <View style={{ flexDirection: 'column', gap: 20, justifyContent: 'center', marginLeft: '23%', marginTop: '25%'}}>
        <TouchableOpacity onPress={() => navigateToEditPersonalData(navigation)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Image source={theme.Edit} style={{ width: 30, height: 30 }} />
            <CustomTextNunito style={{ fontSize: 18 }}>Edit Personal Data</CustomTextNunito>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateToChangePassword(navigation)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Image source={theme.Lock} style={{ width: 30, height: 30 }} />
            <CustomTextNunito style={{ fontSize: 18 }}>Change Password</CustomTextNunito>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateToEnableBiometrics(navigation)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Image source={theme.Fingerprint} style={{ width: 28, height: 30 }} />
            <CustomTextNunito style={{ fontSize: 18 }}>Enable Biometrics</CustomTextNunito>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateToDeleteAccount(navigation)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Image source={Trash} style={{ width: 30, height: 30 }} />
            <CustomTextNunito style={{ fontSize: 18 }} textColor={theme.colors.danger}>Delete Account</CustomTextNunito>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AccountSettingsScreen;