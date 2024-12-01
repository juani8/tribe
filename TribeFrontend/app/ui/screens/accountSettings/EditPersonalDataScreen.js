import React from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from 'context/ThemeContext';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { useUserContext } from 'context/UserContext';

const EditPersonalDataScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { user } = useUserContext();

  return (
    <View style={styles.container}>
      {/* Image and buttons */}
      <View style={{ width: '100%', height: 150 }}>
        <TouchableOpacity onPress={() => navigation.navigate('ChangeCoverPhoto')} style={{ width: '100%', height: 150, position: 'absolute' }}>
          <Image source={{ uri: user.coverImage }} style={{ width: '100%', height: 150, resizeMode: 'cover' }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ChangeProfilePicture')} style={{ width: 120, height: 120, position: 'absolute', alignSelf: 'center' }}>
          <Image source={{ uri: user.profileImage }} style={{ width: '100%', height: '100%', borderRadius: 100, borderColor: theme.colors.primary, borderWidth: 3 }} />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ChangeProfilePicture')}
        >
          <CustomTextNunito style={styles.changeText}>
            {I18n.t(TextKey.changeProfilePicture)}
          </CustomTextNunito>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('ChangeCoverPhoto')}
        >
          <CustomTextNunito style={styles.changeText}>
            {I18n.t(TextKey.changeCoverPhoto)}
          </CustomTextNunito>
        </TouchableOpacity>
      </View>

      {/* Nickname */}
      <View style={styles.inputContainer}>
        <CustomTextNunito style={styles.label}>{I18n.t(TextKey.nicknameLabel)}</CustomTextNunito>
        <TextInput
          style={styles.input}
          editable={true}
          placeholder={user.nickName}
          placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
        />
      </View>

      {/* First Name */}
      <View style={styles.inputContainer}>
        <CustomTextNunito style={styles.label}>{I18n.t(TextKey.firstNameLabel)}</CustomTextNunito>
        <TextInput
          style={styles.input}
          editable={true}
          placeholder={user.name}
          placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
        />
      </View>

      {/* Last Name */}
      <View style={styles.inputContainer}>
        <CustomTextNunito style={styles.label}>{I18n.t(TextKey.lastNameLabel)}</CustomTextNunito>
        <TextInput
          style={styles.input}
          editable={true}
          placeholder={user.lastName}
          placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
        />
      </View>

      {/* Description */}
      <View style={styles.inputContainer}>
        <CustomTextNunito style={styles.label}>{I18n.t(TextKey.descriptionLabel)}</CustomTextNunito>
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          editable={true}
          multiline={true}
          placeholder={user.description ? user.description : I18n.t(TextKey.descriptionPlaceholder)}
          placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
        />
      </View>

      {/* Gender */}
      <View style={styles.inputContainer}>
        <CustomTextNunito style={styles.label}>{I18n.t(TextKey.genderLabel)}</CustomTextNunito>
        <Picker
          style={styles.picker}
          onValueChange={(itemValue) => console.log(itemValue)}
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
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: theme.colors.text,
  },
  input: {
    backgroundColor: 'transparent',
    padding: 10,
    fontSize: 16,
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
  },
});


export default EditPersonalDataScreen;



