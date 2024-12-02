import React, { useState } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Full } from 'assets/images';
import { useTheme } from 'context/ThemeContext';
import FullSizeImage from 'ui/components/generalPurposeComponents/FullSizeImage';
import Video from 'react-native-video-controls';

const ContentCarouselListItem = ({ uri, type, index, dataLength }) => {
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control the modal visibility
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { theme } = useTheme();
  const styles = createStyles(theme, dataLength);

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
      <TouchableOpacity onPress={toggleModal}>
        {type === 'image' && (
          <Image source={{ uri }} style={[styles.media]} />
        )}
        {type === 'video' && (
          <>
{/*             <Video
              source={{ uri }}
              style={[styles.media]}
              useNativeControls
              resizeMode="cover"
              paused={true}
              disableBack
              disableFullscreen
              disableVolume
            /> */}
            <Image source={Full} style={{ position: 'absolute', top: 16, right: 20, width: 24, height: 24 }} />
          </>
        )}
      </TouchableOpacity>

      {/* Full Screen Modal */}
      <FullSizeImage isModalVisible={isModalVisible} uri={uri} type={type} toggleModal={toggleModal} />
    </>
  );
};

const createStyles = (theme, dataLength) => StyleSheet.create({
  media: {
    width: dataLength === 1 ? Dimensions.get('window').width - 40 : 250,
    marginRight: 8,
    borderRadius: 20,
    height: 300,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent overlay
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