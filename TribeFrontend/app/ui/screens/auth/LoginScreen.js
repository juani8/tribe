import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import TextKey from 'assets/localization/TextKey';
import I18n from 'assets/localization/i18n';
import { loginUser } from 'networking/api/authsApi';
import { storeToken } from 'helper/JWTHelper'; 
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import CustomButton from 'ui/components/generalPurposeComponents/CustomButton';
import { useUserContext } from 'context/UserContext';
import { TouchableOpacity } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { setUser } = useUserContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage(I18n.t(TextKey.completeFields));
      return;
    }

    try {
      setIsLoading(true); 
      const loginData = { email, password };
      const response = await loginUser(loginData);
      setUser(response.user);
      // Guarda el token usando Keychain
      await storeToken(response.token);
      
      Alert.alert(
        'Inicio de sesión exitoso.',
        'Has iniciado sesión correctamente.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Main'),
          },
        ],
        { cancelable: false }
      );


    } catch (error) {
      console.error('Error en el inicio de sesión:', error);

      if (error.response) {
        if (error.response.status === 401) {
            setErrorMessage(I18n.t(TextKey.invalidPassword)); 
        } else if (error.response.status === 403) {
          setErrorMessage(I18n.t(TextKey.verifyEmailMessage));
        } else {
          setErrorMessage(I18n.t(TextKey.loginErrorMessage));
        }
      } else {
        setErrorMessage(I18n.t(TextKey.loginErrorMessage));
      }
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <View style={styles.container}>
      <Image source={theme.logo} style={styles.logo} resizeMode="contain" />

      <Text style={styles.welcomeText}>{I18n.t(TextKey.loginTitle)}</Text>
      <Text style={styles.loginMessage}>{I18n.t(TextKey.loginMessage)}</Text>

      <View style={styles.inputContainer}>
        <Text style={[styles.labelText, { color: theme.colors.text }]}>{I18n.t(TextKey.emailLabel)}</Text>
        <TextInput
          style={[styles.input, { color: theme.colors.text }]}
          placeholder={I18n.t(TextKey.emailPlaceholder)}
          placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.labelText, { color: theme.colors.text }]}>{I18n.t(TextKey.passwordLabel)}</Text>
        <TextInput
          style={[styles.input, { color: theme.colors.text }]}
          placeholder={I18n.t(TextKey.passwordPlaceholder)}
          placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {isLoading && <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />}

      <CustomButton
        title={I18n.t(TextKey.loginButton)}
        onPress={handleLogin}
        showLoading={isLoading}
        locked={isLoading}
      />

      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('RecoverPassword')}>
          <Text style={[styles.linkText, { color: theme.colors.primary }]}>{I18n.t(TextKey.goToRecoverPassword)}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={[styles.linkText, { color: theme.colors.primary, marginTop: 5 }]}>{I18n.t(TextKey.goToSignup)}</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.orText, { color: theme.colors.text }]}>{I18n.t(TextKey.gmailLogin)}</Text>

      <TouchableOpacity style={styles.gmailButton}>
        <CustomTextNunito style={styles.gmailButtonText}>
          {I18n.t(TextKey.gmailButton)}
        </CustomTextNunito>
      </TouchableOpacity>
    </View>
  );
};
const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
    alignSelf: 'flex-start',
  },
  welcomeText: {
    fontSize: 24,
    color: theme.colors.text,
    marginBottom: 20,
    alignSelf: 'flex-start',
    fontFamily: 'Nunito-Bold',
  },
  loginMessage: {
    fontSize: 16,
    color: theme.isDark ? '#FFF' : '#A9A9A9',
    marginBottom: 20,
    alignSelf: 'flex-start',
    fontFamily: 'Nunito-Regular',
  },
  inputContainer: {
    width: '85%',
    marginBottom: 15,
  },
  labelText: {
    fontSize: 16,
    marginBottom: 5,
    color: theme.colors.text,
    alignSelf: 'flex-start',
    fontFamily: 'Nunito-Regular',
  },
  input: {
    width: '100%',
    height: 55,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  loader: {
    marginBottom: 15, // Espaciado entre el loader y el botón
  },
  linksContainer: {
    alignItems: 'flex-start',
    width: '85%',
    marginTop: 10,
  },
  linkText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontFamily: 'Nunito-Regular',
  },
  orText: {
    fontSize: 16,
    color: theme.isDark ? '#FFF' : '#A9A9A9',
    marginTop: 10,
    alignSelf: 'center', 
    fontFamily: 'Nunito-Regular',
  },
  gmailButton: {
    marginTop: 10,
  },
  gmailButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
    fontFamily: 'Nunito-Regular',
  },
});

export default LoginScreen;







