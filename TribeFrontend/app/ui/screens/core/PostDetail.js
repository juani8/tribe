import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ScrollView, Keyboard, TouchableWithoutFeedback, Alert, TouchableOpacity, ActivityIndicator, TextInput, Platform } from 'react-native';
import ContentCarousel from 'ui/components/postComponents/ContentCarousel';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTheme } from 'context/ThemeContext';
import { Send } from 'assets/images';
import {GetPostById} from 'networking/api/postsApi';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import CustomHighlightedTextNunito from 'ui/components/generalPurposeComponents/CustomHighlightedTextNunito';
import { createComment } from 'networking/api/postsApi';
import PostMainContent from 'ui/components/postComponents/PostMainContent';
import { usePostContext } from 'context/PostContext';
import { useUserContext } from 'context/UserContext';
import PostComments from 'ui/components/postComponents/PostComments';
import PopupMenu from 'ui/components/generalPurposeComponents/PopupMenu';

const PostDetail = ({ route }) => {
  const { post } = route.params;
  const [commentText, setCommentText] = useState('');
  const { theme, isDarkMode } = useTheme();
  const { user } = useUserContext();
  const styles = createStyles(theme, isDarkMode);
  const [isCommentViewVisible, setCommentViewVisible] = useState(false);
  const [isCreatingComment, setIsCreatingComment] = useState(false);
  const { totalComments, lastComments, handleAddComment } = usePostContext();

  const postTotalComments = totalComments.get(post._id) ?? post.totalComments;
  const postLastComment = lastComments.get(post._id) ?? post.lastComment;
  const currentLocale = I18n.locale?.startsWith('es') ? es : enUS;

  // Handlers for menu visibility
  const openCommentView = () => setCommentViewVisible(true);
  const closeCommentView = () => setCommentViewVisible(false);

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

  const handleCreateComment = async () => {
    if (commentText.trim().length > 0) {
      setIsCreatingComment(true);
      try {
        const commentData = { content: commentText };
        const postDTO = { _id: post._id, totalComments: post.totalComments };
        await handleAddComment(postDTO, commentData);
        setCommentText('');
      } catch (error) {
        console.error('Error creating comment:', error);
        Alert.alert(
          I18n.locale?.startsWith('es') ? 'Error' : 'Error',
          I18n.locale?.startsWith('es') ? 'No se pudo crear el comentario' : 'Could not create comment'
        );
      } finally {
        setIsCreatingComment(false);
      }
    }
  };

  return (
    <>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Post Content */}
        <PostMainContent post={post} viewMore={false} />

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <View style={styles.commentsHeader}>
            <CustomTextNunito weight="Bold" style={styles.commentsTitle}>
              {I18n.t(TextKey.commentsTitle)}
            </CustomTextNunito>
            {postTotalComments > 0 && (
              <View style={styles.commentsBadge}>
                <CustomTextNunito weight="SemiBold" style={styles.commentsBadgeText}>
                  {postTotalComments}
                </CustomTextNunito>
              </View>
            )}
          </View>

          {/* Comment Input */}
          <View style={styles.commentInputContainer}>
            <Image 
              source={user?.profileImage ? { uri: user.profileImage } : theme.UserCircle} 
              style={styles.commentInputAvatar} 
            />
            <View style={styles.commentInputWrapper}>
              <TextInput
                style={styles.commentInput}
                placeholder={I18n.t(TextKey.commentsWriteCommentPlaceholder)}
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
                (!commentText.trim() || isCreatingComment) && styles.sendButtonDisabled
              ]}
              onPress={handleCreateComment}
              disabled={!commentText.trim() || isCreatingComment}
            >
              {isCreatingComment ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Image source={Send} style={styles.sendIcon} />
              )}
            </TouchableOpacity>
          </View>

          {/* Last Comment Preview */}
          {postTotalComments > 0 && postLastComment && (
            <View style={styles.lastCommentContainer}>
              <View style={styles.lastCommentHeader}>
                <Image 
                  source={postLastComment?.userId?.profileImage ? { uri: postLastComment.userId.profileImage } : theme.UserCircle}
                  style={styles.lastCommentAvatar} 
                />
                <View style={styles.lastCommentInfo}>
                  <CustomTextNunito weight="Bold" style={styles.lastCommentNickname}>
                    {postLastComment.userId?.nickName || 'Usuario'}
                  </CustomTextNunito>
                  <CustomTextNunito style={styles.lastCommentTime}>
                    {formatTimeAgo(postLastComment?.createdAt)}
                  </CustomTextNunito>
                </View>
              </View>
              <View style={styles.lastCommentBubble}>
                <CustomTextNunito style={styles.lastCommentText}>
                  {postLastComment.comment}
                </CustomTextNunito>
              </View>
              
              {postTotalComments > 1 && (
                <TouchableOpacity style={styles.viewMoreButton} onPress={openCommentView}>
                  <CustomTextNunito weight="SemiBold" style={styles.viewMoreText}>
                    {I18n.locale?.startsWith('es') 
                      ? `Ver los ${postTotalComments} comentarios` 
                      : `View all ${postTotalComments} comments`}
                  </CustomTextNunito>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Empty state */}
          {postTotalComments === 0 && (
            <View style={styles.emptyComments}>
              <CustomTextNunito style={styles.emptyCommentsText}>
                {I18n.locale?.startsWith('es') 
                  ? 'Sé el primero en comentar' 
                  : 'Be the first to comment'}
              </CustomTextNunito>
            </View>
          )}
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
    
    <PopupMenu
      visible={isCommentViewVisible}
      onClose={closeCommentView}
      title={I18n.t(TextKey.commentsViewTitle)}
    >
      <PostComments onClose={closeCommentView} postId={post._id} />
    </PopupMenu>
    </>
  );
};

const createStyles = (theme, isDarkMode) => StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    paddingBottom: 30,
  },
  commentsSection: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  commentsTitle: {
    fontSize: 18,
    color: theme.colors.text,
  },
  commentsBadge: {
    marginLeft: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  commentsBadgeText: {
    color: '#fff',
    fontSize: 13,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  commentInputAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    marginBottom: 4,
  },
  commentInputWrapper: {
    flex: 1,
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : '#f0f2f5',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    minHeight: 42,
    justifyContent: 'center',
  },
  commentInput: {
    color: theme.colors.text,
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    maxHeight: 100,
    paddingVertical: 0,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginBottom: 2,
  },
  sendButtonDisabled: {
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.2)' : '#ccc',
  },
  sendIcon: {
    width: 18,
    height: 18,
    tintColor: '#fff',
  },
  lastCommentContainer: {
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
    borderRadius: 16,
    padding: 14,
  },
  lastCommentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  lastCommentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  lastCommentInfo: {
    flex: 1,
  },
  lastCommentNickname: {
    fontSize: 14,
    color: theme.colors.text,
  },
  lastCommentTime: {
    fontSize: 11,
    color: theme.colors.detailText,
  },
  lastCommentBubble: {
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  lastCommentText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  viewMoreButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  viewMoreText: {
    color: theme.colors.primary,
    fontSize: 14,
  },
  emptyComments: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyCommentsText: {
    color: theme.colors.detailText,
    fontSize: 14,
  },
});

export default PostDetail;
