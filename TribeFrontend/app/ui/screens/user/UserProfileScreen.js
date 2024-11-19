import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { useTheme } from 'context/ThemeContext';
import { useUserContext } from 'context/UserContext';
import Separator from 'ui/components/generalPurposeComponents/Separator';
import { ProgressBar } from 'react-native-paper';
import FullSizeImage from 'ui/components/generalPurposeComponents/FullSizeImage';

const UserProfileScreen = () => {
  const { theme } = useTheme();
  const { user } = useUserContext();
  const [postView, setPostView] = useState('UserPosts');
  const [isProfileImageModalVisible, setIsProfileImageModalVisible] = useState(false);
  const [isCoverImageModalVisible, setIsCoverImageModalVisible] = useState(false);

  const toggleProfileImageModal = () => setIsProfileImageModalVisible(!isProfileImageModalVisible);
  const toggleCoverImageModal = () => setIsCoverImageModalVisible(!isCoverImageModalVisible);

  return (
    <View>
      <View style={{ width: '100%', height: 150 }}>
        <TouchableOpacity onPress={toggleCoverImageModal} style={{ width: '100%', height: 150, position: 'absolute' }}>
          <Image source={{ uri: user.coverImage }} style={{ width: '100%', height: 150, resizeMode: 'cover' }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleProfileImageModal} style={{ width: 120, height: 120, position: 'absolute', bottom: 15, left: 20 }}>
          <Image source={{ uri: user.profileImage }} style={{ width: '100%', height: '100%', borderRadius: 100, borderColor: theme.colors.primary, borderWidth: 3 }} />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginHorizontal: 20, marginTop: 10 }}>
        <CustomTextNunito weight={'Bold'} style={{ fontSize: 18 }}>Juan Sosa - <CustomTextNunito weight={'MediumItalic'}>@juaniii</CustomTextNunito></CustomTextNunito>
        <CustomTextNunito weight={'Bold'}>Masculino</CustomTextNunito>
        <CustomTextNunito>{user.description}</CustomTextNunito>
      </View>

      <Separator style={{ marginVertical: 6 }} />

      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 10 }}>
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <CustomTextNunito weight={'Bold'}>{user.numberOfFollowers}</CustomTextNunito>
          <CustomTextNunito>Seguidores</CustomTextNunito>
        </View>
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <CustomTextNunito weight={'Bold'}>{user.numberOfFollowing}</CustomTextNunito>
          <CustomTextNunito>Seguidos</CustomTextNunito>
        </View>
      </View>

      <Separator style={{ marginVertical: 6 }} />

      <View style={{ flexDirection: 'column', justifyContent: 'space-evenly', gap: 6, marginVertical: 10, paddingVertical: 16, backgroundColor: theme.colors.primary }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CustomTextNunito weight={'Medium'} style={{ color: theme.colors.textAlternative }}>Nivel </CustomTextNunito>
            <CustomTextNunito weight={'Medium'} style={{ color: theme.colors.textAlternative }}>{user.gamificationLevel}</CustomTextNunito>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CustomTextNunito weight={'MediumItalic'} style={{ color: theme.colors.textAlternative }}>2/5 </CustomTextNunito>
            <CustomTextNunito weight={'MediumItalic'} style={{ color: theme.colors.textAlternative }}>publicaciones realizadas</CustomTextNunito>
          </View>
        </View>
        <ProgressBar progress={0.4} color={theme.colors.secondary} style={{ height: 10, borderRadius: 5, marginHorizontal: 10 }} />
      </View>

      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-evenly', 
        marginVertical: 10, 
        marginHorizontal: 35,
        padding: 6,
        borderRadius: 6,
        backgroundColor: theme.colors.placeholder 
      }}>
        <TouchableOpacity onPress={() => setPostView('UserPosts')} style={{ width: '50%', height: 50, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: postView === 'UserPosts' ? theme.colors.background : null }}>
          <CustomTextNunito weight={'Bold'} style={{ color: postView === 'UserPosts' ? theme.colors.primary : theme.colors.text }}>Publicaciones</CustomTextNunito>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setPostView('UserFavorites')}  style={{ width: '50%', height: 50, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: postView === 'UserFavorites' ? theme.colors.background : null }}>
          <CustomTextNunito weight={'Bold'} style={{ color: postView === 'UserFavorites' ? theme.colors.primary : theme.colors.text }}>Favoritos</CustomTextNunito>
        </TouchableOpacity>
      </View>

      <FullSizeImage isModalVisible={isProfileImageModalVisible} uri={user.profileImage} toggleModal={toggleProfileImageModal} />
      <FullSizeImage isModalVisible={isCoverImageModalVisible} uri={user.coverImage} toggleModal={toggleCoverImageModal} />
    </View>
  );
};

export default UserProfileScreen;