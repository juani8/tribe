import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import CustomButton from 'ui/components/generalPurposeComponents/CustomButton';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import { selectFromGallery } from 'helper/MultimediaHelper';
import { useTheme } from 'context/ThemeContext';

const ChangeProfilePhotoScreen = ({ navigation, route }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleSelectImage = async () => {
    const image = await selectFromGallery();
    if (image) {
      setSelectedImage(image.uri);
    }
  };

  const handleSave = () => {
    if (selectedImage) {
      console.log('Image saved:', selectedImage);
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <CustomTextNunito weight="Bold" style={styles.title}>
        {I18n.t(TextKey.changeProfilePicture)}
      </CustomTextNunito>

      <View style={styles.content}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
        ) : (
          <CustomTextNunito style={styles.placeholder}>
            {I18n.t(TextKey.noImageSelected)}
          </CustomTextNunito>
        )}
        <TouchableOpacity onPress={handleSelectImage}>
          <CustomTextNunito style={styles.link}>
            {I18n.t(TextKey.selectImageFromGallery)}
          </CustomTextNunito>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          title={I18n.t(TextKey.saveButton)}
          onPress={handleSave}
          style={styles.saveButton}
        />
      </View>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    color: theme.colors.primary,
    textAlign: 'center',
    marginVertical: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  placeholder: {
    fontSize: 16,
    color: theme.colors.detailText,
    textAlign: 'center',
    marginBottom: 20,
  },
  link: {
    fontSize: 16,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 50, 
  },
  saveButton: {
    width: '100%', 
    alignSelf: 'center',
  },
});

export default ChangeProfilePhotoScreen;






