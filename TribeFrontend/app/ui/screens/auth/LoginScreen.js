import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import TextKey from 'assets/localization/TextKey';
import I18n from 'assets/localization/i18n';
import { loginUser, loginUserWithGoogle, validateTokenAndGetUser } from 'networking/api/authsApi';
import { storeToken, getToken } from 'helper/JWTHelper';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import CustomButton from 'ui/components/generalPurposeComponents/CustomButton';
import Toast from 'react-native-toast-message';
import { useUserContext } from 'context/UserContext';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FingerprintGoogle, Visibility, VisibilityOff } from 'assets/images';
import axios from 'axios';

const { width } = Dimensions.get('window');
const BIOMETRIC_ENABLED_KEY = '@biometric_enabled';
const BIOMETRIC_USER_KEY = '@biometric_user_email';
const SERVER_URL = 'http://localhost:8080';

const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { setUser } = useUserContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordFirstChar, setPasswordFirstChar] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState(null);
  const [savedUserEmail, setSavedUserEmail] = useState(null);
  const [serverStatus, setServerStatus] = useState('checking');
  const [showPassword, setShowPassword] = useState(false);

  const rnBiometrics = new ReactNativeBiometrics();

  useEffect(() => {
    checkBiometricAvailability();
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkServerStatus = async () => {
    try {
      await axios.get(SERVER_URL, { timeout: 5000 });
      setServerStatus('online');
    } catch (error) {
      setServerStatus('offline');
    }
  };

  const checkBiometricAvailability = async () => {
    try {
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();
      const biometricEnabled = await AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY);
      const userEmail = await AsyncStorage.getItem(BIOMETRIC_USER_KEY);
      
      if (available && biometricEnabled === 'true' && userEmail) {
        setBiometricAvailable(true);
        setBiometricType(biometryType);
        setSavedUserEmail(userEmail);
      }
    } catch (error) {
      console.error('Error checking biometric:', error);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: I18n.locale?.startsWith('es') ? 'Confirma tu identidad' : 'Confirm your identity',
        cancelButtonText: I18n.locale?.startsWith('es') ? 'Cancelar' : 'Cancel',
      });

      if (success) {
        const token = await getToken();
        if (token) {
          // Validar token y obtener datos del usuario
          const { valid, user: userData } = await validateTokenAndGetUser();
          if (valid && userData) {
            setUser(userData);
            Toast.show({
              type: 'success',
              text1: I18n.locale?.startsWith('es') ? '¡Bienvenido!' : 'Welcome!',
              text2: I18n.locale?.startsWith('es') ? 'Sesión iniciada correctamente' : 'Logged in successfully',
              position: 'top',
              visibilityTime: 2000,
            });
            setTimeout(() => {
              navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
            }, 1200);
          } else {
            Toast.show({
              type: 'error',
              text1: I18n.locale?.startsWith('es') ? 'Sesión expirada' : 'Session expired',
              text2: I18n.locale?.startsWith('es') ? 'Por favor ingresa tu contraseña nuevamente' : 'Please enter your password again',
              position: 'top',
              visibilityTime: 4000,
            });
            if (savedUserEmail) setEmail(savedUserEmail);
          }
        } else {
          Toast.show({
            type: 'error',
            text1: I18n.locale?.startsWith('es') ? 'Sesión expirada' : 'Session expired',
            text2: I18n.locale?.startsWith('es') ? 'Por favor ingresa tu contraseña nuevamente' : 'Please enter your password again',
            position: 'top',
            visibilityTime: 4000,
          });
          if (savedUserEmail) setEmail(savedUserEmail);
        }
      }
    } catch (error) {
      console.error('Biometric login failed:', error);
      Toast.show({
        type: 'error',
        text1: I18n.locale?.startsWith('es') ? 'Error' : 'Error',
        text2: I18n.locale?.startsWith('es') ? 'No se pudo verificar la identidad' : 'Could not verify identity',
        position: 'top',
      });
    }
  };

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

  GoogleSignin.configure({
    webClientId: '336048572805-8v9bm9sej7jhkgv4hv1cmigkda5tj01o.apps.googleusercontent.com',
    offlineAccess: true,
  });

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage(I18n.t(TextKey.completeFields));
      return;
    }

    try {
      const loginData = { email, password };
      console.log('[LoginScreen] Login payload:', loginData);
      const response = await loginUser(loginData);
      setUser(response.user);
      await storeToken(response.token);

      Toast.show({
        type: 'success',
        text1: I18n.locale?.startsWith('es') ? '¡Bienvenido!' : 'Welcome!',
        text2: I18n.locale?.startsWith('es') ? 'Sesión iniciada correctamente' : 'Logged in successfully',
        position: 'top',
        visibilityTime: 2000,
      });
      setTimeout(() => {
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      }, 1200);
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
      if (response.user) setUser(response.user);
      if (response.token) await storeToken(response.token);

      Toast.show({
        type: 'success',
        text1: I18n.locale?.startsWith('es') ? '¡Bienvenido!' : 'Welcome!',
        text2: I18n.locale?.startsWith('es') ? 'Sesión con Google iniciada' : 'Logged in with Google',
        position: 'top',
        visibilityTime: 2000,
      });
      setTimeout(() => {
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      }, 1200);
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
    <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Server Status Indicator */}
      <TouchableOpacity style={styles.serverStatusContainer} onPress={checkServerStatus} activeOpacity={0.7}>
        {serverStatus === 'checking' ? (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        ) : (
          <View style={[styles.serverStatusDot, { backgroundColor: serverStatus === 'online' ? '#22c55e' : '#ef4444' }]} />
        )}
        <CustomTextNunito style={styles.serverStatusText}>
          {serverStatus === 'checking' 
            ? (I18n.locale?.startsWith('es') ? 'Verificando...' : 'Checking...')
            : serverStatus === 'online'
              ? (I18n.locale?.startsWith('es') ? 'Servidor conectado' : 'Server connected')
              : (I18n.locale?.startsWith('es') ? 'Servidor desconectado' : 'Server disconnected')}
        </CustomTextNunito>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          {/* Header con logo */}
          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <Image source={theme.logo} style={styles.logo} resizeMode="contain" />
            </View>
            <Text style={styles.welcomeText}>{I18n.t(TextKey.loginTitle)}</Text>
            <Text style={styles.loginMessage}>{I18n.t(TextKey.loginMessage)}</Text>
          </View>

          {/* Formulario */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.labelText}>{I18n.t(TextKey.emailLabel)}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder={I18n.t(TextKey.emailPlaceholder)}
                  placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.labelText}>{I18n.t(TextKey.passwordLabel)}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.inputWithIcon}
                  placeholder={I18n.t(TextKey.passwordPlaceholder)}
                  placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={handlePasswordChange}
                />
                <TouchableOpacity 
                  style={styles.visibilityButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Image 
                    source={showPassword ? VisibilityOff : Visibility} 
                    style={styles.visibilityIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {errorMessage ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            <CustomButton title={I18n.t(TextKey.loginButton)} onPress={handleLogin} showLoading={true} />

            {/* Biometric Login Button */}
            {biometricAvailable && (
              <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricLogin} activeOpacity={0.7}>
                <Image source={FingerprintGoogle} style={styles.biometricIcon} />
                <CustomTextNunito weight="SemiBold" style={styles.biometricText}>
                  {I18n.locale?.startsWith('es') 
                    ? `Acceder con ${biometricType === BiometryTypes.FaceID ? 'Face ID' : 'huella digital'}` 
                    : `Login with ${biometricType === BiometryTypes.FaceID ? 'Face ID' : 'fingerprint'}`}
                </CustomTextNunito>
              </TouchableOpacity>
            )}

            {/* Links */}
            <View style={styles.linksContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('RecoverPassword')} style={styles.linkButton}>
                <Text style={styles.linkText}>{I18n.t(TextKey.goToRecoverPassword)}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Separador */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.orText}>{I18n.t(TextKey.gmailLogin)}</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Botón Google */}
          <TouchableOpacity style={styles.gmailButton} onPress={handleGoogleSignIn} activeOpacity={0.8}>
            <Image source={{ uri: 'https://www.google.com/favicon.ico' }} style={styles.googleIcon} />
            <CustomTextNunito weight="SemiBold" style={styles.gmailButtonText}>
              {I18n.t(TextKey.gmailButton)}
            </CustomTextNunito>
          </TouchableOpacity>

          {/* Footer - Signup */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              {I18n.locale?.startsWith('es') ? '¿No tienes cuenta?' : "Don't have an account?"}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}> {I18n.t(TextKey.goToSignup)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  serverStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.card || theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border || '#E5E5E5',
  },
  serverStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  serverStatusText: {
    fontSize: 12,
    color: theme.colors.detailText,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: theme.colors.background,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 70,
    height: 70,
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    color: theme.colors.text,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  loginMessage: {
    fontSize: 14,
    color: theme.colors.detailText || (theme.isDark ? '#FFF' : '#666'),
    marginTop: 4,
    fontFamily: 'Nunito-Regular',
    lineHeight: 20,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 14,
  },
  labelText: {
    fontSize: 14,
    marginBottom: 8,
    color: theme.colors.text,
    fontFamily: 'Nunito-SemiBold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card || theme.colors.surface || '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border || 'transparent',
  },
  input: {
    width: '100%',
    height: 52,
    paddingHorizontal: 16,
    fontSize: 16,
    color: theme.colors.text,
    fontFamily: 'Nunito-Regular',
  },
  inputWithIcon: {
    flex: 1,
    height: 52,
    paddingHorizontal: 16,
    fontSize: 16,
    color: theme.colors.text,
    fontFamily: 'Nunito-Regular',
  },
  visibilityButton: {
    padding: 12,
  },
  visibilityIcon: {
    width: 22,
    height: 22,
    tintColor: theme.colors.detailText || '#666',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    textAlign: 'center',
  },
  linksContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  linkButton: {
    paddingVertical: 8,
  },
  linkText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontFamily: 'Nunito-SemiBold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border || '#E5E5E5',
  },
  orText: {
    fontSize: 14,
    color: theme.colors.detailText || (theme.isDark ? '#FFF' : '#666'),
    marginHorizontal: 16,
    fontFamily: 'Nunito-Regular',
  },
  gmailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card || theme.colors.surface || '#FFF',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border || '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  gmailButtonText: {
    color: theme.colors.text,
    fontSize: 16,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: theme.colors.detailText || '#666',
    fontFamily: 'Nunito-Regular',
  },
  signupLink: {
    fontSize: 14,
    color: theme.colors.primary,
    fontFamily: 'Nunito-Bold',
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary + '10',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  biometricIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: theme.colors.primary,
  },
  biometricText: {
    color: theme.colors.primary,
    fontSize: 15,
  },
});

export default LoginScreen;







