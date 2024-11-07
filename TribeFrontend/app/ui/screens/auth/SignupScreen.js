import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import TextKey from 'assets/localization/TextKey';
import I18n from 'assets/localization/i18n';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { registerUser } from 'networking/api/authsApi'; 

const SignupScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [fantasyName, setFantasyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = async () => {
    if (!fantasyName || !email || !password || !confirmPassword) {
      setErrorMessage(I18n.t(TextKey.completeFields));
      return;
    } else if (password !== confirmPassword) {
      setErrorMessage(I18n.t(TextKey.passwordsDontMatch));
      return;
    }
  
    try {
      const registrationData = { nickName: fantasyName, email, password };
      const response = await registerUser(registrationData);
      
      console.log('Registro exitoso:', response);
      Alert.alert('Registro exitoso', 'Se ha enviado un enlace de verificación a tu correo.');
      
      // Limpiar los campos
      setFantasyName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error registrando el usuario:', error);
  
      // Manejo específico de errores (opcional)
      if (error.response && error.response.status === 409) {
        setErrorMessage('Este correo ya está registrado.');
      } else {
        setErrorMessage('Hubo un error al registrar el usuario. Por favor, inténtalo de nuevo.');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={theme.logo} style={styles.logo} resizeMode="contain" />

      <CustomTextNunito style={[styles.title, { color: theme.colors.text }]} weight="Bold">
        {I18n.t(TextKey.signupTitle)}
      </CustomTextNunito>

      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.backgroundSecondary, color: theme.colors.text }]}
        placeholder={I18n.t(TextKey.enterName)}
        placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
        value={fantasyName}
        onChangeText={setFantasyName}
      />

      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.backgroundSecondary, color: theme.colors.text }]}
        placeholder={I18n.t(TextKey.enterEmail)}
        placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.backgroundSecondary, color: theme.colors.text }]}
        placeholder={I18n.t(TextKey.enterPassword)}
        placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.backgroundSecondary, color: theme.colors.text }]}
        placeholder={I18n.t(TextKey.enterConfirmPassword)}
        placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        style={[styles.signupButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleSignup}
      >
        <CustomTextNunito style={styles.signupButtonText} weight="Bold">
          {I18n.t(TextKey.createUserButton)}
        </CustomTextNunito>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <CustomTextNunito style={[styles.loginText, { color: theme.colors.primary }]}>
          {I18n.t(TextKey.logIn)}
        </CustomTextNunito>
      </TouchableOpacity>

      {errorMessage ? <CustomTextNunito style={styles.errorText}>{errorMessage}</CustomTextNunito> : null}
    </ScrollView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 40,
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
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    height: 55,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  signupButton: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  signupButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontFamily: 'Nunito-Bold', 
  },
  loginText: {
    marginTop: 10,
    fontSize: 16,
    alignSelf: 'flex-start',
    color: theme.colors.primary,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default SignupScreen;