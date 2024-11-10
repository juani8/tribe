import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ScrollView, Keyboard, TouchableWithoutFeedback, Alert, TouchableOpacity } from 'react-native';
import ContentCarousel from 'ui/components/postComponents/ContentCarousel';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from 'context/ThemeContext';
import { Send } from 'assets/images';
import Separator from 'ui/components/generalPurposeComponents/Separator';
import {GetPostById} from 'networking/api/postsApi';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import CustomHighlightedTextNunito from 'ui/components/generalPurposeComponents/CustomHighlightedTextNunito';
import CustomInputNunito from 'ui/components/generalPurposeComponents/CustomInputNunito';
import { createComment } from 'networking/api/postsApi';
import PostMainContent from 'ui/components/postComponents/PostMainContent';
import PostComments from 'ui/components/postComponents/PostComments';
import PopupMenu from 'ui/components/generalPurposeComponents/PopupMenu';

const PostDetail = ({ route }) => {
  const { post } = route.params;
  const [commentText, setCommentText] = useState('');
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const [isCommentViewVisible, setCommentViewVisible] = useState(false);

  // Handlers for menu visibility
  const openCommentView = () => setCommentViewVisible(true);
  const closeCommentView = () => setCommentViewVisible(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardOffset(140);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOffset(0);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);


  const handleCreateComment = async () => {
    if (commentText.trim().length > 0) {
      try {
        const commentData = { content: commentText };
        console.log('Creating comment:', post);
        const newComment = await createComment(post._id, commentData);
        console.log('Comment created:', newComment);
        // Reset the comment text
        setCommentText('');
      } catch (error) {
        console.error('Error creating comment:', error);
        Alert.alert('There was an error creating your comment.', 'Please try again.');
      }
    } else {
      Alert.alert('Please enter a comment before submitting.');
    }
  };


  return (
    <>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container}>
        <PostMainContent post={post} viewMore={false} />

        <Separator color={theme.colors.detailText} style={{marginVertical: 14}} />
        
        {/* Comment section */}
        <View>
          <View style={styles.commentSection}>
            <View style={{marginBottom:10}}>
              <CustomTextNunito weight={'SemiBold'} style={{fontSize: 18, marginBottom:10}}>
                {I18n.t(TextKey.commentsTitle)} ({post.totalComments})
              </CustomTextNunito>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{width: '92%'}}>
                  <CustomInputNunito inputText={commentText} setInputText={setCommentText} placeholder={I18n.t(TextKey.commentsWriteCommentPlaceholder)} />
                </View>
                <TouchableOpacity onPress={handleCreateComment}>
                  <Image source={Send} style={{ width: 30, height: 30, marginTop: -15 }} />
                </TouchableOpacity>
              </View>
              {post.totalComments > 0 ? (
                <>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}> 
                      <Image source={post.lastComment?.userId?.profileImage ? { uri: post.lastComment.userId.profileImage } : theme.UserCircleLight} 
                      style={{ width: 24, height: 24, borderRadius: 100 }} />
                      <CustomTextNunito weight='Bold' style={{marginLeft:8}}>{post.lastComment.userId?.nickName}</CustomTextNunito>
                    </View>
                    <CustomTextNunito style={styles.timeAgo}>
                      {formatDistanceToNow(new Date(post.lastComment?.createdAt))} ago
                    </CustomTextNunito>
                  </View>
                  <CustomTextNunito style={{marginLeft:30}}>{post.lastComment.comment}</CustomTextNunito>
                  <TouchableOpacity style={{marginTop:6}} onPress={openCommentView}>
                    <CustomHighlightedTextNunito weight='BoldItalic'>{I18n.t(TextKey.commentsViewMore)}</CustomHighlightedTextNunito>
                  </TouchableOpacity>
                </>
              ) : (
                <CustomTextNunito>{post.lastComment}</CustomTextNunito>
              )}
            </View>
          </View>
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

const createStyles = (theme) => StyleSheet.create({
  container: {
    paddingHorizontal: 20,
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
