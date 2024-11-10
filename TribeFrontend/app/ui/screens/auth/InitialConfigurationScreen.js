import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ScrollView, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { storeToken } from 'helper/JWTHelper'; 
import { Picker } from '@react-native-picker/picker';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import { useTheme } from 'context/ThemeContext';

const InitialConfigurationScreen = ({ navigation }) => {
  const route = useRoute();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { token } = route.params || {};  // Extrae el token de los parámetros de la ruta

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [gender, setGender] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (token) {
      // Llama a la función para verificar el token
      verifyToken(token);
    } else {
      Alert.alert('Error', 'Token no encontrado en el enlace.');
      navigation.navigate('Login'); // Redirige al login si no hay token
    }
  }, [token]);

  const verifyToken = async (token) => {
    try {
      console.log('Verificando token:', token);

      // Supongamos que haces la llamada al backend para verificar el token
      // const response = await axios.post(`${BASE_URL}/auths/verifyMagicLink`, { token });

      // Si la verificación es exitosa, guarda el token en Keychain
      await storeToken(token);

      // Notifica al usuario que la verificación fue exitosa
      Alert.alert('Verificación exitosa', 'Tu cuenta ha sido verificada y estás autenticado.');
      navigation.navigate('Main'); // Navega a la pantalla principal o realiza el setup inicial
    } catch (error) {
      console.error('Error verificando el token:', error);
      Alert.alert('Error', 'Hubo un problema al verificar tu cuenta.');
      navigation.navigate('Login'); // Redirige al login en caso de error
    }
  };

  const handleContinue = () => {
    // proceso para completar la configuración inicial si es necesario
    Alert.alert('Continuar', 'Se han guardado tus preferencias.');
    navigation.navigate('Main');
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




