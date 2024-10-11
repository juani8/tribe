import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import ContentCarousel from 'ui/components/postComponents/ContentCarousel';
import { formatDistanceToNow } from 'date-fns'; // Optional: Helps to format the timestamp.
import { useTheme } from 'context/ThemeContext';
import { Favorite, FavoriteFill, Bookmark, BookmarkFill, Chat, PinAltFill } from 'assets/images';
import Separator from 'ui/components/generalPurposeComponents/Separator';
import GetPostById from 'helper/PostHelper';

import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import CustomHighlightedTextNunito from '../../components/generalPurposeComponents/CustomHighlightedTextNunito';


const PostDetail = ({ route }) => {
  const { postId } = route.params; // Extract postId from the route
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const post = GetPostById(postId); // Get the post by its id

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

      <Separator color={theme.colors.detailText} style={{marginVertical: 20}} />
      
      {/* Comment section */} 
      <View>
        {/* Last comment */}
        {post.lastComment && (
          <>
            <View style={styles.commentSection}>
              <View style={{marginBottom:10}}>
                <CustomTextNunito weight={'SemiBold'} style={{fontSize: 18, marginBottom:10}}>{I18n.t(TextKey.commentsTitle)} ({post.numberOfComments})</CustomTextNunito>
                <View style={{flexDirection: 'row', justifyContent: 'space-between' }} >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}> 
                    <Image source={{uri: post.lastComment.userProfilePicture}} style={{ width: 24, height: 24, borderRadius: 100 }} />
                    <CustomTextNunito weight='Bold' style={{marginLeft:8}}>{post.lastComment.userId}</CustomTextNunito>
                  </View>
                  <CustomTextNunito style={styles.timeAgo}>
                    {formatDistanceToNow(new Date(post.createdAt * 1000))} ago
                  </CustomTextNunito>
                </View>
                <CustomTextNunito style={{marginLeft:30}}>{post.lastComment.comment}</CustomTextNunito>
              </View>
              <View>
                <CustomHighlightedTextNunito weight='BoldItalic'>{I18n.t(TextKey.commentsViewMore)}</CustomHighlightedTextNunito>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
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
    marginHorizontal: 14,
  },
  textOfMetadata: {
    fontSize: 12,
    color: theme.colors.detailText,
    marginLeft: 4,
  },
  commentSection: {
    marginHorizontal: 10,
    marginBottom: 10
  },
});

export default PostDetail;
