import React from 'react';
import { View, Image, StyleSheet, Modal, Pressable } from 'react-native';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { FullAlt } from 'assets/images';
import { useTheme } from 'context/ThemeContext';
import { BlurView } from '@react-native-community/blur';
import Video from 'react-native-video-controls';

export default function FullSizeImage({ isModalVisible, uri, type = 'image', toggleModal }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <>
      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
        animationType="fade"
      >
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark" 
          blurAmount={10} 
          reducedTransparencyFallbackColor="rgba(0, 0, 0, 0.6)" 
        />

        {/* Modal Content */}
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {type === 'image' ? (
              <Image source={{ uri }} style={styles.fullScreenMedia} resizeMode="contain" />
            ) : (
              <Video
                source={{ uri }}
                style={styles.fullScreenMedia}
                useNativeControls
                resizeMode="contain" // Ensures horizontal videos display correctly
                disableFullscreen
                disableBack
              />
            )}

            {/* Close Button */}
            <Pressable onPress={toggleModal} style={styles.closeButton}>
              <Image source={FullAlt} style={styles.closeIcon} />
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const createStyles = (theme) => StyleSheet.create({
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
  fullScreenMedia: {
    width: '100%',
    height: '100%', // Maintains aspect ratio for horizontal media
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 14,
    right: 10,
  },
  closeIcon: {
    width: 30,
    height: 30,
  },
});
