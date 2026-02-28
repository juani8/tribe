import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import ContentCarousel from './ContentCarousel';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTheme } from 'context/ThemeContext';
import { Favorite, Bookmark, Chat, PinAltFill } from 'assets/images';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import CustomHighlightedTextNunito from 'ui/components/generalPurposeComponents/CustomHighlightedTextNunito';
import CustomInputNunito from 'ui/components/generalPurposeComponents/CustomInputNunito';
import { navigateToSpecificPost } from 'helper/navigationHandlers/CoreNavigationHandlers';
import { useNavigation } from '@react-navigation/native';
import { usePostContext } from 'context/PostContext';

const PostMainContent = ({ post, viewMore = true, renderingPostsFromUser }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();
  const { likedPosts, likeCounts, bookmarkStatus, handleFavoriteToggle, handleBookmarkToggle } = usePostContext();

  const isLiked = likedPosts.get(post._id) ?? post.isLiked;
  const likeCount = likeCounts.get(post._id) ?? post.likes;
  const isBookmarked = bookmarkStatus.get(post._id) ?? post.isBookmarked;

  // Determinar locale basado en el idioma actual
  const currentLocale = I18n.locale?.startsWith('es') ? es : enUS;
  
  // Formatear tiempo de forma más amigable
  const formatTimeAgo = () => {
    try {
      return formatDistanceToNow(new Date(post.createdAt), { 
        addSuffix: true,
        locale: currentLocale 
      });
    } catch {
      return '';
    }
  };

  return (
    <View style={styles.container}>        
      {/* User info - Diseño mejorado */}
      {!renderingPostsFromUser && (
        <View style={styles.postHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={post.userId.profileImage ? { uri: post.userId.profileImage } : theme.UserCircle}
              style={styles.avatar}
              resizeMode="cover"
            />
            <View style={styles.onlineIndicator} />
          </View>
          <View style={styles.header}>
            <CustomTextNunito weight="Bold" style={styles.username}>
              {post.userId.nickName}
            </CustomTextNunito>
            <View style={styles.timeLocationRow}>
              <CustomTextNunito style={styles.timeAgo}>
                {formatTimeAgo()}
              </CustomTextNunito>
              {post.location?.city && (
                <>
                  <View style={styles.dotSeparator} />
                  <Image source={PinAltFill} style={styles.miniLocationIcon} />
                  <CustomTextNunito style={styles.locationText}>
                    {post.location.city}
                  </CustomTextNunito>
                </>
              )}
            </View>
          </View>
        </View>
      )}

      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => navigateToSpecificPost(navigation, post)}
      >
        {/* Post description con mejor tipografía */}
        {post.description && (
          <CustomTextNunito style={styles.description}>
            {post.description}
          </CustomTextNunito>
        )}
        {viewMore && (
          <View style={styles.viewMoreContainer}>
            <CustomHighlightedTextNunito weight='SemiBold' style={styles.viewMoreText}>
              {I18n.t(TextKey.timelineSeePostDetail)}
            </CustomHighlightedTextNunito>
          </View>
        )}
      </TouchableOpacity>

      {/* Post multimedia con bordes redondeados */}
      <View style={styles.carouselContainer}>
        <ContentCarousel multimedia={post.multimedia} />
      </View>

      {/* Acciones del post - Diseño mejorado */}
      <View style={styles.actionsContainer}>
        <View style={styles.leftActions}>
          {/* Like button */}
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => handleFavoriteToggle(isLiked, likeCount, post._id)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, isLiked && styles.iconContainerActive]}>
              <Image 
                source={isLiked ? theme.FavoriteFill : Favorite} 
                style={[styles.actionIcon, isLiked && styles.actionIconLiked]} 
              />
            </View>
            <CustomTextNunito weight={'SemiBold'} style={[styles.actionText, isLiked && styles.actionTextActive]}>
              {likeCount > 0 ? likeCount : ''}
            </CustomTextNunito>
          </TouchableOpacity>

          {/* Comment button */}
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => navigateToSpecificPost(navigation, post)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Image source={Chat} style={styles.actionIcon} />
            </View>
            <CustomTextNunito weight={'SemiBold'} style={styles.actionText}>
              {post.totalComments > 0 ? post.totalComments : ''}
            </CustomTextNunito>
          </TouchableOpacity>
        </View>

        {/* Bookmark button - Aislado a la derecha */}
        <TouchableOpacity 
          style={styles.bookmarkButton} 
          onPress={() => handleBookmarkToggle(isBookmarked, post._id)}
          activeOpacity={0.7}
        >
          <Image 
            source={isBookmarked ? theme.BookmarkFill : Bookmark} 
            style={[styles.bookmarkIcon, isBookmarked && styles.bookmarkIconActive]} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginVertical: 6,
    marginHorizontal: 4,
    backgroundColor: theme.colors.card || theme.colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border || 'transparent',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingTop: 4,
    paddingBottom: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: theme.colors.primary || '#6366f1',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: theme.colors.card || theme.colors.surface,
  },
  header: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  username: {
    fontSize: 16,
    color: theme.colors.text,
    letterSpacing: 0.2,
  },
  timeLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  timeAgo: {
    fontSize: 12,
    color: theme.colors.detailText,
  },
  dotSeparator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: theme.colors.detailText,
    marginHorizontal: 6,
  },
  miniLocationIcon: {
    width: 12,
    height: 12,
    opacity: 0.7,
    marginRight: 2,
  },
  locationText: {
    fontSize: 12,
    color: theme.colors.detailText,
  },
  description: {
    marginTop: 12,
    marginHorizontal: 14,
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text,
  },
  viewMoreContainer: {
    marginTop: 4,
    marginLeft: 14,
  },
  viewMoreText: {
    fontSize: 13,
  },
  carouselContainer: {
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 4,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: theme.colors.background + '80',
  },
  iconContainer: {
    padding: 2,
  },
  iconContainerActive: {
    transform: [{ scale: 1.1 }],
  },
  actionIcon: {
    width: 22,
    height: 22,
  },
  actionIconLiked: {
    tintColor: '#ef4444',
  },
  actionText: {
    fontSize: 13,
    color: theme.colors.detailText,
    marginLeft: 6,
    minWidth: 16,
  },
  actionTextActive: {
    color: '#ef4444',
  },
  bookmarkButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.background + '80',
  },
  bookmarkIcon: {
    width: 22,
    height: 22,
  },
  bookmarkIconActive: {
    tintColor: theme.colors.primary || '#6366f1',
  },
});

export default PostMainContent;