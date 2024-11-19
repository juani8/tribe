import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, ActivityIndicator, StyleSheet } from 'react-native';
import moment from 'moment';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { useTheme } from 'context/ThemeContext';
import { useUserContext } from 'context/UserContext'

const UserProfileScreen = () => {
  const { theme } = useTheme();
  const { user } = useUserContext();
  console.log(user)

  return (
    <View>
      <CustomTextNunito>{user.profileImage}</CustomTextNunito>
      <CustomTextNunito>{user.coverImage}</CustomTextNunito>
      <CustomTextNunito>Juan Sosa</CustomTextNunito>
      <Image source={{ uri: user.profileImage }} style={{ width: 50, height: 50 }} />
      <Image source={{ uri: user.coverImage }} style={{ width: 50, height: 50 }} />
      <CustomTextNunito>{user.description}</CustomTextNunito>
      <CustomTextNunito>{user.numberOfFollowers}</CustomTextNunito>
      <CustomTextNunito>{user.numberOfFollowing}</CustomTextNunito>
      <CustomTextNunito>{user.gamificationLevel}</CustomTextNunito>
    </View>
  )
}

export default UserProfileScreen