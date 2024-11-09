import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import ContentCarousel from './ContentCarousel';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from 'context/ThemeContext';
import { Favorite, FavoriteFill, Bookmark, BookmarkFill, Chat, PinAltFill } from 'assets/images';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import CustomHighlightedTextNunito from 'ui/components/generalPurposeComponents/CustomHighlightedTextNunito';
import CustomInputNunito from 'ui/components/generalPurposeComponents/CustomInputNunito';
import { navigateToSpecificPost } from 'helper/navigationHandlers/CoreNavigationHandlers';
import { useNavigation } from '@react-navigation/native';
import { usePostContext } from 'context/PostContext';

const PostMainContent = ({ post }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();
  const { likedPosts, likeCounts, bookmarkStatus, handleFavoriteToggle, handleBookmarkToggle } = usePostContext();

  const isLiked = likedPosts.get(post._id) ?? post.isLiked;
  const likeCount = likeCounts.get(post._id) ?? post.likes;
  const isBookmarked = bookmarkStatus.get(post._id) ?? post.isBookmarked;

  return (
    <View style={styles.container}>
      {/* User info */}
      <View style={styles.postHeader}>
        <Image
          source={{ uri: post.userId.profileImage }}
          style={{ width: 65, height: 65, borderRadius: 100 }}
          resizeMode="stretch"
        />
        <View style={styles.header}>
          <CustomTextNunito style={styles.username}>{post.userId.nickName}</CustomTextNunito>
          <CustomTextNunito style={styles.timeAgo}>
            {formatDistanceToNow(new Date(post.createdAt))} ago
          </CustomTextNunito>
        </View>
      </View>

      <TouchableOpacity onPress={() => navigateToSpecificPost(navigation, post)}>
        {/* Post description */}
        <CustomTextNunito style={styles.description}>{post.description ?? ''}</CustomTextNunito>
        <View>
          <CustomHighlightedTextNunito weight='BoldItalic'>{I18n.t(TextKey.timelineSeePostDetail)}</CustomHighlightedTextNunito>
        </View>
      </TouchableOpacity>

      {/* Post multimedia */}
      <ContentCarousel multimedia={post.multimedia} />

      {/* Like, Comment, and Bookmark buttons */}
      <View style={styles.metadata}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => handleFavoriteToggle(isLiked, likeCount, post._id)}>
            <Image 
              source={isLiked ? FavoriteFill : Favorite} 
              style={{ width: 24, height: 24 }} 
            />
            <CustomTextNunito weight={'Bold'} style={styles.textOfMetadata}>
              {likeCount}
            </CustomTextNunito>
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 12 }} onPress={() => navigateToSpecificPost(navigation, post)}>
            <Image source={Chat} style={{ width: 24, height: 24 }} />
            <CustomTextNunito weight={'Bold'} style={styles.textOfMetadata}>{post.numberOfComments}</CustomTextNunito>
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 6 }} onPress={() => handleBookmarkToggle(isBookmarked, post._id)}>
            <Image 
              source={isBookmarked ? BookmarkFill : Bookmark} 
              style={{ width: 24, height: 24 }} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  header: {
    flexDirection: 'column',
    marginLeft: 16,
    justifyContent: 'center',
  },
  username: {
    fontSize: 18,
    color: theme.colors.text,
  },
  timeAgo: {
    fontSize: 12,
    color: theme.colors.detailText,
  },
  description: {
    marginTop: 8,
    fontSize: 12,
    color: theme.colors.text,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 14,
  },
  textOfMetadata: {
    fontSize: 12,
    color: theme.colors.detailText,
    marginLeft: 4,
  },
});

export default PostMainContent;