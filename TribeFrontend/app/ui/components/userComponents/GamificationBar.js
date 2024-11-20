import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { useTheme } from 'context/ThemeContext';
import { useUserContext } from 'context/UserContext';
import Separator from 'ui/components/generalPurposeComponents/Separator';
import { ProgressBar } from 'react-native-paper';
import FullSizeImage from 'ui/components/generalPurposeComponents/FullSizeImage';
import {NavigateToGamificationProgress} from 'helper/navigationHandlers/UserNavigationHandlers';
import { useNavigation } from '@react-navigation/native';

const GamificationBar = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const NavigateToGamificationProgress = (navigation) => {
    navigation.navigate('GamificationProgress');
  };

  return (
    <TouchableOpacity 
      onPress={() => NavigateToGamificationProgress(navigation)} 
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
          <CustomTextNunito weight={'Medium'} style={{ color: theme.colors.textAlternative }}>Nivel </CustomTextNunito>
          <CustomTextNunito weight={'Medium'} style={{ color: theme.colors.textAlternative }}>2</CustomTextNunito>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <CustomTextNunito weight={'MediumItalic'} style={{ color: theme.colors.textAlternative }}>2/5 </CustomTextNunito>
          <CustomTextNunito weight={'MediumItalic'} style={{ color: theme.colors.textAlternative }}>publicaciones realizadas</CustomTextNunito>
        </View>
      </View>
      <ProgressBar progress={0.4} color={theme.colors.secondary} style={{ height: 10, borderRadius: 5, marginHorizontal: 10 }} />
    </TouchableOpacity>
  );
};

export default GamificationBar;