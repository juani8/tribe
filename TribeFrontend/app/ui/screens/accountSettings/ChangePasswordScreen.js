import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Image } from 'react-native';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import CustomButton from 'ui/components/generalPurposeComponents/CustomButton';
import Toast from 'ui/components/generalPurposeComponents/Toast';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import { useTheme } from 'context/ThemeContext';
import { changeUserPassword } from 'networking/api/usersApi';
import { Visibility, VisibilityOff, Lock } from 'assets/images';

const ChangePasswordScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  // Validación de fortaleza de contraseña
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '#ccc' };
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    if (strength <= 2) return { strength: 1, label: I18n.locale?.startsWith('es') ? 'Débil' : 'Weak', color: '#ef4444' };
    if (strength <= 4) return { strength: 2, label: I18n.locale?.startsWith('es') ? 'Media' : 'Medium', color: '#f59e0b' };
    return { strength: 3, label: I18n.locale?.startsWith('es') ? 'Fuerte' : 'Strong', color: '#22c55e' };
  };

  const passwordStrength = getPasswordStrength(newPassword);
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const passwordsDontMatch = newPassword && confirmPassword && newPassword !== confirmPassword;

  const validateForm = () => {
    if (!currentPassword) {
      setToast({ visible: true, message: I18n.locale?.startsWith('es') ? 'Ingresa tu contraseña actual' : 'Enter your current password', type: 'error' });
      return false;
    }
    if (!newPassword) {
      setToast({ visible: true, message: I18n.locale?.startsWith('es') ? 'Ingresa una nueva contraseña' : 'Enter a new password', type: 'error' });
      return false;
    }
    if (newPassword.length < 8) {
      setToast({ visible: true, message: I18n.locale?.startsWith('es') ? 'La contraseña debe tener al menos 8 caracteres' : 'Password must be at least 8 characters', type: 'error' });
      return false;
    }
    if (newPassword !== confirmPassword) {
      setToast({ visible: true, message: I18n.locale?.startsWith('es') ? 'Las contraseñas no coinciden' : 'Passwords do not match', type: 'error' });
      return false;
    }
    if (currentPassword === newPassword) {
      setToast({ visible: true, message: I18n.locale?.startsWith('es') ? 'La nueva contraseña debe ser diferente' : 'New password must be different', type: 'error' });
      return false;
    }
    return true;
  };

  const handlePasswordChange = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await changeUserPassword({
        currentPassword,
        newPassword,
      });

      setToast({ 
        visible: true, 
        message: I18n.locale?.startsWith('es') ? '¡Contraseña actualizada!' : 'Password updated!', 
        type: 'success' 
      });

      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error) {
      console.error('Error changing password:', error);
      let errorMessage = I18n.locale?.startsWith('es') ? 'Error al cambiar la contraseña' : 'Error changing password';
      
      if (error.response?.status === 401) {
        errorMessage = I18n.locale?.startsWith('es') ? 'Contraseña actual incorrecta' : 'Current password is incorrect';
      } else if (error.response?.status === 400) {
        errorMessage = I18n.locale?.startsWith('es') ? 'La nueva contraseña no cumple los requisitos' : 'New password does not meet requirements';
      }
      
      setToast({ visible: true, message: errorMessage, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderPasswordInput = (label, value, setValue, showPassword, setShowPassword, placeholder) => (
    <View style={styles.inputContainer}>
      <CustomTextNunito weight="SemiBold" style={styles.label}>
        {label}
      </CustomTextNunito>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          secureTextEntry={!showPassword}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
          value={value}
          onChangeText={setValue}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity 
          style={styles.eyeButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Image 
            source={showPassword ? VisibilityOff : Visibility} 
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

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
          {/* Header */}
          <View style={styles.headerSection}>
            <View style={styles.iconContainer}>
              <Image source={Lock} style={styles.lockIcon} />
            </View>
            <CustomTextNunito weight="Bold" style={styles.title}>
              {I18n.t(TextKey.changePasswordTitle)}
            </CustomTextNunito>
            <CustomTextNunito style={styles.subtitle}>
              {I18n.locale?.startsWith('es') 
                ? 'Asegúrate de usar una contraseña segura que no uses en otros sitios'
                : 'Make sure to use a secure password that you don\'t use on other sites'}
            </CustomTextNunito>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            {renderPasswordInput(
              I18n.t(TextKey.currentPasswordLabel),
              currentPassword,
              setCurrentPassword,
              showCurrentPassword,
              setShowCurrentPassword,
              I18n.t(TextKey.currentPasswordPlaceholder)
            )}

            {renderPasswordInput(
              I18n.t(TextKey.newPasswordLabel),
              newPassword,
              setNewPassword,
              showNewPassword,
              setShowNewPassword,
              I18n.t(TextKey.newPasswordPlaceholder)
            )}

            {/* Password strength indicator */}
            {newPassword.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBars}>
                  {[1, 2, 3].map((level) => (
                    <View 
                      key={level}
                      style={[
                        styles.strengthBar,
                        { backgroundColor: level <= passwordStrength.strength ? passwordStrength.color : theme.colors.border || '#E0E0E0' }
                      ]}
                    />
                  ))}
                </View>
                <CustomTextNunito style={[styles.strengthLabel, { color: passwordStrength.color }]}>
                  {passwordStrength.label}
                </CustomTextNunito>
              </View>
            )}

            {/* Password requirements */}
            <View style={styles.requirementsContainer}>
              <CustomTextNunito style={styles.requirementsTitle}>
                {I18n.locale?.startsWith('es') ? 'Requisitos:' : 'Requirements:'}
              </CustomTextNunito>
              <View style={styles.requirementRow}>
                <CustomTextNunito style={[styles.requirementText, newPassword.length >= 8 && styles.requirementMet]}>
                  {newPassword.length >= 8 ? '✓' : '○'} {I18n.locale?.startsWith('es') ? 'Mínimo 8 caracteres' : 'At least 8 characters'}
                </CustomTextNunito>
              </View>
              <View style={styles.requirementRow}>
                <CustomTextNunito style={[styles.requirementText, /[A-Z]/.test(newPassword) && styles.requirementMet]}>
                  {/[A-Z]/.test(newPassword) ? '✓' : '○'} {I18n.locale?.startsWith('es') ? 'Una mayúscula' : 'One uppercase letter'}
                </CustomTextNunito>
              </View>
              <View style={styles.requirementRow}>
                <CustomTextNunito style={[styles.requirementText, /[0-9]/.test(newPassword) && styles.requirementMet]}>
                  {/[0-9]/.test(newPassword) ? '✓' : '○'} {I18n.locale?.startsWith('es') ? 'Un número' : 'One number'}
                </CustomTextNunito>
              </View>
            </View>

            {renderPasswordInput(
              I18n.t(TextKey.confirmPasswordLabel),
              confirmPassword,
              setConfirmPassword,
              showConfirmPassword,
              setShowConfirmPassword,
              I18n.t(TextKey.confirmPasswordPlaceholder)
            )}

            {/* Match indicator */}
            {confirmPassword.length > 0 && (
              <View style={styles.matchContainer}>
                <CustomTextNunito style={[
                  styles.matchText,
                  { color: passwordsMatch ? '#22c55e' : '#ef4444' }
                ]}>
                  {passwordsMatch 
                    ? (I18n.locale?.startsWith('es') ? '✓ Las contraseñas coinciden' : '✓ Passwords match')
                    : (I18n.locale?.startsWith('es') ? '✕ Las contraseñas no coinciden' : '✕ Passwords do not match')}
                </CustomTextNunito>
              </View>
            )}
          </View>

          {/* Submit Button */}
          <View style={styles.buttonSection}>
            <CustomButton
              title={isLoading 
                ? (I18n.locale?.startsWith('es') ? 'Actualizando...' : 'Updating...') 
                : I18n.t(TextKey.confirmButton)}
              onPress={handlePasswordChange}
              disabled={isLoading || !currentPassword || !newPassword || !confirmPassword || passwordsDontMatch}
              style={[
                styles.confirmButton,
                (isLoading || !currentPassword || !newPassword || !confirmPassword || passwordsDontMatch) && styles.buttonDisabled
              ]}
            />
          </View>
        </View>
      </ScrollView>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        position="top"
        onHide={() => setToast({ ...toast, visible: false })}
      />
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
    padding: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  lockIcon: {
    width: 36,
    height: 36,
    tintColor: theme.colors.primary,
  },
  title: {
    fontSize: 24,
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.detailText,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  formSection: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: theme.colors.text,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card || theme.colors.surface,
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
  eyeButton: {
    padding: 12,
  },
  eyeIcon: {
    width: 22,
    height: 22,
    tintColor: theme.colors.detailText || '#666',
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -12,
    marginBottom: 16,
  },
  strengthBars: {
    flexDirection: 'row',
    flex: 1,
    gap: 4,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 12,
    marginLeft: 12,
    fontWeight: '600',
  },
  requirementsContainer: {
    backgroundColor: theme.colors.card || theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  requirementsTitle: {
    fontSize: 13,
    color: theme.colors.detailText,
    marginBottom: 8,
  },
  requirementRow: {
    marginVertical: 4,
  },
  requirementText: {
    fontSize: 13,
    color: theme.colors.detailText,
  },
  requirementMet: {
    color: '#22c55e',
  },
  matchContainer: {
    marginTop: -12,
    marginBottom: 8,
  },
  matchText: {
    fontSize: 13,
  },
  buttonSection: {
    marginTop: 'auto',
    paddingBottom: 20,
  },
  confirmButton: {
    height: 52,
    borderRadius: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default ChangePasswordScreen;

