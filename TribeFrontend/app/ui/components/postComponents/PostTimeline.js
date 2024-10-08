import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import ContentCarousel from './ContentCarousel';
import { formatDistanceToNow } from 'date-fns'; // Optional: Helps to format the timestamp.

// PostTimeline component
const PostTimeline = ({post}) => {

  return (
    <View style={styles.container}>
      {/* User info */}
      <View style={styles.header}>
        <Text style={styles.username}>User: {post.userId}</Text>
        <Text style={styles.timeAgo}>
          {formatDistanceToNow(new Date(post.createdAt * 1000))} ago
        </Text>
      </View>

      {/* Post description */}
      <Text style={styles.description}>{post.description}</Text>

      {console.log(post.multimedia)}
      <ContentCarousel multimedia={post.multimedia} />

      {/* Post metadata */}
      <View style={styles.metadata}>
        <Text style={styles.likes}>Likes: {post.likes}</Text>
        <Text style={styles.comments}>Comments: {post.numberOfComments}</Text>
      </View>

      {/* Last comment */}
      <View style={styles.commentSection}>
        <Text style={styles.commentUser}>Comment by {post.lastComment.userId}:</Text>
        <Text style={styles.commentText}>"{post.lastComment.comment}"</Text>
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
    fontWeight: 'bold',
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
  likes: {
    fontWeight: 'bold',
  },
  comments: {
    fontWeight: 'bold',
  },
  commentSection: {
    marginTop: 8,
  },
  commentUser: {
    fontWeight: 'bold',
  },
  commentText: {
    fontStyle: 'italic',
    color: 'gray',
  },
});

export default PostTimeline;
