import React, { useState, useMemo } from 'react';
import { View, TextInput, ScrollView, StyleSheet, Image, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import TextKey from 'assets/localization/TextKey';
import I18n from 'assets/localization/i18n';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import CustomButton from 'ui/components/generalPurposeComponents/CustomButton';
import { registerUser } from 'networking/api/authsApi';
import { storeToken } from 'helper/JWTHelper';
import { useRoute } from '@react-navigation/native';
import { navigateToInitialConfiguration } from 'helper/navigationHandlers/AuthNavigationHandlers';
import { useUserContext } from 'context/UserContext';
import { Visibility, VisibilityOff } from 'assets/images';

const SignupScreenSecondPart = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const route = useRoute();
  const { setUser } = useUserContext();

  const [fantasyName, setFantasyName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: '#E5E5E5' };
    
    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    Object.values(checks).forEach(check => { if (check) score++; });

    if (score <= 2) return { score, label: I18n.locale?.startsWith('es') ? 'Débil' : 'Weak', color: '#EF4444' };
    if (score <= 3) return { score, label: I18n.locale?.startsWith('es') ? 'Regular' : 'Fair', color: '#F59E0B' };
    if (score <= 4) return { score, label: I18n.locale?.startsWith('es') ? 'Buena' : 'Good', color: '#10B981' };
    return { score, label: I18n.locale?.startsWith('es') ? 'Excelente' : 'Excellent', color: '#059669' };
  }, [password]);

  const handleSignup = async () => {
    if (!fantasyName || !password || !confirmPassword) {
      setErrorMessage(I18n.t(TextKey.completeFields));
      return;
    } else if (password !== confirmPassword) {
      setErrorMessage(I18n.t(TextKey.passwordsDontMatch));
      return;
    } else if (passwordStrength.score < 3) {
      setErrorMessage(I18n.locale?.startsWith('es') 
        ? 'La contraseña debe ser más segura' 
        : 'Password must be stronger');
      return;
    }

    try {
      const registrationData = {
        nickName: fantasyName,
        email: route.params?.email,
        password,
      };

      const response = await registerUser(registrationData);
      console.log(response);
      if (response.token) {
        await storeToken(response.token);
      }
      if (response.user) {
        setUser(response.user);
      }
      navigateToInitialConfiguration(navigation);
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
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Image source={theme.logo} style={styles.logo} resizeMode="contain" />
          </View>

          <CustomTextNunito style={styles.title} weight="Bold">
            {I18n.locale?.startsWith('es') ? 'Completa tu perfil' : 'Complete your profile'}
          </CustomTextNunito>
          
          <CustomTextNunito style={styles.subtitle}>
            {I18n.locale?.startsWith('es') 
              ? 'Solo unos datos más para crear tu cuenta' 
              : 'Just a few more details to create your account'}
          </CustomTextNunito>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Nickname Input */}
          <View style={styles.inputContainer}>
            <CustomTextNunito style={styles.labelText} weight="SemiBold">
              {I18n.locale?.startsWith('es') ? 'Nombre de usuario' : 'Username'}
            </CustomTextNunito>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder={I18n.t(TextKey.enterName)}
                placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
                value={fantasyName}
                onChangeText={setFantasyName}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <CustomTextNunito style={styles.labelText} weight="SemiBold">
              {I18n.locale?.startsWith('es') ? 'Contraseña' : 'Password'}
            </CustomTextNunito>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.inputWithIcon}
                placeholder={I18n.t(TextKey.enterPassword)}
                placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
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
            
            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBarBackground}>
                  <View 
                    style={[
                      styles.strengthBarFill, 
                      { 
                        width: `${(passwordStrength.score / 5) * 100}%`,
                        backgroundColor: passwordStrength.color 
                      }
                    ]} 
                  />
                </View>
                <CustomTextNunito 
                  style={[styles.strengthLabel, { color: passwordStrength.color }]}
                  weight="SemiBold"
                >
                  {passwordStrength.label}
                </CustomTextNunito>
              </View>
            )}

            {/* Password Requirements */}
            <View style={styles.requirementsContainer}>
              <CustomTextNunito style={styles.requirementText}>
                {I18n.locale?.startsWith('es') 
                  ? '• Mínimo 8 caracteres, mayúscula, número y símbolo' 
                  : '• Min 8 chars, uppercase, number & symbol'}
              </CustomTextNunito>
            </View>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <CustomTextNunito style={styles.labelText} weight="SemiBold">
              {I18n.locale?.startsWith('es') ? 'Confirmar contraseña' : 'Confirm Password'}
            </CustomTextNunito>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.inputWithIcon}
                placeholder={I18n.t(TextKey.enterConfirmPassword)}
                placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity 
                style={styles.visibilityButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Image 
                  source={showConfirmPassword ? VisibilityOff : Visibility} 
                  style={styles.visibilityIcon} 
                />
              </TouchableOpacity>
            </View>
            
            {/* Password Match Indicator */}
            {confirmPassword.length > 0 && (
              <View style={styles.matchContainer}>
                <CustomTextNunito 
                  style={[
                    styles.matchText, 
                    { color: password === confirmPassword ? '#10B981' : '#EF4444' }
                  ]}
                  weight="SemiBold"
                >
                  {password === confirmPassword 
                    ? (I18n.locale?.startsWith('es') ? '✓ Las contraseñas coinciden' : '✓ Passwords match')
                    : (I18n.locale?.startsWith('es') ? '✗ Las contraseñas no coinciden' : '✗ Passwords don\'t match')}
                </CustomTextNunito>
              </View>
            )}
          </View>

          {/* Error Message */}
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <CustomTextNunito style={styles.errorText}>{errorMessage}</CustomTextNunito>
            </View>
          ) : null}

          {/* Submit Button */}
          <CustomButton 
            title={I18n.t(TextKey.createUserButton)} 
            onPress={handleSignup} 
            showLoading={true}
            fullSize={true}
          />
        </View>

        {/* Footer Section */}
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
  formSection: {
    flex: 1,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card || theme.colors.surface || '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border || 'transparent',
  },
  input: {
    flex: 1,
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
    paddingRight: 50,
    fontSize: 16,
    color: theme.colors.text,
    fontFamily: 'Nunito-Regular',
  },
  visibilityButton: {
    position: 'absolute',
    right: 12,
    padding: 8,
  },
  visibilityIcon: {
    width: 24,
    height: 24,
    tintColor: theme.colors.detailText || '#888',
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 10,
  },
  strengthBarBackground: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 12,
    minWidth: 70,
    textAlign: 'right',
  },
  requirementsContainer: {
    marginTop: 6,
  },
  requirementText: {
    fontSize: 12,
    color: theme.colors.detailText || '#888',
  },
  matchContainer: {
    marginTop: 6,
  },
  matchText: {
    fontSize: 12,
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

export default SignupScreenSecondPart;
