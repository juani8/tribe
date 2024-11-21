import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { useTheme } from 'context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

const GamificationBar = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const navigateToGamificationProgress = () => {
    navigation.navigate('GamificationProgress');
  };

  return (
    <TouchableOpacity 
      onPress={navigateToGamificationProgress} 
      style={{ 
        flexDirection: 'column', 
        justifyContent: 'space-evenly', 
        gap: 6, 
        marginVertical: 10, 
        paddingVertical: 16, 
        backgroundColor: theme.colors.primary 
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <CustomTextNunito weight={'Medium'} style={{ color: theme.colors.textAlternative }}>{I18n.t(TextKey.level)} </CustomTextNunito>
          <CustomTextNunito weight={'Medium'} style={{ color: theme.colors.textAlternative }}>2</CustomTextNunito>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <CustomTextNunito weight={'MediumItalic'} style={{ color: theme.colors.textAlternative }}>2/5 </CustomTextNunito>
          <CustomTextNunito weight={'MediumItalic'} style={{ color: theme.colors.textAlternative }}>{I18n.t(TextKey.postsCompleted)}</CustomTextNunito>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default GamificationBar;