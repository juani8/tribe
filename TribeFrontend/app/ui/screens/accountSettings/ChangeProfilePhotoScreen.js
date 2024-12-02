import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import CustomButton from 'ui/components/generalPurposeComponents/CustomButton';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import { selectFromGallery } from 'helper/MultimediaHelper';
import { useTheme } from 'context/ThemeContext';

const ChangeProfilePhotoScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState([]);
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleSelectImage = async () => {
    selectFromGallery([], setSelectedImage, 'image', 1);
    console.log('Image selected:', selectedImage);
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
        {selectedImage.lenght !== 0 ? (
          <Image source={{ uri: selectedImage[0]?.uri }} style={styles.imagePreview} />
        ) : ( 
          <CustomTextNunito style={styles.placeholder}>
            {I18n.t(TextKey.noImageSelected)}
          </CustomTextNunito>
        )}
      </View>

      <CustomButton
        title={I18n.t(TextKey.selectImageFromGallery)}
        onPress={handleSelectImage}
        style={styles.button}
      />
      <CustomButton
        title={I18n.t(TextKey.saveButton)}
        onPress={handleSave}
        style={styles.saveButton}
      />
    </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 100,
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

export default ChangeProfilePhotoScreen;