import React from 'react';
import { View, Image, StyleSheet, Modal, Pressable } from 'react-native';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { useTheme } from 'context/ThemeContext';
import { BlurView } from '@react-native-community/blur';

export default function FullSizeImage({ isModalVisible, uri, toggleModal }) {
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
          {/* Full-screen image */}
          <View style={styles.modalContent}>
            <Image source={{ uri }} style={styles.fullScreenImage} />

            {/* Close Button */}
            <Pressable onPress={toggleModal} style={styles.closeButton}>
              <CustomTextNunito style={styles.closeButtonText}>x</CustomTextNunito>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const createStyles = (theme) => StyleSheet.create({
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