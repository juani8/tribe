import React, { useState } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Full } from 'assets/images';
import { useTheme } from 'context/ThemeContext';
import FullSizeImage from 'ui/components/generalPurposeComponents/FullSizeImage';
import Video from 'react-native-video-controls';

const { width } = Dimensions.get('window');

const ContentCarouselListItem = ({ 
  uri, 
  type, 
  index, 
  dataLength,
  itemWidth,
  cornerRadius = 28  // M3 default
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  
  // Use provided width or calculate based on data length
  const mediaWidth = itemWidth || (dataLength === 1 ? width - 32 : width * 0.82);
  const mediaHeight = dataLength === 1 ? 350 : 300;
  const styles = createStyles(theme, mediaWidth, mediaHeight, cornerRadius);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleEnterFullScreen = () => {
    setIsFullScreen(true);
    setIsModalVisible(true);
  };

  const handleExitFullScreen = () => {
    setIsFullScreen(false);
    setIsModalVisible(false);
  };


  return (
    <>
      {/* Main Media */}
      <TouchableOpacity 
        onPress={toggleModal} 
        activeOpacity={0.95}
        style={styles.mediaContainer}
      >
        {type === 'image' && (
          <View>
            {isLoading && (
              <View style={[styles.media, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={theme.colors.primary || '#6366f1'} />
              </View>
            )}
            <Image 
              source={{ uri }} 
              style={[styles.media, isLoading && { position: 'absolute' }]} 
              resizeMode="cover"
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
            />
          </View>
        )}
        {type === 'video' && (
          <View style={styles.videoContainer}>
            <Video
              source={{ uri }}
              style={[styles.media]}
              useNativeControls
              resizeMode="cover"
              paused={true}
              disableBack
              disableFullscreen
              disableVolume
            />
            <TouchableOpacity style={styles.fullscreenButton} onPress={handleEnterFullScreen}>
              <Image source={Full} style={styles.fullscreenIcon} />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>

      {/* Full Screen Modal */}
      <FullSizeImage isModalVisible={isModalVisible} uri={uri} type={type} toggleModal={toggleModal} />
    </>
  );
};

const createStyles = (theme, mediaWidth, mediaHeight, cornerRadius) => StyleSheet.create({
  mediaContainer: {
    borderRadius: cornerRadius,
    overflow: 'hidden',
    // M3 elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  media: {
    width: mediaWidth,
    height: mediaHeight,
    borderRadius: cornerRadius,
    backgroundColor: theme.colors.surface || theme.colors.background,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface || theme.colors.card,
  },
  videoContainer: {
    position: 'relative',
  },
  fullscreenButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  fullscreenIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: theme.colors.primary,
    borderRadius: 100,
    paddingHorizontal: 5,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.background,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 3,
  },
});

export default ContentCarouselListItem;