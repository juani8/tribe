import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from 'context/ThemeContext';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import CustomButton from 'ui/components/generalPurposeComponents/CustomButton';
import { useUserContext } from 'context/UserContext';
import CustomInputNunito from 'ui/components/generalPurposeComponents/CustomInputNunito';
import { editUserProfile } from 'networking/api/usersApi';
import Toast from 'react-native-toast-message';
import { CameraGoogle as Camera, UserFill as User } from 'assets/images';

const EditPersonalDataScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { user, setUser } = useUserContext();
  const [descriptionText, setDescriptionText] = useState('');
  const [nickName, setNickName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const changes = nickName !== '' || firstName !== '' || lastName !== '' || descriptionText !== '' || gender !== '';
    setHasChanges(changes);
  }, [nickName, firstName, lastName, descriptionText, gender]);

  const saveChanges = async () => {
    if (saving) return;
    setSaving(true);
    
    try {
      const profileData = {
        name: firstName || undefined,
        lastName: lastName || undefined,
        description: descriptionText || undefined,
        gender: gender || undefined,
      };
  
      // Filtrar campos vacíos
      Object.keys(profileData).forEach(key => {
        if (profileData[key] === undefined) delete profileData[key];
      });

      const response = await editUserProfile(profileData);
      console.log('Perfil actualizado con éxito:', response);
      setUser(response.user);
      
      Toast.show({
        type: 'success',
        text1: I18n.locale?.startsWith('es') ? '¡Perfil actualizado!' : 'Profile updated!',
        text2: I18n.locale?.startsWith('es') ? 'Los cambios se han guardado correctamente' : 'Changes saved successfully',
        position: 'top',
        visibilityTime: 3000,
      });
      
      setTimeout(() => navigation.goBack(), 1500);
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      Toast.show({
        type: 'error',
        text1: I18n.locale?.startsWith('es') ? 'Error' : 'Error',
        text2: I18n.locale?.startsWith('es') ? 'No se pudo actualizar el perfil' : 'Could not update profile',
        position: 'top',
      });
    } finally {
      setSaving(false);
    }
  };

  const renderSection = (title, children, icon) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        {icon && <Image source={icon} style={styles.sectionIcon} />}
        <CustomTextNunito weight="Bold" style={styles.sectionTitle}>
          {title}
        </CustomTextNunito>
      </View>
      {children}
    </View>
  );

  const renderInput = (label, value, setValue, placeholder, maxLength = 50, multiline = false) => (
    <View style={styles.inputWrapper}>
      <View style={styles.inputLabelRow}>
        <CustomTextNunito weight="SemiBold" style={styles.inputLabel}>
          {label}
        </CustomTextNunito>
        {value !== '' && (
          <View style={styles.changeBadge}>
            <CustomTextNunito weight="Bold" style={styles.changeBadgeText}>
              {I18n.t(TextKey.changeText)}
            </CustomTextNunito>
          </View>
        )}
      </View>
      <CustomInputNunito 
        maxLength={maxLength} 
        inputText={value} 
        setInputText={setValue} 
        placeholder={placeholder}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={{ opacity: fadeAnim }}>
        {/* Sección de imágenes de perfil */}
        <View style={styles.imagesContainer}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('ChangeCoverPhoto')} 
            style={styles.coverImageTouchable}
            activeOpacity={0.8}
          >
            {user.coverImage ? (
              <Image source={{ uri: user.coverImage }} style={styles.coverImage} />
            ) : (
              <View style={[styles.coverImage, styles.coverPlaceholder]}>
                <CustomTextNunito style={styles.coverPlaceholderText}>
                  {I18n.locale?.startsWith('es') ? 'Añadir portada' : 'Add cover'}
                </CustomTextNunito>
              </View>
            )}
            <View style={styles.editBadgeCover}>
              <Image source={Camera} style={styles.cameraIcon} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => navigation.navigate('ChangeProfilePicture')} 
            style={styles.profileImageTouchable}
            activeOpacity={0.8}
          >
            <Image source={{ uri: user.profileImage }} style={styles.profileImageStyle} />
            <View style={styles.editBadgeProfile}>
              <Image source={Camera} style={styles.cameraIconSmall} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Links para cambiar fotos */}
        <View style={styles.photoLinksContainer}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('ChangeProfilePicture')}
            style={styles.photoLinkButton}
          >
            <CustomTextNunito weight="SemiBold" style={styles.photoLinkText}>
              {I18n.t(TextKey.changeProfilePictureNavegation)}
            </CustomTextNunito>
          </TouchableOpacity>
          <View style={styles.linkDivider} />
          <TouchableOpacity 
            onPress={() => navigation.navigate('ChangeCoverPhoto')}
            style={styles.photoLinkButton}
          >
            <CustomTextNunito weight="SemiBold" style={styles.photoLinkText}>
              {I18n.t(TextKey.changeCoverPictureNavegation)}
            </CustomTextNunito>
          </TouchableOpacity>
        </View>

        {/* Sección de información personal */}
        {renderSection(
          I18n.locale?.startsWith('es') ? 'Información Personal' : 'Personal Information',
          <>
            {renderInput(I18n.t(TextKey.nicknameLabel), nickName, setNickName, user?.nickName, 20)}
            {renderInput(I18n.t(TextKey.firstNameLabel), firstName, setFirstName, user?.name, 30)}
            {renderInput(I18n.t(TextKey.lastNameLabel), lastName, setLastName, user?.lastName, 30)}
          </>,
          User
        )}

        {/* Sección de biografía */}
        {renderSection(
          I18n.locale?.startsWith('es') ? 'Sobre ti' : 'About you',
          <>
            {renderInput(
              I18n.t(TextKey.descriptionLabel), 
              descriptionText, 
              setDescriptionText, 
              user.description || I18n.t(TextKey.descriptionPlaceholder),
              200,
              true
            )}
          </>
        )}

        {/* Sección de género */}
        {renderSection(
          I18n.locale?.startsWith('es') ? 'Identidad' : 'Identity',
          <View style={styles.inputWrapper}>
            <View style={styles.inputLabelRow}>
              <CustomTextNunito weight="SemiBold" style={styles.inputLabel}>
                {I18n.t(TextKey.genderLabel)}
              </CustomTextNunito>
              {gender !== '' && (
                <View style={styles.changeBadge}>
                  <CustomTextNunito weight="Bold" style={styles.changeBadgeText}>
                    {I18n.t(TextKey.changeText)}
                  </CustomTextNunito>
                </View>
              )}
            </View>
            <View style={styles.pickerWrapper}>
              <Picker
                style={styles.picker}
                selectedValue={gender}
                onValueChange={(itemValue) => setGender(itemValue)}
                dropdownIconColor={theme.colors.text}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item style={styles.pickerItem} label={I18n.t(TextKey.selectGender)} value="" />
                <Picker.Item style={styles.pickerItem} label={I18n.t(TextKey.genderMale)} value="male" />
                <Picker.Item style={styles.pickerItem} label={I18n.t(TextKey.genderFemale)} value="female" />
                <Picker.Item style={styles.pickerItem} label={I18n.t(TextKey.genderNonBinary)} value="non_binary" />
                <Picker.Item style={styles.pickerItem} label={I18n.t(TextKey.genderOther)} value="other" />
                <Picker.Item style={styles.pickerItem} label={I18n.t(TextKey.genderPreferNotToSay)} value="prefer_not_to_say" />
              </Picker>
            </View>
          </View>
        )}

        {/* Botón guardar */}
        <View style={styles.saveButtonContainer}>
          {hasChanges && (
            <CustomTextNunito style={styles.unsavedChangesText}>
              {I18n.locale?.startsWith('es') ? '⚠️ Tienes cambios sin guardar' : '⚠️ You have unsaved changes'}
            </CustomTextNunito>
          )}
          <CustomButton
            title={saving 
              ? (I18n.locale?.startsWith('es') ? 'Guardando...' : 'Saving...') 
              : I18n.t(TextKey.saveButton)
            }
            onPress={saveChanges}
            showLoading={saving}
            locked={!hasChanges || saving}
          />
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  imagesContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
    marginBottom: 60,
  },
  coverImageTouchable: {
    width: '100%',
    height: 180,
    position: 'absolute',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverPlaceholder: {
    backgroundColor: theme.colors.primary + '30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverPlaceholderText: {
    color: theme.colors.primary,
    fontSize: 14,
    opacity: 0.8,
  },
  editBadgeCover: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  editBadgeProfile: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: theme.colors.primary,
    borderRadius: 15,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  cameraIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFF',
  },
  cameraIconSmall: {
    width: 16,
    height: 16,
    tintColor: '#FFF',
  },
  profileImageTouchable: {
    width: 120,
    height: 120,
    position: 'absolute',
    alignSelf: 'center',
    bottom: -50,
  },
  profileImageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    borderColor: theme.colors.background,
    borderWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  photoLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 20,
  },
  photoLinkButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  photoLinkText: {
    color: theme.colors.primary,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  linkDivider: {
    width: 1,
    height: 16,
    backgroundColor: theme.colors.detailText,
    opacity: 0.3,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: theme.colors.card || theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.detailText + '20',
  },
  sectionIcon: {
    width: 20,
    height: 20,
    tintColor: theme.colors.primary,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 16,
    color: theme.colors.text,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: theme.colors.text,
    opacity: 0.9,
  },
  changeBadge: {
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeBadgeText: {
    fontSize: 11,
    color: theme.colors.primary,
  },
  pickerWrapper: {
    borderWidth: 1.5,
    borderColor: theme.colors.detailText + '50',
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    overflow: 'hidden',
  },
  picker: {
    color: theme.colors.text,
    backgroundColor: 'transparent',
    fontFamily: 'Nunito-Regular',
  },
  pickerItem: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
  },
  saveButtonContainer: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 40,
  },
  unsavedChangesText: {
    textAlign: 'center',
    color: theme.colors.warning || '#FFA500',
    fontSize: 13,
    marginBottom: 12,
  },
});


export default EditPersonalDataScreen;



