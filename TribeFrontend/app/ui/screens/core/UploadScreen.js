import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Keyboard, TouchableOpacity, Image, Pressable, TouchableWithoutFeedback, Dimensions, Modal, Alert, ActionSheetIOS, Platform } from 'react-native';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import CustomInputNunito from 'ui/components/generalPurposeComponents/CustomInputNunito';
import CustomButton from 'ui/components/generalPurposeComponents/CustomButton';
import { useTheme } from 'context/ThemeContext';
import { selectFromGallery, openCamera, handleLocationToggle, handleCameraCapture } from 'helper/MultimediaHelper';
import CameraScreen from 'ui/components/generalPurposeComponents/CameraScreen';
import CheckBox from '@react-native-community/checkbox';
import Video from 'react-native-video-controls';
import { getLocation, reverseGeocode } from 'helper/LocationHelper';
import { createPost } from 'networking/api/postsApi';
import { navigateToHome } from 'helper/navigationHandlers/CoreNavigationHandlers';
import FullSizeImage from 'ui/components/generalPurposeComponents/FullSizeImage';
import { VideoFill, GalleryGoogle, CameraGoogle } from 'assets/images';
import uploadToCloudinary from 'helper/CloudinaryHelper';

const { width } = Dimensions.get('window');

export default function UploadScreen({ navigation }) {
  const [commentText, setCommentText] = useState('');
  const [selectedMedia, setSelectedMedia] = useState([]);
  const { theme, isDarkMode } = useTheme();
  const [checkboxSelection, setCheckboxSelection] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUri, setCurrentUri] = useState('');
  const [currentType, setCurrentType] = useState('');
  const [cameraVisible, setCameraVisible] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const styles = createStyles(theme, isDarkMode);

  // Handle media captured from camera
  const onCameraCapture = (capturedMedia) => {
    handleCameraCapture(capturedMedia, selectedMedia, setSelectedMedia);
    setCameraVisible(false);
  };

  // Show add media options (Gallery or Camera)
  const showAddMediaOptions = () => {
    const galleryOption = I18n.locale?.startsWith('es') ? 'Galería' : 'Gallery';
    const cameraOption = I18n.locale?.startsWith('es') ? 'Cámara' : 'Camera';
    const cancelOption = I18n.locale?.startsWith('es') ? 'Cancelar' : 'Cancel';

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [cancelOption, galleryOption, cameraOption],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            selectFromGallery(selectedMedia, setSelectedMedia);
          } else if (buttonIndex === 2) {
            setCameraVisible(true);
          }
        }
      );
    } else {
      Alert.alert(
        I18n.locale?.startsWith('es') ? 'Añadir contenido' : 'Add content',
        I18n.locale?.startsWith('es') ? '¿De dónde quieres añadir?' : 'Where do you want to add from?',
        [
          { text: galleryOption, onPress: () => selectFromGallery(selectedMedia, setSelectedMedia) },
          { text: cameraOption, onPress: () => setCameraVisible(true) },
          { text: cancelOption, style: 'cancel' },
        ]
      );
    }
  };

  // Handle location toggle with reverse geocoding
  const handleLocationSelection = async () => {
    if (checkboxSelection) {
      // Turning off
      setCheckboxSelection(false);
      setLocationName('');
    } else {
      // Turning on - get location and reverse geocode
      setIsLoadingLocation(true);
      try {
        const hasPermission = await handleLocationToggle(false, (val) => {});
        const location = await getLocation();
        if (location && location.latitude && location.longitude) {
          setCheckboxSelection(true);
          // Try to get location name
          const address = await reverseGeocode(location.latitude, location.longitude);
          setLocationName(address || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`);
        }
      } catch (error) {
        console.error('Location error:', error);
        setCheckboxSelection(true);
        setLocationName(I18n.locale?.startsWith('es') ? 'Ubicación actual' : 'Current location');
      } finally {
        setIsLoadingLocation(false);
      }
    }
  };

  const handleCreatePost = async () => {
    if (selectedMedia.length === 0) {
      return;
    } else {
      try {
        const uploadedMedia = await Promise.all(selectedMedia.map(async (media) => {
          const url = await uploadToCloudinary(media.uri, media.type);
          return { url, type: media.type.startsWith('image') ? 'image' : 'video' };
        }));
  
        const postComment = (commentText.trim().length > 0) ? commentText : null;
        const { latitude, longitude } = checkboxSelection ? await getLocation() : { latitude: undefined, longitude: undefined };
  
        const postData = {
          multimedia: uploadedMedia,
          description: postComment,
          latitude: latitude,
          longitude: longitude
        };
  
        await createPost(postData);
  
        navigateToHome(navigation);
        setSelectedMedia([]);
        setCommentText('');
        setCheckboxSelection(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const removeMedia = (uri) => {
    setSelectedMedia(selectedMedia.filter(item => item.uri !== uri));
  };

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
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerSection}>
            <CustomTextNunito weight="Bold" style={styles.title}>
              {I18n.locale?.startsWith('es') ? 'Crear publicación' : 'Create Post'}
            </CustomTextNunito>
            <CustomTextNunito style={styles.subtitle}>
              {I18n.locale?.startsWith('es') 
                ? 'Comparte tus mejores momentos' 
                : 'Share your best moments'}
            </CustomTextNunito>
          </View>

          {/* Media Section */}
          <View style={styles.section}>
            <CustomTextNunito weight="SemiBold" style={styles.sectionTitle}>
              {selectedMedia.length > 0 
                ? I18n.t(TextKey.uploadSelectedContent) 
                : I18n.t(TextKey.uploadMessage)}
            </CustomTextNunito>
            
            {selectedMedia.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.mediaScroll}
                contentContainerStyle={styles.mediaScrollContent}
              >
                {selectedMedia.map((media, index) => (
                  <View key={index} style={styles.mediaItemWrapper}>
                    <View style={styles.mediaItem}>
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
                          <View style={styles.videoOverlay}>
                            <Image source={VideoFill} style={styles.playIcon} />
                          </View>
                        </TouchableOpacity>
                      )}
                    </View>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeMedia(media.uri)}
                    >
                      <CustomTextNunito weight="Bold" style={styles.removeButtonText}>
                        ×
                      </CustomTextNunito>
                    </TouchableOpacity>
                  </View>
                ))}
                
                {/* Add more button */}
                <TouchableOpacity 
                  style={styles.addMoreButton}
                  onPress={showAddMediaOptions}
                >
                  <CustomTextNunito style={styles.addMoreIcon}>+</CustomTextNunito>
                  <CustomTextNunito style={styles.addMoreText}>
                    {I18n.locale?.startsWith('es') ? 'Añadir' : 'Add'}
                  </CustomTextNunito>
                </TouchableOpacity>
              </ScrollView>
            ) : (
              <View style={styles.uploadButtons}>
                <TouchableOpacity 
                  style={styles.uploadOption}
                  onPress={() => selectFromGallery(selectedMedia, setSelectedMedia)}
                >
                  <View style={styles.uploadIconContainer}>
                    <Image source={GalleryGoogle} style={styles.googleIcon} />
                  </View>
                  <CustomTextNunito weight="SemiBold" style={styles.uploadOptionTitle}>
                    {I18n.t(TextKey.uploadSelectFromGallery)}
                  </CustomTextNunito>
                  <CustomTextNunito style={styles.uploadOptionSubtitle}>
                    {I18n.locale?.startsWith('es') ? 'Fotos y videos' : 'Photos and videos'}
                  </CustomTextNunito>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.uploadOption}
                  onPress={() => openCamera(selectedMedia, setSelectedMedia, setCameraVisible)}
                >
                  <View style={styles.uploadIconContainer}>
                    <Image source={CameraGoogle} style={styles.googleIcon} />
                  </View>
                  <CustomTextNunito weight="SemiBold" style={styles.uploadOptionTitle}>
                    {I18n.t(TextKey.uploadSelectOpenCamera)}
                  </CustomTextNunito>
                  <CustomTextNunito style={styles.uploadOptionSubtitle}>
                    {I18n.locale?.startsWith('es') ? 'Foto o video' : 'Photo or video'}
                  </CustomTextNunito>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Description Section */}
          <View style={styles.section}>
            <CustomTextNunito weight="SemiBold" style={styles.sectionTitle}>
              {I18n.t(TextKey.uploadDescriptionTitle)}
            </CustomTextNunito>
            <View style={styles.inputContainer}>
              <CustomInputNunito
                inputText={commentText}
                setInputText={setCommentText}
                placeholder={I18n.t(TextKey.uploadDescriptionPlaceholder)}
                multiline={true}
              />
            </View>
          </View>

          {/* Location Section */}
          <TouchableOpacity 
            style={styles.locationRow}
            onPress={handleLocationSelection}
            activeOpacity={0.7}
            disabled={isLoadingLocation}
          >
            <CheckBox
              value={checkboxSelection}
              onValueChange={handleLocationSelection}
              tintColors={{ true: theme.colors.primary, false: theme.colors.detailText }}
              disabled={isLoadingLocation}
            />
            <View style={styles.locationTextContainer}>
              <View style={styles.locationHeader}>
                <CustomTextNunito weight="SemiBold" style={styles.locationTitle}>
                  {I18n.t(TextKey.uploadAddLocation)}
                </CustomTextNunito>
                {isLoadingLocation && (
                  <CustomTextNunito style={styles.loadingText}>
                    {I18n.locale?.startsWith('es') ? 'Obteniendo...' : 'Getting...'}
                  </CustomTextNunito>
                )}
              </View>
              {checkboxSelection && locationName ? (
                <View style={styles.locationNameContainer}>
                  <CustomTextNunito style={styles.locationName}>
                    📍 {locationName}
                  </CustomTextNunito>
                </View>
              ) : (
                <CustomTextNunito style={styles.locationSubtitle}>
                  {I18n.locale?.startsWith('es') 
                    ? 'Permite que otros sepan dónde estás' 
                    : 'Let others know where you are'}
                </CustomTextNunito>
              )}
            </View>
          </TouchableOpacity>

          {/* Submit Button */}
          <View style={styles.submitContainer}>
            <CustomButton
              title={I18n.t(TextKey.uploadConfirmation)}
              onPress={handleCreatePost}
              locked={selectedMedia.length === 0}
              showLoading={true}
              fullSize={true}
            />
          </View>
        </View>
        
        <FullSizeImage 
          isModalVisible={isModalVisible} 
          uri={currentUri} 
          type={currentType} 
          toggleModal={() => setIsModalVisible(false)} 
        />

        {/* Camera Screen Modal */}
        <Modal
          visible={cameraVisible}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={() => setCameraVisible(false)}
        >
          <CameraScreen
            visible={cameraVisible}
            onClose={() => setCameraVisible(false)}
            onCapture={onCameraCapture}
          />
        </Modal>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const createStyles = (theme, isDarkMode) => StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  headerSection: {
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.detailText,
    marginTop: 6,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 12,
  },
  mediaScroll: {
    marginHorizontal: -20,
  },
  mediaScrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 16,
    alignItems: 'center',
  },
  mediaItemWrapper: {
    position: 'relative',
  },
  mediaItem: {
    position: 'relative',
  },
  mediaThumbnail: {
    width: 110,
    height: 110,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 16,
  },
  playIcon: {
    width: 32,
    height: 32,
    tintColor: '#FFF',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: theme.colors.danger || '#DC2626',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.background,
    zIndex: 10,
  },
  removeButtonText: {
    color: '#FFF',
    fontSize: 18,
    lineHeight: 22,
    textAlign: 'center',
    includeFontPadding: false,
    marginTop: -1,
  },
  addMoreButton: {
    width: 110,
    height: 110,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.border || theme.colors.detailText,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface || theme.colors.card,
  },
  addMoreIcon: {
    fontSize: 32,
    color: theme.colors.primary,
  },
  addMoreText: {
    fontSize: 12,
    color: theme.colors.detailText,
    marginTop: 4,
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadOption: {
    flex: 1,
    backgroundColor: theme.colors.card || theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border || 'transparent',
  },
  uploadIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  googleIcon: {
    width: 24,
    height: 24,
    tintColor: theme.colors.primary,
  },
  uploadOptionTitle: {
    fontSize: 14,
    color: theme.colors.text,
    textAlign: 'center',
  },
  uploadOptionSubtitle: {
    fontSize: 12,
    color: theme.colors.detailText,
    marginTop: 4,
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: theme.colors.card || theme.colors.surface,
    borderRadius: 16,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card || theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.colors.border || 'transparent',
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationTitle: {
    fontSize: 15,
    color: theme.colors.text,
  },
  locationSubtitle: {
    fontSize: 12,
    color: theme.colors.detailText,
    marginTop: 2,
  },
  loadingText: {
    fontSize: 12,
    color: theme.colors.primary,
  },
  locationNameContainer: {
    marginTop: 4,
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  locationName: {
    fontSize: 13,
    color: theme.colors.primary,
  },
  submitContainer: {
    marginTop: 8,
  },
});