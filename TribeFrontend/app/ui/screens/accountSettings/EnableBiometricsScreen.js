import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Switch, Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import CustomButton from 'ui/components/generalPurposeComponents/CustomButton';
import { useTheme } from 'context/ThemeContext';
import { useUserContext } from 'context/UserContext';
import I18n from 'assets/localization/i18n';
import LottieView from 'lottie-react-native';

const BIOMETRIC_ENABLED_KEY = '@biometric_enabled';
const BIOMETRIC_USER_KEY = '@biometric_user_email';

// Lottie sources
const LOTTIE_NEUTRAL = require('assets/lottie/biometricNeutral.lottie');
const LOTTIE_SUCCESS = require('assets/lottie/biometricSuccess.lottie');
const LOTTIE_ERROR = require('assets/lottie/biometricError.lottie');

const EnableBiometricsScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const { user } = useUserContext();
  const styles = createStyles(theme);
  const lottieRef = useRef(null);
  
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [biometricType, setBiometricType] = useState(null);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [biometricStatus, setBiometricStatus] = useState('neutral'); // 'neutral', 'success', 'error'

  const rnBiometrics = new ReactNativeBiometrics();

  useEffect(() => {
    checkBiometricSupport();
    loadBiometricSettings();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();
      setIsBiometricSupported(available);
      setBiometricType(biometryType);
    } catch (error) {
      console.error('Error checking biometric support:', error);
      setIsBiometricSupported(false);
    }
  };

  const loadBiometricSettings = async () => {
    try {
      const enabled = await AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY);
      setIsBiometricEnabled(enabled === 'true');
    } catch (error) {
      console.error('Error loading biometric settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBiometricTypeName = () => {
    switch (biometricType) {
      case BiometryTypes.FaceID:
        return 'Face ID';
      case BiometryTypes.TouchID:
        return 'Touch ID';
      case BiometryTypes.Biometrics:
        return I18n.locale?.startsWith('es') ? 'Huella digital' : 'Fingerprint';
      default:
        return I18n.locale?.startsWith('es') ? 'Biometría' : 'Biometrics';
    }
  };

  const showBiometricResult = (status) => {
    setBiometricStatus(status);
    // Reset to neutral after animation completes
    setTimeout(() => {
      setBiometricStatus('neutral');
    }, 4000);
  };

  const handleToggleBiometric = async (value) => {
    if (value) {
      try {
        const { success } = await rnBiometrics.simplePrompt({
          promptMessage: I18n.locale?.startsWith('es') 
            ? 'Confirma tu identidad para habilitar' 
            : 'Confirm your identity to enable',
          cancelButtonText: I18n.locale?.startsWith('es') ? 'Cancelar' : 'Cancel',
        });

        if (success) {
          showBiometricResult('success');
          await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, 'true');
          await AsyncStorage.setItem(BIOMETRIC_USER_KEY, user?.email || '');
          setIsBiometricEnabled(true);
          
          Toast.show({
            type: 'success',
            text1: I18n.locale?.startsWith('es') ? '¡Éxito!' : 'Success!',
            text2: I18n.locale?.startsWith('es') 
              ? `${getBiometricTypeName()} habilitado correctamente` 
              : `${getBiometricTypeName()} enabled successfully`,
            position: 'top',
            visibilityTime: 3000,
          });
        } else {
          showBiometricResult('error');
        }
      } catch (error) {
        console.error('Biometric verification failed:', error);
        showBiometricResult('error');
        Toast.show({
          type: 'error',
          text1: I18n.locale?.startsWith('es') ? 'Error' : 'Error',
          text2: I18n.locale?.startsWith('es') 
            ? 'No se pudo verificar la identidad' 
            : 'Could not verify identity',
          position: 'top',
        });
      }
    } else {
      await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, 'false');
      await AsyncStorage.removeItem(BIOMETRIC_USER_KEY);
      setIsBiometricEnabled(false);
    }
  };

  const testBiometric = async () => {
    try {
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: I18n.locale?.startsWith('es') 
          ? 'Verifica tu identidad' 
          : 'Verify your identity',
        cancelButtonText: I18n.locale?.startsWith('es') ? 'Cancelar' : 'Cancel',
      });

      if (success) {
        showBiometricResult('success');
        Toast.show({
          type: 'success',
          text1: I18n.locale?.startsWith('es') ? '¡Verificado!' : 'Verified!',
          text2: I18n.locale?.startsWith('es') 
            ? 'Tu identidad ha sido confirmada' 
            : 'Your identity has been confirmed',
          position: 'top',
          visibilityTime: 2500,
        });
      } else {
        showBiometricResult('error');
      }
    } catch (error) {
      showBiometricResult('error');
      Toast.show({
        type: 'error',
        text1: I18n.locale?.startsWith('es') ? 'Error' : 'Error',
        text2: I18n.locale?.startsWith('es') 
          ? 'La verificación falló' 
          : 'Verification failed',
        position: 'top',
      });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <CustomTextNunito style={styles.loadingText}>
            {I18n.locale?.startsWith('es') ? 'Cargando...' : 'Loading...'}
          </CustomTextNunito>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Lottie Animation - changes based on biometric result */}
        <View style={styles.iconContainer}>
          <LottieView
            ref={lottieRef}
            source={
              biometricStatus === 'success' ? LOTTIE_SUCCESS :
              biometricStatus === 'error' ? LOTTIE_ERROR :
              LOTTIE_NEUTRAL
            }
            autoPlay
            loop={biometricStatus === 'neutral'}
            style={styles.lottieAnimation}
            key={biometricStatus}
          />
        </View>

        {/* Title & Description */}
        <View style={styles.textContainer}>
          <CustomTextNunito weight="Bold" style={styles.title}>
            {I18n.locale?.startsWith('es') 
              ? 'Autenticación Biométrica' 
              : 'Biometric Authentication'}
          </CustomTextNunito>
          <CustomTextNunito style={styles.description}>
            {I18n.locale?.startsWith('es')
              ? `Usa ${getBiometricTypeName()} para iniciar sesión de forma rápida y segura en tu cuenta.`
              : `Use ${getBiometricTypeName()} to quickly and securely sign in to your account.`}
          </CustomTextNunito>
        </View>

        {/* Biometric Support Status */}
        {!isBiometricSupported ? (
          <View style={styles.warningContainer}>
            <CustomTextNunito weight="SemiBold" style={styles.warningTitle}>
              {I18n.locale?.startsWith('es') 
                ? 'No disponible' 
                : 'Not Available'}
            </CustomTextNunito>
            <CustomTextNunito style={styles.warningText}>
              {I18n.locale?.startsWith('es')
                ? 'Tu dispositivo no soporta autenticación biométrica o no está configurada.'
                : 'Your device does not support biometric authentication or it is not configured.'}
            </CustomTextNunito>
          </View>
        ) : (
          <>
            {/* Toggle Card */}
            <View style={styles.settingCard}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <CustomTextNunito weight="SemiBold" style={styles.settingTitle}>
                    {I18n.locale?.startsWith('es') 
                      ? `Habilitar ${getBiometricTypeName()}` 
                      : `Enable ${getBiometricTypeName()}`}
                  </CustomTextNunito>
                  <CustomTextNunito style={styles.settingDescription}>
                    {I18n.locale?.startsWith('es')
                      ? 'Inicia sesión con tu biometría'
                      : 'Sign in with your biometrics'}
                  </CustomTextNunito>
                </View>
                <Switch
                  value={isBiometricEnabled}
                  onValueChange={handleToggleBiometric}
                  trackColor={{ 
                    false: theme.colors.border || '#E5E5E5', 
                    true: theme.colors.primary + '80' 
                  }}
                  thumbColor={isBiometricEnabled ? theme.colors.primary : '#f4f3f4'}
                />
              </View>
            </View>

            {/* Account Info */}
            {isBiometricEnabled && (
              <View style={styles.accountCard}>
                <CustomTextNunito style={styles.accountLabel}>
                  {I18n.locale?.startsWith('es') 
                    ? 'Cuenta vinculada:' 
                    : 'Linked account:'}
                </CustomTextNunito>
                <CustomTextNunito weight="SemiBold" style={styles.accountEmail}>
                  {user?.email}
                </CustomTextNunito>
              </View>
            )}

            {/* Test Button */}
            {isBiometricEnabled && (
              <View style={styles.testButtonContainer}>
                <CustomButton
                  title={I18n.locale?.startsWith('es') 
                    ? 'Probar autenticación' 
                    : 'Test authentication'}
                  onPress={testBiometric}
                  variant="outline"
                  fullSize
                />
              </View>
            )}
          </>
        )}
      </View>

      {/* Security Info */}
      <View style={styles.securityInfo}>
        <CustomTextNunito style={styles.securityText}>
          {I18n.locale?.startsWith('es')
            ? 'Tu información biométrica se almacena de forma segura en tu dispositivo y nunca se comparte.'
            : 'Your biometric information is stored securely on your device and is never shared.'}
        </CustomTextNunito>
      </View>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: theme.colors.detailText,
    fontSize: 16,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  lottieAnimation: {
    width: 150,
    height: 150,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    color: theme.colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: theme.colors.detailText,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  warningContainer: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  warningTitle: {
    fontSize: 16,
    color: '#92400E',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#92400E',
    textAlign: 'center',
    lineHeight: 20,
  },
  settingCard: {
    backgroundColor: theme.colors.card || theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border || 'transparent',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: theme.colors.detailText,
  },
  accountCard: {
    backgroundColor: theme.colors.primary + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  accountLabel: {
    fontSize: 12,
    color: theme.colors.detailText,
    marginBottom: 4,
  },
  accountEmail: {
    fontSize: 15,
    color: theme.colors.text,
  },
  testButtonContainer: {
    marginTop: 8,
  },
  securityInfo: {
    padding: 24,
    paddingTop: 0,
  },
  securityText: {
    fontSize: 13,
    color: theme.colors.detailText,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default EnableBiometricsScreen;