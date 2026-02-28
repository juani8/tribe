import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Image, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Back from 'assets/images/icons/Back.png';
import BackNight from 'assets/images/iconsNight/Back_night.png';
import { useTheme } from 'context/ThemeContext';
import TextKey from 'assets/localization/TextKey';
import I18n from 'assets/localization/i18n';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito'; 
import { requestPasswordReset } from 'networking/api/authsApi'; 
import CustomButton from 'ui/components/generalPurposeComponents/CustomButton';
import LottieView from 'lottie-react-native';

const RecoverPasswordScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();  
  const styles = createStyles(theme);

  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleVerify = async () => {
    if (!email) {
        setErrorMessage(I18n.t(TextKey.completeFields)); 
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage(I18n.locale?.startsWith('es') 
        ? 'Por favor ingresa un email válido' 
        : 'Please enter a valid email');
      return;
    }

    try {
        const response = await requestPasswordReset(email);
        console.log('Solicitud de restablecimiento enviada:', response);
        
        setEmailSent(true);
        setErrorMessage('');
    } catch (error) {
        console.error('Error solicitando el restablecimiento de contraseña:', error);
        setErrorMessage(I18n.t(TextKey.passwordResetErrorMessage));
    }
  };

  const handleResend = () => {
    setEmailSent(false);
    setEmail('');
  };

  // Success state - email was sent
  if (emailSent) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={isDarkMode ? BackNight : Back} style={styles.backIcon} />
        </TouchableOpacity>

        <View style={styles.successContainer}>
          <LottieView
            source={require('assets/lottie/mailingLottie.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
          
          <CustomTextNunito style={styles.successTitle} weight="Bold">
            {I18n.locale?.startsWith('es') ? '¡Email enviado!' : 'Email sent!'}
          </CustomTextNunito>
          
          <CustomTextNunito style={styles.successSubtitle}>
            {I18n.locale?.startsWith('es') 
              ? `Hemos enviado instrucciones de recuperación a ${email}` 
              : `We've sent recovery instructions to ${email}`}
          </CustomTextNunito>

          <View style={styles.instructionsContainer}>
            <CustomTextNunito style={styles.instructionText}>
              {I18n.locale?.startsWith('es') 
                ? '1. Revisa tu bandeja de entrada' 
                : '1. Check your inbox'}
            </CustomTextNunito>
            <CustomTextNunito style={styles.instructionText}>
              {I18n.locale?.startsWith('es') 
                ? '2. Haz click en el enlace del email' 
                : '2. Click the link in the email'}
            </CustomTextNunito>
            <CustomTextNunito style={styles.instructionText}>
              {I18n.locale?.startsWith('es') 
                ? '3. Crea una nueva contraseña' 
                : '3. Create a new password'}
            </CustomTextNunito>
          </View>

          <CustomTextNunito style={styles.spamNote}>
            {I18n.locale?.startsWith('es') 
              ? '¿No lo encuentras? Revisa tu carpeta de spam' 
              : "Can't find it? Check your spam folder"}
          </CustomTextNunito>

          <View style={styles.actionsContainer}>
            <CustomButton 
              title={I18n.locale?.startsWith('es') ? 'Volver al login' : 'Back to login'} 
              onPress={() => navigation.navigate('Login')} 
              fullSize={true}
            />
            
            <TouchableOpacity style={styles.resendButton} onPress={handleResend}>
              <CustomTextNunito style={styles.resendText}>
                {I18n.locale?.startsWith('es') ? 'Usar otro email' : 'Use different email'}
              </CustomTextNunito>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image source={isDarkMode ? BackNight : Back} style={styles.backIcon} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <Image source={theme.logo} style={styles.logo} resizeMode="contain" />
            </View>
            <CustomTextNunito style={styles.title} weight="Bold">
              {I18n.t(TextKey.recoverPasswordTitle)}
            </CustomTextNunito>
            <CustomTextNunito style={styles.subtitle}>
              {I18n.t(TextKey.recoverPasswordDescription)}
            </CustomTextNunito>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <CustomTextNunito style={styles.labelText} weight="SemiBold">
                {I18n.t(TextKey.emailLabel)}
              </CustomTextNunito>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder={I18n.t(TextKey.emailPlaceholder)}
                  placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errorMessage) setErrorMessage('');
                  }}
                />
              </View>
            </View>

            {errorMessage ? (
              <View style={styles.errorContainer}>
                <CustomTextNunito style={styles.errorText}>{errorMessage}</CustomTextNunito>
              </View>
            ) : null}

            <CustomButton 
              title={I18n.locale?.startsWith('es') ? 'Enviar instrucciones' : 'Send instructions'} 
              onPress={handleVerify} 
              showLoading={true} 
              fullSize={true} 
            />
          </View>

          {/* Footer */}
          <View style={styles.footerContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <CustomTextNunito style={styles.backToLogin}>
                {I18n.locale?.startsWith('es') ? '← Volver al inicio de sesión' : '← Back to login'}
              </CustomTextNunito>
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
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  backIcon: {
    width: 28,
    height: 28,
  },
  headerContainer: {
    marginTop: 40,
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: theme.colors.card || theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 28,
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.detailText,
    marginTop: 8,
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  labelText: {
    fontSize: 14,
    marginBottom: 8,
    color: theme.colors.text,
  },
  inputWrapper: {
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
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },
  footerContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  backToLogin: {
    fontSize: 15,
    color: theme.colors.primary,
  },
  // Success state styles
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  lottie: {
    width: 180,
    height: 180,
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 15,
    color: theme.colors.detailText,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  instructionsContainer: {
    backgroundColor: theme.colors.card || theme.colors.surface || '#F5F5F5',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 16,
  },
  instructionText: {
    fontSize: 15,
    color: theme.colors.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  spamNote: {
    fontSize: 13,
    color: theme.colors.detailText,
    textAlign: 'center',
    marginBottom: 32,
    fontStyle: 'italic',
  },
  actionsContainer: {
    width: '100%',
    gap: 16,
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  resendText: {
    fontSize: 15,
    color: theme.colors.primary,
  },
});

export default RecoverPasswordScreen;
