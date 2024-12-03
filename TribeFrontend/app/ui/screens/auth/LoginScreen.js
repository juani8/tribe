import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import TextKey from 'assets/localization/TextKey';
import I18n from 'assets/localization/i18n';
import { loginUser, loginUserWithGoogle } from 'networking/api/authsApi';
import { storeToken } from 'helper/JWTHelper';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import CustomButton from 'ui/components/generalPurposeComponents/CustomButton';
import { useUserContext } from 'context/UserContext';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { setUser } = useUserContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordFirstChar, setPasswordFirstChar] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePasswordChange = (text) => {
    if (text.length === 0) {
      setPassword('');
      setPasswordFirstChar(null);
    } else if (text.length === 1 && passwordFirstChar === null) {
      setPasswordFirstChar(text[0]);
      setPassword(text);
    } else if (passwordFirstChar !== null) {
      const updatedPassword = passwordFirstChar + text.slice(1);
      setPassword(updatedPassword);
    }
  };

  // Configurar Google Sign-In
  GoogleSignin.configure({
    webClientId: '336048572805-8v9bm9sej7jhkgv4hv1cmigkda5tj01o.apps.googleusercontent.com', // Client ID de Google
    offlineAccess: true,
  });

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage(I18n.t(TextKey.completeFields));
      return;
    }

    try {
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
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.idToken;

      const response = await loginUserWithGoogle({ tokenId: idToken });
      if (response.user) {
        setUser(response.user);
      }
      if (response.token) {
        // Guarda el token usando Keychain
        await storeToken(response.token);
      }

      Alert.alert(
        'Inicio de sesión exitoso con Google.',
        response.message,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Main'),
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error en Google Sign-In:', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Cancelado', 'El inicio de sesión con Google fue cancelado.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('En progreso', 'El inicio de sesión con Google está en progreso.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Google Play Services no está disponible.');
      } else {
        Alert.alert('Error', 'No se pudo iniciar sesión con Google.');
      }
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
        <View style={{ marginBottom: 20 }}>
        <Text style={[styles.labelText, { color: theme.colors.text }]}>{I18n.t(TextKey.passwordLabel)}</Text>
        <TextInput
          style={[styles.input, { color: theme.colors.text }]}
          placeholder={I18n.t(TextKey.passwordPlaceholder)}
          placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
          secureTextEntry
          value={password}
          onChangeText={handlePasswordChange}
        />
      
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      </View>
        <CustomButton title={I18n.t(TextKey.loginButton)} onPress={handleLogin} showLoading={true} />
      </View>

      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('RecoverPassword')}>
          <Text style={[styles.linkText, { color: theme.colors.primary }]}>{I18n.t(TextKey.goToRecoverPassword)}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={[styles.linkText, { color: theme.colors.primary, marginTop: 5 }]}>{I18n.t(TextKey.goToSignup)}</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.orText, { color: theme.colors.text }]}>{I18n.t(TextKey.gmailLogin)}</Text>

      <TouchableOpacity style={styles.gmailButton} onPress={handleGoogleSignIn}>
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







