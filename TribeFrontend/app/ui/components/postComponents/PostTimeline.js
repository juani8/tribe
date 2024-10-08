import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import ContentCarousel from './ContentCarousel';
import { formatDistanceToNow } from 'date-fns'; // Optional: Helps to format the timestamp.

import CustomTextNunito from '../generalPurposeComponents/CustomTextNunito';

// PostTimeline component
const PostTimeline = ({post}) => {

  return (
    <View style={styles.container}>
      {/* User info */}
      <Image
        source={post.userProfilePicture}
        style={{ width: 100, height: 100, marginTop: 50 }}
        resizeMode="contain"
      />
      <View style={styles.header}>
        <CustomTextNunito style={styles.username}>{post.userId}</CustomTextNunito>
        <CustomTextNunito style={styles.timeAgo}>
          {formatDistanceToNow(new Date(post.createdAt * 1000))} ago
        </CustomTextNunito>
      </View>

      {/* Post description */}
      <CustomTextNunito style={styles.description}>{post.description}</CustomTextNunito>

      {console.log(post.multimedia)}
      <ContentCarousel multimedia={post.multimedia} />

      {/* Post metadata */}
      <View style={styles.metadata}>
        <CustomTextNunito style={styles.likes}>Likes: {post.likes}</CustomTextNunito>
        <CustomTextNunito style={styles.comments}>Comments: {post.numberOfComments}</CustomTextNunito>
      </View>

      {/* Last comment */}
      <View style={styles.commentSection}>
        <CustomTextNunito style={styles.commentUser}>Comment by {post.lastComment.userId}:</CustomTextNunito>
        <CustomTextNunito style={styles.commentText}>"{post.lastComment.comment}"</CustomTextNunito>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  username: {
    fontSize: 16,
  },
  timeAgo: {
    color: 'gray',
    fontSize: 14,
  },
  description: {
    marginVertical: 8,
    fontSize: 16,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  commentSection: {
    marginTop: 8,
  },
});

export default PostTimeline;
