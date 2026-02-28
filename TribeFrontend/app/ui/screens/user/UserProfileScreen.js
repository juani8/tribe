import React, { useState } from 'react';
import { View, Image, TouchableOpacity, FlatList, SafeAreaView, StyleSheet, Dimensions } from 'react-native';
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

const { width } = Dimensions.get('window');

const UserProfileScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { user } = useUserContext();
  const [postView, setPostView] = useState('UserPosts');
  const [isProfileImageModalVisible, setIsProfileImageModalVisible] = useState(false);
  const [isCoverImageModalVisible, setIsCoverImageModalVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const navigation = useNavigation();

  const toggleProfileImageModal = () => setIsProfileImageModalVisible(!isProfileImageModalVisible);
  const toggleCoverImageModal = () => setIsCoverImageModalVisible(!isCoverImageModalVisible);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Cover Image */}
      <TouchableOpacity onPress={toggleCoverImageModal} activeOpacity={0.9}>
        <View style={styles.coverContainer}>
          <Image source={{ uri: user.coverImage }} style={styles.coverImage} />
        </View>
      </TouchableOpacity>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={toggleProfileImageModal} style={styles.avatarWrapper} activeOpacity={0.9}>
            <Image source={{ uri: user.profileImage }} style={styles.avatar} />
            <View style={styles.onlineStatus} />
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View style={styles.userInfoContainer}>
          <CustomTextNunito weight={'Bold'} style={styles.userName}>
            {user.name} {user.lastName}
          </CustomTextNunito>
          <CustomTextNunito weight={'Medium'} style={styles.nickname}>
            @{user.nickName}
          </CustomTextNunito>
          {user.description && (
            <CustomTextNunito style={styles.description}>{user.description}</CustomTextNunito>
          )}
          <View style={styles.editButtonContainer}>
            <CustomButton 
              title={I18n.t(TextKey.editProfile) || 'Editar perfil'} 
              smallHeight={true} 
              onPress={() => navigation.navigate('AccountSettings')}
              variant="secondary"
            />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <TouchableOpacity onPress={() => navigateToFollowers(navigation)} style={styles.statItem} activeOpacity={0.7}>
            <CustomTextNunito weight={'Bold'} style={styles.statNumber}>{user.numberOfFollowers || 0}</CustomTextNunito>
            <CustomTextNunito style={styles.statLabel}>{I18n.t(TextKey.followers)}</CustomTextNunito>
          </TouchableOpacity>
          <View style={styles.statDivider} />
          <TouchableOpacity onPress={() => navigateToFollowing(navigation)} style={styles.statItem} activeOpacity={0.7}>
            <CustomTextNunito weight={'Bold'} style={styles.statNumber}>{user.numberOfFollowing || 0}</CustomTextNunito>
            <CustomTextNunito style={styles.statLabel}>{I18n.t(TextKey.following)}</CustomTextNunito>
          </TouchableOpacity>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <CustomTextNunito weight={'Bold'} style={styles.statNumber}>{user.numberOfPosts || 0}</CustomTextNunito>
            <CustomTextNunito style={styles.statLabel}>{I18n.t(TextKey.posts)}</CustomTextNunito>
          </View>
        </View>
      </View>

      {/* Gamification */}
      <View style={styles.gamificationContainer}>
        <GamificationBar />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => !isFetching && setPostView('UserPosts')}
          style={[styles.tabButton, postView === 'UserPosts' && styles.tabButtonActive]}
          activeOpacity={0.8}
        >
          <CustomTextNunito weight={'SemiBold'} style={[styles.tabText, postView === 'UserPosts' && styles.tabTextActive]}>
            {I18n.t(TextKey.posts)}
          </CustomTextNunito>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => !isFetching && setPostView('UserBookmarks')}
          style={[styles.tabButton, postView === 'UserBookmarks' && styles.tabButtonActive]}
          activeOpacity={0.8}
        >
          <CustomTextNunito weight={'SemiBold'} style={[styles.tabText, postView === 'UserBookmarks' && styles.tabTextActive]}>
            {I18n.t(TextKey.favorites)}
          </CustomTextNunito>
        </TouchableOpacity>
      </View>

      {/* Modales */}
      <FullSizeImage isModalVisible={isProfileImageModalVisible} uri={user.profileImage} toggleModal={toggleProfileImageModal} />
      <FullSizeImage isModalVisible={isCoverImageModalVisible} uri={user.coverImage} toggleModal={toggleCoverImageModal} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={[]}
        renderItem={null}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <ProfilePosts postView={postView} setIsFetching={setIsFetching} />
        }
      />
    </SafeAreaView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerContainer: {
    backgroundColor: theme.colors.background,
  },
  coverContainer: {
    width: '100%',
    height: 180,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileCard: {
    marginHorizontal: 16,
    marginTop: -60,
    backgroundColor: theme.colors.card || theme.colors.surface || theme.colors.background,
    borderRadius: 20,
    padding: 20,
    paddingTop: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  avatarContainer: {
    position: 'absolute',
    top: -50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: theme.colors.card || theme.colors.surface || '#FFF',
  },
  avatarWrapper: {
    position: 'relative',
  },
  onlineStatus: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#22c55e',
    borderWidth: 3,
    borderColor: theme.colors.card || theme.colors.surface || '#FFF',
  },
  userInfoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 22,
    color: theme.colors.text,
    letterSpacing: 0.2,
  },
  nickname: {
    fontSize: 15,
    color: theme.colors.primary,
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    color: theme.colors.detailText,
    textAlign: 'center',
    marginTop: 8,
    marginHorizontal: 20,
    lineHeight: 20,
  },
  editButtonContainer: {
    marginTop: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border || '#E5E5E5',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: theme.colors.border || '#E5E5E5',
  },
  statNumber: {
    fontSize: 20,
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.detailText,
    marginTop: 2,
  },
  gamificationContainer: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: theme.colors.border || '#E5E5E5',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: theme.colors.primaryDark || '#6B4EFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  tabTextActive: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default UserProfileScreen;