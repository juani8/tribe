import React, { useState } from 'react';
import { View, TextInput, ScrollView, StyleSheet, Image, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import TextKey from 'assets/localization/TextKey';
import I18n from 'assets/localization/i18n';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import CustomButton from 'ui/components/generalPurposeComponents/CustomButton';
import { sendTotp } from 'networking/api/authsApi';
import { storeToken } from 'helper/JWTHelper';
import { navigateToVerifyIdentityRegister } from 'helper/navigationHandlers/AuthNavigationHandlers';

const SignupScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = async () => {
    if (!email) {
      setErrorMessage(I18n.t(TextKey.completeFields));
      return;
    }

    try {
      await sendTotp({ email });
      navigateToVerifyIdentityRegister(navigation, email);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage(I18n.t(TextKey.userAlreadyExists));
      } else {
        setErrorMessage(I18n.t(TextKey.genericSignupError));
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Image source={theme.logo} style={styles.logo} resizeMode="contain" />
          </View>

          <CustomTextNunito style={styles.title} weight="Bold">
            {I18n.t(TextKey.signupTitle)}
          </CustomTextNunito>
          
          <CustomTextNunito style={styles.subtitle}>
            {I18n.locale?.startsWith('es') 
              ? 'Crea una cuenta para empezar a compartir' 
              : 'Create an account to start sharing'}
          </CustomTextNunito>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <CustomTextNunito style={styles.labelText} weight="SemiBold">
              {I18n.t(TextKey.emailLabel) || 'Email'}
            </CustomTextNunito>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder={I18n.t(TextKey.enterEmail)}
                placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {errorMessage ? (
            <View style={styles.errorContainer}>
              <CustomTextNunito style={styles.errorText}>{errorMessage}</CustomTextNunito>
            </View>
          ) : null}

          <CustomButton
            title={I18n.t(TextKey.createUserButton)}
            onPress={handleSignup}
            showLoading={true}
            fullSize={true}
          />
        </View>

        <View style={styles.footerSection}>
          <CustomTextNunito style={styles.footerText}>
            {I18n.locale?.startsWith('es') ? '¿Ya tienes cuenta?' : 'Already have an account?'}
          </CustomTextNunito>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <CustomTextNunito style={styles.loginLink} weight="Bold">
              {' '}{I18n.t(TextKey.logIn)}
            </CustomTextNunito>
          </TouchableOpacity>
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
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerSection: {
    marginBottom: 40,
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
  formSection: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
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
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: theme.colors.detailText,
  },
  loginLink: {
    fontSize: 14,
    color: theme.colors.primary,
  },
});

export default SignupScreen;
