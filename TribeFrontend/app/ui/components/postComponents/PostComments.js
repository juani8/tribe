import React from 'react';
import { View, TouchableOpacity, Modal, FlatList, StyleSheet, Image } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import CustomTextNunito from './CustomTextNunito';
import { useTheme } from 'context/ThemeContext';
import moment from 'moment';

const PostComments = ({ visible, onClose, comments = [], title }) => {
  const { theme } = useTheme();

  const renderComment = ({ item }) => (
    <View style={styles.commentContainer}>
      {/* Profile Image */}
      <Image source={{ uri: item.userId.profileImage }} style={styles.profileImage} />

      <View style={styles.commentContent}>
        {/* Username and Date */}
        <View style={styles.header}>
          <CustomTextNunito weight="SemiBold" style={styles.nickName}>
            {item.userId.nickName}
          </CustomTextNunito>
          <CustomTextNunito style={styles.commentDate}>
            {moment(item.createdAt).fromNow()}
          </CustomTextNunito>
        </View>

        {/* Comment Text */}
        <CustomTextNunito style={styles.commentText}>
          {item.comment}
        </CustomTextNunito>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        {visible && (
          <Animated.View
            entering={FadeInDown.duration(400)}
            exiting={FadeOutUp.duration(500)}
            style={styles.container}
          >
            <View style={styles.contentWrapper}>
              <CustomTextNunito
                weight="Bold"
                style={{
                  textAlign: 'center',
                  marginVertical: 10,
                  color: theme.colors.options,
                  fontSize: 20,
                }}
              >
                {title}
              </CustomTextNunito>

              {/* Comments List */}
              <FlatList
                data={comments}
                keyExtractor={(item) => item._id}
                renderItem={renderComment}
              />
            </View>
          </Animated.View>
        )}
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
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
