import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import CustomButton from 'ui/components/generalPurposeComponents/CustomButton';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import { selectFromGallery, openCamera } from 'helper/MultimediaHelper';
import { useTheme } from 'context/ThemeContext';
import FullSizeImage from 'ui/components/generalPurposeComponents/FullSizeImage';

const ChangeCoverPhotoScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUri, setCurrentUri] = useState('');

  const handleSelectImage = async () => {
    selectFromGallery(selectedImage, setSelectedImage, 'image');
  };

  const handleOpenCamera = async () => {
    const image = await openCamera();
    if (image) {
      setSelectedImage(image.uri);
    }
  };

  const handleSave = () => {
    if (selectedImage) {
      console.log('Cover photo saved:', selectedImage);
      navigation.goBack();
    }
  };

  const toggleModal = (uri) => {
    setCurrentUri(uri);
    setIsModalVisible(!isModalVisible);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <ScrollView style={[{ backgroundColor: theme?.colors?.background }]}>
        <View style={styles.container}>
          <CustomTextNunito weight="Bold" style={styles.title}>
            {I18n.t(TextKey.changeCoverPhoto)}
          </CustomTextNunito>

          {selectedImage ? (
            <TouchableOpacity onPress={() => toggleModal(selectedImage)}>
              <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
            </TouchableOpacity>
          ) : (
            <CustomTextNunito style={styles.placeholder}>
              {I18n.t(TextKey.noImageSelected)}
            </CustomTextNunito>
          )}

          <CustomButton
            title={I18n.t(TextKey.uploadSelectFromGallery)}
            onPress={handleSelectImage}
            style={styles.button}
          />
          <CustomButton
            title={I18n.t(TextKey.uploadSelectOpenCamera)}
            onPress={handleOpenCamera}
            style={styles.button}
          />
          <CustomButton
            title={I18n.t(TextKey.saveButton)}
            onPress={handleSave}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme?.colors?.background,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: theme?.colors?.text,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  placeholder: {
    fontSize: 16,
    color: theme?.colors?.detailText,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    marginVertical: 10,
  },
  saveButton: {
    marginTop: 20,
  },
});

export default ChangeCoverPhotoScreen;