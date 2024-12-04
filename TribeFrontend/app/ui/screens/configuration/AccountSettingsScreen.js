import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { navigateToChangePassword, navigateToDeleteAccount, navigateToEditPersonalData, navigateToEnableBiometrics } from 'helper/navigationHandlers/AccountSettingsNavigationHandlers'
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { useTheme } from 'context/ThemeContext';
import { useUserContext } from 'context/UserContext';
import {Trash} from 'assets/images';

const AccountSettingsScreen = () => {
  const { theme } = useTheme();
  const { user } = useUserContext();
  const navigation = useNavigation();
  
  return (
    <View>

      <View style={{ marginTop: '20%', gap: 50}}>
        <View style={{ flexDirection: 'column' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Image source={{ uri: user.profileImage }} style={{ width: 150, height: 150, borderRadius: 100, borderColor: theme.colors.primary, borderWidth: 3 }} />
          </View>
          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
            <CustomTextNunito style={{ fontSize: 18 }}>{user.email}</CustomTextNunito>
          </View>
        </View>
        <View style={{ marginLeft: '23%', flexDirection: 'column', gap: 20, justifyContent: 'center',  }}>
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
          <TouchableOpacity onPress={() => navigateToDeleteAccount(navigation)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Image source={Trash} style={{ width: 30, height: 30 }} />
              <CustomTextNunito style={{ fontSize: 18 }} textColor={theme.colors.danger}>Delete Account</CustomTextNunito>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AccountSettingsScreen;