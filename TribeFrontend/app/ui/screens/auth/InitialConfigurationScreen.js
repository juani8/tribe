import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Text, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from 'context/ThemeContext';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import TextKey from 'assets/localization/TextKey';
import I18n from 'assets/localization/i18n';
// import { editUserProfile } from 'networking/api/usersApi'; // Uncomment for backend functionality

const InitialConfigurationScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [gender, setGender] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleContinue = async () => {
    if (!name || !surname || !gender) {
      setErrorMessage(I18n.t(TextKey.completeFieldsError));
      return;
    }

    try {
      setErrorMessage('');

      // Uncomment for backend functionality
      // const response = await editUserProfile({ name, lastName: surname, gender });

      // Simulated success
      Alert.alert(I18n.t(TextKey.profileUpdated), I18n.t(TextKey.profileUpdateSuccess));
      navigation.navigate('Main'); // Navigate to main screen
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('There was a problem updating your profile. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={theme.logo} style={styles.logo} resizeMode="contain" />

      <CustomTextNunito style={styles.title} weight="Bold">
  {I18n.t(TextKey.initialConfigTitle)}
</CustomTextNunito>
      <CustomTextNunito style={styles.subtitle} weight="Regular">
        {I18n.t(TextKey.initialConfigSubtitle)}
      </CustomTextNunito>

      <CustomTextNunito style={styles.label} weight="Regular">{I18n.t(TextKey.firstNameLabel)}</CustomTextNunito>
      <TextInput
        style={styles.input}
        placeholder={I18n.t('firstNameLabel')}
        placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
        value={name}
        onChangeText={setName}
      />

      <CustomTextNunito style={styles.label} weight="Regular">{I18n.t(TextKey.lastNameLabel)}</CustomTextNunito>
      <TextInput
        style={styles.input}
        placeholder={I18n.t(TextKey.lastNameLabel)}
        placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
        value={surname}
        onChangeText={setSurname}
      />

      <CustomTextNunito style={styles.label} weight="Regular">{I18n.t(TextKey.genderLabel)}</CustomTextNunito>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={gender}
          style={styles.picker}
          onValueChange={(itemValue) => setGender(itemValue)}
        >
          <Picker.Item label={I18n.t(TextKey.selectGender)} value="" />
          <Picker.Item label={I18n.t(TextKey.genderMale)} value="male" />
          <Picker.Item label={I18n.t(TextKey.genderFemale)} value="female" />
          <Picker.Item label={I18n.t(TextKey.genderNonBinary)} value="non_binary" />
          <Picker.Item label={I18n.t(TextKey.genderOther)} value="other" />
          <Picker.Item label={I18n.t(TextKey.genderPreferNotToSay)} value="prefer_not_to_say" />
        </Picker>
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <CustomTextNunito style={styles.continueButtonText} weight="Bold">{I18n.t(TextKey.continueButton)}</CustomTextNunito>
      </TouchableOpacity>
    </ScrollView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start', 
    paddingHorizontal: 40,
    paddingTop: 100, 
    backgroundColor: theme.colors.background,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 24,
    color: theme.colors.text,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  highlight: {
    color: theme.colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: theme.colors.backgroundSecondary,
    color: theme.colors.text,
    marginBottom: 15,
  },
  pickerContainer: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: theme.colors.backgroundSecondary,
    marginBottom: 15,
    borderColor: theme.colors.placeholder,
    borderWidth: 1,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: '100%',
    color: theme.colors.text,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  continueButton: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    marginBottom: 10,
  },
  continueButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontFamily: 'Nunito-Bold',
  },
});

export default InitialConfigurationScreen;


