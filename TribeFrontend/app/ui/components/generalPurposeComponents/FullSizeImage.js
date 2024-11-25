import React from 'react';
import { View, Image, StyleSheet, Modal, Pressable } from 'react-native';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { FullAlt } from 'assets/images';
import { useTheme } from 'context/ThemeContext';
import { BlurView } from '@react-native-community/blur';
import Video from 'react-native-video-controls';

export default function FullSizeImage({ isModalVisible, uri, type, toggleModal }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <>
      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal} // Handle back button press on Android
        animationType="fade" // You can also use "slide" or other animations
      >
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"  // You can adjust the blur effect ("light", "dark", etc.)
          blurAmount={10}  // The intensity of the blur
          reducedTransparencyFallbackColor="rgba(0, 0, 0, 0.6)"  // Fallback color
        />

        {/* Modal Content */}
        <View style={styles.modalContainer}>
          {/* Full-screen media */}
          <View style={styles.modalContent}>
            {type === 'image' ? (
              <Image source={{ uri }} style={styles.fullScreenImage} />
            ) : (
              <Video
                source={{ uri }}
                style={styles.fullScreenVideo}
                useNativeControls
                resizeMode="contain"
                disableFullscreen
                disableBack
              />
            )}

            {/* Close Button */}
            <Pressable onPress={toggleModal} style={{ position: 'absolute', top: 14, right: 10 }}>
              <Image source={FullAlt} style={{ width: 30, height: 30 }} />
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
  fullScreenImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  fullScreenVideo: {
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