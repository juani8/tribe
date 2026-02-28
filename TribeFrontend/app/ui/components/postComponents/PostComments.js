// PostComments.js - Enhanced version with comment input and better UI
import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  FlatList, 
  Image, 
  ActivityIndicator, 
  StyleSheet, 
  Dimensions,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { useTheme } from 'context/ThemeContext';
import { getCommentsForPost, createComment } from 'networking/api/postsApi';
import { useUserContext } from 'context/UserContext';
import { usePostContext } from 'context/PostContext';
import I18n from 'assets/localization/i18n';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const PostComments = ({ postId, onClose }) => {
  const { theme, isDarkMode } = useTheme();
  const { user } = useUserContext();
  const { handleAddComment } = usePostContext();
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const styles = createStyles(theme, isDarkMode);

  const pageSize = 15;
  const currentLocale = I18n.locale?.startsWith('es') ? es : enUS;

  const formatTimeAgo = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { 
        addSuffix: true,
        locale: currentLocale 
      });
    } catch {
      return '';
    }
  };

  const fetchComments = async (nextPage = 1) => {
    if (!hasMoreComments && nextPage > 1) return;

    try {
      const offset = (nextPage - 1) * pageSize;
      const newComments = await getCommentsForPost(postId, offset, pageSize);

      setComments(prevComments => (nextPage === 1 ? newComments : [...prevComments, ...newComments]));
      setPage(nextPage);
      setHasMoreComments(newComments.length === pageSize);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingNextPage(false);
    }
  };

  const fetchNextPage = () => {
    if (!isLoadingNextPage && hasMoreComments) {
      setIsLoadingNextPage(true);
      fetchComments(page + 1);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const commentData = { content: commentText.trim() };
      const newComment = await createComment(postId, commentData);
      
      // Add the new comment to the top of the list
      if (newComment) {
        const commentWithUser = {
          ...newComment,
          userId: {
            _id: user._id,
            nickName: user.nickName,
            profileImage: user.profileImage,
          },
          createdAt: new Date().toISOString(),
        };
        setComments(prev => [commentWithUser, ...prev]);
        
        // Update context
        const postDTO = { _id: postId };
        handleAddComment(postDTO, commentData);
      }
      
      setCommentText('');
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (postId) {
      setIsLoading(true);
      setComments([]);
      setPage(1);
      setHasMoreComments(true);
      fetchComments(1);
    }
  }, [postId]);

  const renderComment = ({ item, index }) => (
    <View style={[styles.commentContainer, index === 0 && styles.firstComment]}>
      {/* Avatar */}
      <Image 
        source={item.userId?.profileImage ? { uri: item.userId.profileImage } : theme.UserCircle} 
        style={styles.profileImage} 
      />
      
      {/* Comment Content */}
      <View style={styles.commentContent}>
        <View style={styles.commentBubble}>
          <CustomTextNunito weight="Bold" style={styles.nickName}>
            {item.userId?.nickName || 'Usuario'}
          </CustomTextNunito>
          <CustomTextNunito style={styles.commentText}>
            {item.comment}
          </CustomTextNunito>
        </View>
        <CustomTextNunito style={styles.commentDate}>
          {formatTimeAgo(item.createdAt)}
        </CustomTextNunito>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <CustomTextNunito style={styles.emptyText}>
        {I18n.locale?.startsWith('es') 
          ? 'Sé el primero en comentar' 
          : 'Be the first to comment'}
      </CustomTextNunito>
    </View>
  );

  const renderFooter = () => {
    if (!isLoadingNextPage) return null;
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      {/* Comments List */}
      <FlatList
        data={comments}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={renderComment}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.3}
        nestedScrollEnabled={true}
        scrollEnabled={true}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.listContent,
          comments.length === 0 && styles.emptyListContent
        ]}
        showsVerticalScrollIndicator={true}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
      />

      {/* Comment Input */}
      <View style={styles.inputContainer}>
        <Image 
          source={user?.profileImage ? { uri: user.profileImage } : theme.UserCircle} 
          style={styles.inputAvatar} 
        />
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder={I18n.locale?.startsWith('es') ? 'Escribe un comentario...' : 'Write a comment...'}
            placeholderTextColor={theme.colors.detailText}
            value={commentText}
            onChangeText={setCommentText}
            multiline
            maxLength={500}
          />
        </View>
        <TouchableOpacity 
          style={[
            styles.sendButton,
            (!commentText.trim() || isSubmitting) && styles.sendButtonDisabled
          ]}
          onPress={handleSubmitComment}
          disabled={!commentText.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <CustomTextNunito weight="Bold" style={styles.sendButtonText}>
              ›
            </CustomTextNunito>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme, isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  commentContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  firstComment: {
    paddingTop: 4,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surface || theme.colors.card,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : '#f0f2f5',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  nickName: {
    color: theme.colors.text,
    fontSize: 13,
    marginBottom: 2,
  },
  commentText: {
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 19,
  },
  commentDate: {
    color: theme.colors.detailText,
    fontSize: 11,
    marginTop: 4,
    marginLeft: 12,
  },
  loaderContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: theme.colors.detailText,
    fontSize: 15,
  },
  // Input section
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
    backgroundColor: isDarkMode ? theme.colors.background : '#fff',
  },
  inputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : '#f0f2f5',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    minHeight: 40,
    justifyContent: 'center',
  },
  textInput: {
    color: theme.colors.text,
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    maxHeight: 80,
    paddingVertical: 0,
    textAlignVertical: 'center',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.2)' : '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 22,
  },
});

export default PostComments;
