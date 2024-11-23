import React, { useState } from 'react';
import { View, Image, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import moment from 'moment';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { useTheme } from 'context/ThemeContext';
import { useUserContext } from 'context/UserContext';
import Separator from 'ui/components/generalPurposeComponents/Separator';
import { ProgressBar } from 'react-native-paper';
import FullSizeImage from 'ui/components/generalPurposeComponents/FullSizeImage';
import {navigateToGamificationProgress, navigateToFollowers, navigateToFollowing} from 'helper/navigationHandlers/UserNavigationHandlers';
import GamificationBar from 'ui/components/userComponents/GamificationBar';
import { useNavigation } from '@react-navigation/native';
import CustomButton from 'ui/components/generalPurposeComponents/CustomButton';
import ProfilePosts from '../../components/userComponents/ProfilePosts';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';


const UserProfileScreen = () => {
  const { theme } = useTheme();
  const { user } = useUserContext();
  const [postView, setPostView] = useState('UserPosts');
  const [isProfileImageModalVisible, setIsProfileImageModalVisible] = useState(false);
  const [isCoverImageModalVisible, setIsCoverImageModalVisible] = useState(false);
  const navigation = useNavigation();

  const toggleProfileImageModal = () => setIsProfileImageModalVisible(!isProfileImageModalVisible);
  const toggleCoverImageModal = () => setIsCoverImageModalVisible(!isCoverImageModalVisible);

  const renderHeader = () => (
    <>
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
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <CustomTextNunito weight={'Bold'}>Masculino</CustomTextNunito>
          <CustomButton title={'Editar perfil'} smallHeight={true} />
        </View>
        <CustomTextNunito>{user.description}</CustomTextNunito>
      </View>

      <Separator style={{ marginVertical: 6 }} />

      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 10 }}>
        <TouchableOpacity onPress={() => navigateToFollowers(navigation)} style={{ flexDirection: 'column', alignItems: 'center' }}>
          <CustomTextNunito weight={'Bold'}>{user.numberOfFollowers}</CustomTextNunito>
          <CustomTextNunito>{I18n.t(TextKey.followers)}</CustomTextNunito>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateToFollowing(navigation)} style={{ flexDirection: 'column', alignItems: 'center' }}>
          <CustomTextNunito weight={'Bold'}>{user.numberOfFollowing}</CustomTextNunito>
          <CustomTextNunito>{I18n.t(TextKey.following)}</CustomTextNunito>
        </TouchableOpacity>
      </View>

      <Separator style={{ marginVertical: 6 }} />

      <GamificationBar />

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
          <CustomTextNunito weight={'Bold'} style={{ color: postView === 'UserPosts' ? theme.colors.primary : theme.colors.text }}>{I18n.t(TextKey.posts)}</CustomTextNunito>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setPostView('UserFavorites')}  style={{ width: '50%', height: 50, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: postView === 'UserFavorites' ? theme.colors.background : null }}>
          <CustomTextNunito weight={'Bold'} style={{ color: postView === 'UserFavorites' ? theme.colors.primary : theme.colors.text }}>{I18n.t(TextKey.favorites)}</CustomTextNunito>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={[]}
        renderItem={null}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={<ProfilePosts postView={postView} />}
      />
    </SafeAreaView>
  );
};

export default UserProfileScreen;