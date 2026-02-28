import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ScrollView, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { storeToken } from 'helper/JWTHelper'; 
import CustomPicker from 'ui/components/generalPurposeComponents/CustomPicker';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import { useTheme } from 'context/ThemeContext';
import { editUserProfile } from 'networking/api/usersApi';
import CustomButton from 'ui/components/generalPurposeComponents/CustomButton';
import { useUserContext } from 'context/UserContext';

const InitialConfigurationScreen = ({ navigation }) => {
  const route = useRoute();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [gender, setGender] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useUserContext();

  const handleContinue = async () => {
    if (!name || !surname || !gender) {
      setErrorMessage(I18n.t(TextKey.completeFieldsError));
      return;
    }

    try {
      setLoading(true);
      const response = await editUserProfile({ name, lastName: surname, gender });
      setUser(response.user);
      
      Alert.alert('Continuar', 'Se han guardado tus preferencias.');
      navigation.navigate('Main');
    } catch (error) {
      console.error('Error al actualizar el perfil del usuario:', error);
      setErrorMessage('Hubo un error al guardar tus preferencias. Inténtalo de nuevo.');
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
      <CustomPicker
        selectedValue={gender}
        onValueChange={(itemValue) => setGender(itemValue)}
        placeholder={I18n.t(TextKey.selectGender)}
        items={[
          { label: I18n.t(TextKey.genderMale), value: 'male' },
          { label: I18n.t(TextKey.genderFemale), value: 'female' },
          { label: I18n.t(TextKey.genderNonBinary), value: 'non_binary' },
          { label: I18n.t(TextKey.genderOther), value: 'other' },
          { label: I18n.t(TextKey.genderPreferNotToSay), value: 'prefer_not_to_say' },
        ]}
      />

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <CustomButton title={I18n.t(TextKey.continueButton)} onPress={handleContinue} showLoading={true} />
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
    color: theme.colors.text,
    marginBottom: 15,
  },
  pickerContainer: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
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