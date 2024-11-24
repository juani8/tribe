// PostComments.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, ActivityIndicator, StyleSheet } from 'react-native';
import moment from 'moment';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { useTheme } from 'context/ThemeContext';
import { getCommentsForPost } from 'networking/api/postsApi';

const PostComments = ({ postId }) => {
  const { theme } = useTheme();
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(true);

  const pageSize = 10; // Adjust as needed

  const fetchComments = async (nextPage = 1) => {
    if (!hasMoreComments) return;

    try {
      const offset = (nextPage - 1) * pageSize;
      const newComments = await getCommentsForPost(postId, offset, pageSize);

      setComments(prevComments => (nextPage === 1 ? newComments : [...prevComments, ...newComments]));
      setPage(nextPage);
      setHasMoreComments(newComments.length === pageSize); // Check if more comments are available
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoadingNextPage(false);
    }
  };

  const fetchNextPage = () => {
    if (!isLoadingNextPage && hasMoreComments) {
      setIsLoadingNextPage(true);
      fetchComments(page + 1);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <View>
      <FlatList
        data={comments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            <Image source={item.userId.profileImage ? { uri: item.userId.profileImage } : theme.UserCircleLight} style={styles.profileImage} />
            <View style={styles.commentContent}>
              <View style={styles.header}>
                <CustomTextNunito weight="SemiBold" style={styles.nickName}>
                  {item.userId.nickName}
                </CustomTextNunito>
                <CustomTextNunito style={styles.commentDate}>
                  {moment(item.createdAt).fromNow()}
                </CustomTextNunito>
              </View>
              <CustomTextNunito style={styles.commentText}>{item.comment}</CustomTextNunito>
            </View>
          </View>
        )}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.8}
        ListFooterComponent={isLoadingNextPage && (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        scrollEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  container: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    position: 'absolute',
    bottom: 0,
  },
  contentWrapper: {
    paddingHorizontal: 16,
  },
  commentContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nickName: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  commentDate: {
    color: '#AAAAAA',
    fontSize: 12,
  },
  commentText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 4,
  },
});

export default PostComments;
