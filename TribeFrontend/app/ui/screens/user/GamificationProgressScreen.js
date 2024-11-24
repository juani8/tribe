import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { useTheme } from 'context/ThemeContext';
import { useUserContext } from 'context/UserContext';
import Separator from 'ui/components/generalPurposeComponents/Separator';
import { ProgressBar } from 'react-native-paper';
import FullSizeImage from 'ui/components/generalPurposeComponents/FullSizeImage';
import {navigateToGamificationActivity} from 'helper/navigationHandlers/UserNavigationHandlers';
import GamificationBar from 'ui/components/userComponents/GamificationBar';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import CustomButton from 'ui/components/generalPurposeComponents/CustomButton';

const GamificationProgressScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <View style={{ width: '100%', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
      <CustomTextNunito textColor={theme.colors.primary} style={{ fontSize: 24, marginLeft: 20, marginTop: 20 }}>Tu avance en Tribe</CustomTextNunito>
      <View style={{ 
        flexDirection: 'column', 
        justifyContent: 'space-evenly', 
        marginVertical: 10,
        padding: 8,
        margin: 16,
        backgroundColor: theme.colors.secondary, 
        borderRadius: 16, 
        borderColor: theme.colors.primary, 
        borderWidth: 3,
        gap: 12,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <CustomTextNunito style={{ fontSize: 24 }} textColor={theme.colors.primary} weight={'Bold'}>2/5</CustomTextNunito>
          <CustomButton title={'Ver actividad'} onPress={() => navigateToGamificationActivity(navigation)} smallHeight={true} />
        </View>
        <CustomTextNunito style={{ fontSize: 16 }} textColor={theme.colors.primary} weight={'Bold'}>3 publicaciones más hasta nivel 3</CustomTextNunito>
      </View>
      <CustomTextNunito textColor={theme.colors.primary} style={{ fontSize: 24, marginLeft: 20, marginTop: 20 }}>Nivel actual</CustomTextNunito>
      <GamificationBar />
      <LottieView
        source={require('assets/lottie/levelUpLottie.json')}
        autoPlay
        loop
        style={{ width: 200, height: 200, alignSelf: 'center' }}
      />
    </View>
  );
};

export default GamificationProgressScreen;