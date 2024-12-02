import React, { useState } from 'react';
import { View, ScrollView, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from 'context/ThemeContext';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import CustomButton from 'ui/components/generalPurposeComponents/CustomButton';
import { useUserContext } from 'context/UserContext';
import CustomInputNunito from 'ui/components/generalPurposeComponents/CustomInputNunito';
import {editUserProfile} from 'networking/api/usersApi';

const EditPersonalDataScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { user, setUser } = useUserContext();
  const [descriptionText, setDescriptionText] = useState('');
  const [nickName, setNickName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');

  const saveChanges = async () => {
    try {
      const profileData = {
        name: firstName,
        lastName: lastName,
        description: descriptionText,
        gender: gender,
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

  return (
    <ScrollView style={styles.container}>
      {/* Image and buttons */}
      <View style={{ width: '100%', height: 150 }}>
        <TouchableOpacity onPress={() => navigation.navigate('ChangeCoverPhoto')} style={{ width: '100%', height: 150, position: 'absolute' }}>
          <Image source={{ uri: user.coverImage }} style={{ width: '100%', height: 150, resizeMode: 'cover' }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ChangeProfilePicture')} style={{ width: 120, height: 120, position: 'absolute', alignSelf: 'center', marginTop: 16 }}>
          <Image source={{ uri: user.profileImage }} style={{ width: '100%', height: '100%', borderRadius: 100, borderColor: theme.colors.primary, borderWidth: 3 }} />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginHorizontal: 20, paddingBottom: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 30 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ChangeProfilePicture')}
          >
            <CustomTextNunito style={styles.changeText}>
              {I18n.t(TextKey.changeProfilePictureNavegation)}
            </CustomTextNunito>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('ChangeCoverPhoto')}
          >
            <CustomTextNunito style={styles.changeText}>
              {I18n.t(TextKey.changeCoverPictureNavegation)}
            </CustomTextNunito>
          </TouchableOpacity>
        </View>

        {/* Nickname */}
        <View style={styles.inputContainer}>
          <CustomTextNunito style={styles.label}>{I18n.t(TextKey.nicknameLabel)}</CustomTextNunito>
          {nickName !== '' && <CustomTextNunito style={{ marginBottom: 8}} textColor={theme.colors.primary}>{I18n.t(TextKey.changeText)}</CustomTextNunito>}
          <CustomInputNunito maxLength={20} inputText={nickName} setInputText={setNickName} placeholder={user?.nickName} />
        </View>

        {/* First Name */}
        <View style={styles.inputContainer}>
          <CustomTextNunito style={styles.label}>{I18n.t(TextKey.firstNameLabel)}</CustomTextNunito>
          {firstName !== '' && <CustomTextNunito style={{ marginBottom: 8}} textColor={theme.colors.primary}>{I18n.t(TextKey.changeText)}</CustomTextNunito>}
          <CustomInputNunito maxLength={30} inputText={firstName} setInputText={setFirstName} placeholder={user?.name} />
        </View>

        {/* Last Name */}
        <View style={styles.inputContainer}>
          <CustomTextNunito style={styles.label}>{I18n.t(TextKey.lastNameLabel)}</CustomTextNunito>
          {lastName !== '' && <CustomTextNunito style={{ marginBottom: 8}} textColor={theme.colors.primary}>{I18n.t(TextKey.changeText)}</CustomTextNunito>}
          <CustomInputNunito maxLength={30} inputText={lastName} setInputText={setLastName} placeholder={user?.lastName} />
        </View>

        {/* Description */}
        <View style={styles.inputContainer}>
          <CustomTextNunito style={styles.label}>{I18n.t(TextKey.descriptionLabel)}</CustomTextNunito>        
          {descriptionText !== '' && <CustomTextNunito style={{ marginBottom: 8}} textColor={theme.colors.primary}>{I18n.t(TextKey.changeText)}</CustomTextNunito>}
          <CustomInputNunito  inputText={descriptionText} setInputText={setDescriptionText} placeholder={user.description ? user.description : I18n.t(TextKey.descriptionPlaceholder)} />
        </View>

        {/* Gender */}
        <View style={styles.inputContainer}>
          <CustomTextNunito style={styles.label}>{I18n.t(TextKey.genderLabel)}</CustomTextNunito>
          {gender !== '' && <CustomTextNunito style={{ marginBottom: 8}} textColor={theme.colors.primary}>{I18n.t(TextKey.changeText)}</CustomTextNunito>}
          <View style={{ borderWidth: 1.5, borderColor: theme.colors.detailText, borderRadius: 10 }}>
            <Picker
              style={styles.picker}
              onValueChange={(itemValue) => setGender(itemValue)}
              placeholder={gender}
            >
              <Picker.Item label={I18n.t(TextKey.selectGender)} value="" />
              <Picker.Item label={I18n.t(TextKey.genderMale)} value="male" />
              <Picker.Item label={I18n.t(TextKey.genderFemale)} value="female" />
              <Picker.Item label={I18n.t(TextKey.genderNonBinary)} value="non_binary" />
              <Picker.Item label={I18n.t(TextKey.genderOther)} value="other" />
              <Picker.Item label={I18n.t(TextKey.genderPreferNotToSay)} value="prefer_not_to_say" />
            </Picker>
          </View>
        </View>
        <View style={{ marginVertical: 20 }}>
          <CustomButton
            title={I18n.t(TextKey.saveButton)}
            onPress={saveChanges}
            showLoading={true}
            locked={nickName === '' && firstName === '' && lastName === '' && descriptionText === ''}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: theme.colors.background,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  changeText: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  inputContainer: {
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: theme.colors.text,
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
    marginBottom: -30, // Asegura que el espaciado sea igual al de otros campos
  },
  pickerContainer: {
    marginTop: 5,
    marginBottom: 15,
  },
  picker: {
    color: theme.colors.text,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: theme.colors.detailText,
    borderRadius: 10,
  },
});


export default EditPersonalDataScreen;



