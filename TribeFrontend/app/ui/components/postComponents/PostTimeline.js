import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import ContentCarousel from './ContentCarousel';
import { formatDistanceToNow } from 'date-fns'; // Optional: Helps to format the timestamp.
import { useTheme } from 'context/ThemeContext';
import { Favorite, FavoriteFill, Bookmark, BookmarkFill, Chat, PinAltFill } from '../../../assets/images';

import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';

// PostTimeline component
const PostTimeline = ({post}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* User info */}
      <View style={styles.postHeader}>
        <Image
          source={{ uri: post.userProfilePicture }}
          style={{ width: 65, height: 65, borderRadius: 100 }}
          resizeMode="stretch"
        />
        <View style={styles.header}>
          <CustomTextNunito style={styles.username}>{post.userId}</CustomTextNunito>
          <CustomTextNunito style={styles.timeAgo}>
            {formatDistanceToNow(new Date(post.createdAt * 1000))} ago
          </CustomTextNunito>
        </View>
      </View>

      {/* Post description */}
      <CustomTextNunito style={styles.description}>{post.description}</CustomTextNunito>

      {console.log(post.multimedia)}
      <ContentCarousel multimedia={post.multimedia} />

      {/* Post metadata */}
      <View style={styles.metadata}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}> 
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={post.isLiked ? FavoriteFill : Favorite} style={{ width: 24, height: 24 }} />
            <CustomTextNunito weight={'Bold'} style={styles.textOfMetadata}>{post.likes}</CustomTextNunito>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 12 }}>
            <Image source={Chat} style={{ width: 24, height: 24 }} />
            <CustomTextNunito weight={'Bold'} style={styles.textOfMetadata}>{post.numberOfComments}</CustomTextNunito>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 6 }}>
            <Image source={post.isBookmarked ? BookmarkFill : Bookmark} style={{ width: 24, height: 24 }} />
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={PinAltFill} style={{ width: 24, height: 24 }} />
          <CustomTextNunito weight={'Bold'} style={styles.textOfMetadata}>Quilmes</CustomTextNunito>
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 16,
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
  },
  textOfMetadata: {
    fontSize: 12,
    color: theme.colors.detailText,
    marginLeft: 4,
  },
});

export default PostTimeline;
