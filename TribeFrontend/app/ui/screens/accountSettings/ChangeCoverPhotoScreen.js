import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import CustomButton from 'ui/components/generalPurposeComponents/CustomButton';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import { selectFromGallery } from 'helper/MultimediaHelper';
import { useTheme } from 'context/ThemeContext';
import FullSizeImage from 'ui/components/generalPurposeComponents/FullSizeImage';
import { useUserContext } from 'context/UserContext';
import { editUserProfile } from 'networking/api/usersApi';
import uploadToCloudinary from 'helper/CloudinaryHelper';

const ChangeCoverPhotoScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState([]);
  const [isCoverImageModalVisible, setIsCoverImageModalVisible] = useState(false);
  const [isSelectedImageModalVisible, setIsSelectedImageModalVisible] = useState(false);
  const { theme } = useTheme();
  const { user, setUser } = useUserContext();
  const styles = createStyles(theme);

  const handleSelectImage = async () => {
    selectFromGallery([], setSelectedImage, 'photo', 1);
    console.log('Image selected:', selectedImage);
  };

  const saveChanges = async () => {
    try {
      const url = await uploadToCloudinary(selectedImage[0]?.uri, 'image');
      const profileData = {
        coverImage: url,
      };
  
      const response = await editUserProfile(profileData);
      console.log('Perfil actualizado con éxito:', response);
      setUser(response.user);
      Alert.alert('Éxito', 'Perfil actualizado con éxito.');
      navigation.goBack();
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      Alert.alert('Error', 'Hubo un error al actualizar el perfil. Por favor, inténtelo de nuevo.');
    }
  };

  const toggleCoverImageModal = () => setIsCoverImageModalVisible(!isCoverImageModalVisible);
  const toggleSelectedImageModal = () => setIsSelectedImageModalVisible(!isSelectedImageModalVisible);

  return (
    <>
      <View style={styles.container}>
        <CustomTextNunito weight="Bold" style={styles.title}>
          {I18n.t(TextKey.changeCoverPhoto)}
        </CustomTextNunito>

        <View style={styles.content}>
          {selectedImage[0]?.uri ? (
            <TouchableOpacity onPress={toggleSelectedImageModal} style={{ width: 350, height: 200}}>
              <Image source={{ uri: selectedImage[0]?.uri }} style={{ width: '100%', height: '100%', borderRadius: 10, borderColor: theme.colors.primary, borderWidth: 3 }} />
            </TouchableOpacity>
          ) : user?.coverImage ? (
            <TouchableOpacity onPress={toggleCoverImageModal} style={{ width: 350, height: 200}}>
              <Image source={{ uri: user.coverImage }} style={{ width: '100%', height: '100%', borderRadius: 10, borderColor: theme.colors.primary, borderWidth: 3 }} />
            </TouchableOpacity>
          ) : (
            <CustomTextNunito style={styles.placeholder}>
              {I18n.t(TextKey.noImageSelected)}
            </CustomTextNunito>
          )}
        </View>
        <View style={{ flexDirection: 'column', gap: 12 }}>
          <CustomButton
            title={I18n.t(TextKey.selectImageFromGallery)}
            onPress={handleSelectImage}
            style={styles.button}
          />
          <CustomButton
            title={I18n.t(TextKey.saveButton)}
            onPress={saveChanges}
            showLoading={true}
            style={styles.saveButton}
            locked={!selectedImage[0]?.uri}
          />
        </View>
      </View>
      <FullSizeImage isModalVisible={isCoverImageModalVisible} uri={user.coverImage} toggleModal={toggleCoverImageModal} />
      <FullSizeImage isModalVisible={isSelectedImageModalVisible} uri={selectedImage[0]?.uri} toggleModal={toggleSelectedImageModal} />
    </>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingVertical: 60,
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

export default ChangeCoverPhotoScreen;