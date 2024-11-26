import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Keyboard, TouchableOpacity, Image, Pressable, TouchableWithoutFeedback } from 'react-native';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import CustomInputNunito from 'ui/components/generalPurposeComponents/CustomInputNunito';
import CustomButton from 'ui/components/generalPurposeComponents/CustomButton';
import { useTheme } from 'context/ThemeContext';
import { selectFromGallery, openCamera, handleLocationToggle } from 'helper/MultimediaHelper';
import CheckBox from '@react-native-community/checkbox';
import Video from 'react-native-video-controls';
import { getLocation } from 'helper/LocationHelper';
import { createPost } from 'networking/api/postsApi';
import { navigateToHomeRefresh } from 'helper/navigationHandlers/CoreNavigationHandlers';
import FullSizeImage from 'ui/components/generalPurposeComponents/FullSizeImage';
import { VideoFill } from 'assets/images';

export default function UploadScreen({ navigation }) {
  const [commentText, setCommentText] = useState('');
  const [selectedMedia, setSelectedMedia] = useState([]);
  const { theme } = useTheme();
  const [checkboxSelection, setCheckboxSelection] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUri, setCurrentUri] = useState('');
  const [currentType, setCurrentType] = useState('');

  const styles = createStyles(theme);

  const handleCreatePost = async () => {
    // Check if there is any media selected
    if (selectedMedia.length === 0) {
      return;
    } else {
      // Create the post with the selected media
      try {
        const postMedia = selectedMedia.map(media => ({
          url: media.uri,
          type: media.type.startsWith('image') ? 'image' : 'video'
        }));
        const postComment = (commentText.trim().length > 0) ? commentText : null;
        const { latitude, longitude } = checkboxSelection ? await getLocation() : { latitude: undefined, longitude: undefined };

        const postData = {
          multimedia: postMedia,
          description: postComment,
          latitude: latitude,
          longitude: longitude
        };

        // Send the post data to the backend
        await createPost(postData);

        navigateToHomeRefresh(navigation);
        // Reset the states
        setSelectedMedia([]);
        setCommentText('');
        setCheckboxSelection(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Function to remove selected media
  const removeMedia = (uri) => {
    setSelectedMedia(selectedMedia.filter(item => item.uri !== uri));
  };

  // Function to dismiss keyboard when touching outside the input
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const toggleModal = (uri, type) => {
    setCurrentUri(uri);
    setCurrentType(type);
    setIsModalVisible(!isModalVisible);
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <ScrollView style={[{ backgroundColor: theme.colors.background }]}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ flexGrow: 1, alignItems: 'flex-start', justifyContent: 'flex-start', gap: 25 }}
        >
          {selectedMedia.length > 0 && (
            <View>
              <CustomTextNunito style={{ fontSize: 20 }}>{I18n.t(TextKey.uploadSelectedContent)}</CustomTextNunito>
              <ScrollView
                horizontal
                style={[styles.mediaContainer, { flexGrow: 0 }]}
              >
                {selectedMedia.map((media, index) => (
                  <View key={index} style={styles.mediaItem}>
                    {media.type.startsWith('image') ? (
                        <TouchableOpacity onPress={() => toggleModal(media.uri, 'image')}>
                            <Image source={{ uri: media.uri }} style={styles.mediaThumbnail} />
                        </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={() => toggleModal(media.uri, 'video')}>
                        <Video
                          source={{ uri: media.uri }}
                          style={styles.mediaThumbnail}
                          resizeMode="cover"
                          paused={true}
                          disableBack
                          disableFullscreen
                          disableVolume
                          disablePlayPause
                          disableSeekbar
                          disableTimer
                        />
                        <Image source={VideoFill} style={styles.playButton} />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeMedia(media.uri)}
                    >
                      <CustomTextNunito
                        weight={'Bold'}
                        style={{ color: theme.colors.background, marginTop: -4 }}
                      >
                        x
                      </CustomTextNunito>
                    </TouchableOpacity>
                  </View>
                ))}
                </ScrollView>
            </View>
          )}
          <View>
            <CustomTextNunito style={{ fontSize: 20 }}>{selectedMedia.length > 0 ? I18n.t(TextKey.uploadMoreMessage) : I18n.t(TextKey.uploadMessage)}</CustomTextNunito>
            <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 10 }}>
              {/* Buttons for selecting from gallery and opening camera */}
              <CustomButton
                title={I18n.t(TextKey.uploadSelectFromGallery)}
                onPress={() => selectFromGallery(selectedMedia, setSelectedMedia)}
                color={theme.colors.uploadButtons}
                textWeight={'Bold'}
                fullSize={true}
                style={styles.button}
              />
              <CustomButton
                title={I18n.t(TextKey.uploadSelectOpenCamera)}
                onPress={() => openCamera(selectedMedia, setSelectedMedia)}
                color={theme.colors.uploadButtons}
                textWeight={'Bold'}
                fullSize={true}
                style={styles.button}
              />
            </View>
          </View>

          <View style={{ gap: 6 }}>
            {/* Description Input */}
            <CustomTextNunito style={{ fontSize: 20 }}>{I18n.t(TextKey.uploadDescriptionTitle)}</CustomTextNunito>
            <View>
              <CustomInputNunito
                inputText={commentText}
                setInputText={setCommentText}
                placeholder={I18n.t(TextKey.uploadDescriptionPlaceholder)}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Add Location Button */}
            <CheckBox
              value={checkboxSelection}
              onValueChange={() => handleLocationToggle(checkboxSelection, setCheckboxSelection)}
              tintColors={{ true: theme.colors.primary, false: theme.colors.primary }}
            />
            <CustomTextNunito onPress={() => handleLocationToggle(checkboxSelection, setCheckboxSelection)}>{I18n.t(TextKey.uploadAddLocation)}</CustomTextNunito>
          </View>
          <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 10 }}>
            <CustomButton
              title={I18n.t(TextKey.uploadConfirmation)}
              normalizedSize={true}
              style={[styles.button, { alignSelf: 'flex-start' }]}
              locked={selectedMedia.length > 0 ? false : true}
              onPress={handleCreatePost}
              showLoading={true}
            />
          </View>
        </ScrollView>
        <FullSizeImage isModalVisible={isModalVisible} uri={currentUri} type={currentType} toggleModal={toggleModal} />
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

// Styles for the UploadScreen
const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  mediaItem: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  mediaThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  playButton: {
    position: 'absolute',
    top: '36%',
    left: '38%',
    width: 30,
    height: 30,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: theme.colors.primary,
    borderRadius: 100,
    paddingHorizontal: 5,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.background,
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  button: {
    marginVertical: 10,
  },
});