import React, { useState } from 'react';
import { View, Image, StyleSheet, Dimensions, Modal, TouchableOpacity, Text, Pressable } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import { BlurView } from '@react-native-community/blur';

const ContentCarouselListItem = ({ uri, index, dataLength, multimedia }) => {
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control the modal visibility
  const { theme } = useTheme();
  const styles = createStyles(theme,dataLength);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <>
      {/* Main Image */}
      <TouchableOpacity onPress={toggleModal}>
        <Image source={{ uri }} style={[styles.image]} />
      </TouchableOpacity>

      {/* Full Screen Modal */}
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
              <Text style={styles.closeButtonText}>x</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

const createStyles = (theme,dataLength) => StyleSheet.create({
  image: {
    width: dataLength == 1 ? Dimensions.get('window').width-40 : 250,
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
