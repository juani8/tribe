import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import ContentCarousel from './ContentCarousel';
import { formatDistanceToNow } from 'date-fns'; // Optional: Helps to format the timestamp.
import { useTheme } from 'context/ThemeContext';
import { Favorite, FavoriteFill, Bookmark, BookmarkFill, Chat, PinAltFill } from 'assets/images';
import { NavigateToSpecificPost } from 'helper/navigationHandlers/CoreNavigationHandlers';
import { useNavigation } from '@react-navigation/native';
import { likePost, unlikePost, bookmarkPost, unbookmarkPost } from 'networking/api/postsApi';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import CustomHighlightedTextNunito from 'ui/components/generalPurposeComponents/CustomHighlightedTextNunito';

const PostMainContent = ({ post }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);

  const handleFavoriteToggle = async () => {
    try {
      if (isLiked) {
        setIsLiked(false);
        setLikeCount(likeCount - 1);
        await unlikePost(post._id);
      } else {
        setIsLiked(true);
        setLikeCount(likeCount + 1);
        await likePost(post._id);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleBookmarkToggle = async () => {
    try {
      if (isBookmarked) {
        setIsBookmarked(false);
        await unbookmarkPost(post._id);
      } else {
        setIsBookmarked(true);
        await bookmarkPost(post._id);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };
  
  useEffect(() => {
    console.log('PostMainContent.js - post', post);
  }, [post]);

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
            {console.log(post.createdAt)}
            {formatDistanceToNow(new Date(post.createdAt))} ago
          </CustomTextNunito>
        </View>
      </View>

      <TouchableOpacity onPress={() => NavigateToSpecificPost(navigation, post)}>
        {/* Post description */}
        <CustomTextNunito style={styles.description}>{post.description ?? ''}</CustomTextNunito>
        <View>
          <CustomHighlightedTextNunito weight='BoldItalic'>{I18n.t(TextKey.timelineSeePostDetail)}</CustomHighlightedTextNunito>
        </View>
      </TouchableOpacity>

      {/* Post multimedia */}
      <ContentCarousel multimedia={post.multimedia} />

      {/* Post metadata */}
      <View style={styles.metadata}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}> 
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => handleFavoriteToggle()}>
            <Image source={isLiked ? FavoriteFill : Favorite} style={{ width: 24, height: 24 }} />
            <CustomTextNunito weight={'Bold'} style={styles.textOfMetadata}>{likeCount}</CustomTextNunito>
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 12 }} onPress={() => NavigateToSpecificPost(navigation, post)}>
            <Image source={Chat} style={{ width: 24, height: 24 }} />
            <CustomTextNunito weight={'Bold'} style={styles.textOfMetadata}>{post.numberOfComments}</CustomTextNunito>
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 6 }} onPress={() => handleBookmarkToggle()}>
            <Image source={post.isBookmarked ? BookmarkFill : Bookmark} style={{ width: 24, height: 24 }} />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={PinAltFill} style={{ width: 24, height: 24 }} />
          {post.location?.city && (
            <CustomTextNunito weight={'Bold'} style={styles.textOfMetadata}>{post.location.city}</CustomTextNunito>
          )}
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
