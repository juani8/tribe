import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { useUserContext } from 'context/UserContext';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import Separator from 'ui/components/generalPurposeComponents/Separator';

const MetricsScreen = () => {
  const { theme } = useTheme();
  const { user } = useUserContext();

  return (
    <View style={{ padding: 20, marginTop: 30, gap: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginVertical: 10, paddingHorizontal: 18 }}>
        <CustomTextNunito style={{ fontSize: 18, color: theme.colors.text }}>
          {I18n.t(TextKey.numberOfFollowers)}
        </CustomTextNunito>
        <CustomTextNunito style={{ fontSize: 18, color: theme.colors.text }}>
          {user.numberOfFollowers}
        </CustomTextNunito>
      </View>
      <Separator />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginVertical: 10, paddingHorizontal: 18 }}>
        <CustomTextNunito style={{ fontSize: 18, color: theme.colors.text }}>
          {I18n.t(TextKey.numberOfFollowing)}
        </CustomTextNunito>
        <CustomTextNunito style={{ fontSize: 18, color: theme.colors.text }}>
          {user.numberOfFollowing}
        </CustomTextNunito>
      </View>
      <Separator />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginVertical: 10, paddingHorizontal: 18 }}>
        <CustomTextNunito style={{ fontSize: 18, color: theme.colors.text }}>
          {I18n.t(TextKey.numberOfComments)}
        </CustomTextNunito>
        <CustomTextNunito style={{ fontSize: 18, color: theme.colors.text }}>
          {user.numberOfComments}
        </CustomTextNunito>
      </View>
      <Separator />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginVertical: 10, paddingHorizontal: 18 }}>
        <CustomTextNunito style={{ fontSize: 18, color: theme.colors.text }}>
          {I18n.t(TextKey.numberOfLikes)}
        </CustomTextNunito>
        <CustomTextNunito style={{ fontSize: 18, color: theme.colors.text }}>
          {user.numberOfLikes}
        </CustomTextNunito>
      </View>
    </View>
  );
};

export default MetricsScreen;