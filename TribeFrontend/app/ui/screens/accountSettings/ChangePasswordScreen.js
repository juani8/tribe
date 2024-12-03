import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import CustomButton from 'ui/components/generalPurposeComponents/CustomButton';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import { useTheme } from 'context/ThemeContext';

const ChangePasswordScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordFirstChar, setNewPasswordFirstChar] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleNewPasswordChange = (text) => {
    if (text.length === 0) {
      setNewPassword('');
      setNewPasswordFirstChar(null);
    } else if (text.length === 1 && newPasswordFirstChar === null) {
      setNewPasswordFirstChar(text[0]);
      setNewPassword(text);
    } else if (newPasswordFirstChar !== null) {
      const updatedPassword = newPasswordFirstChar + text.slice(1);
      setNewPassword(updatedPassword);
    }
  };

  const handlePasswordChange = () => {
    console.log('Current:', currentPassword);
    console.log('New:', newPassword);
    console.log('Confirm:', confirmPassword);
    if (!currentPassword || !newPassword || !confirmPassword) {
      console.warn('All fields are required.');
    } else if (newPassword !== confirmPassword) {
      console.warn('New password and confirm password do not match.');
    } else {
      console.log('Password change successful.');
    }
  };

  return (
    <View style={styles.container}>
      <CustomTextNunito weight="Bold" style={styles.title}>
        {I18n.t(TextKey.changePasswordTitle)}
      </CustomTextNunito>

      <View style={styles.inputContainer}>
        <CustomTextNunito style={styles.label}>
          {I18n.t(TextKey.currentPasswordLabel)}
        </CustomTextNunito>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder={I18n.t(TextKey.currentPasswordPlaceholder)}
          placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
      </View>

      <View style={styles.inputContainer}>
        <CustomTextNunito style={styles.label}>
          {I18n.t(TextKey.newPasswordLabel)}
        </CustomTextNunito>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder={I18n.t(TextKey.newPasswordPlaceholder)}
          placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
          value={newPassword}
          onChangeText={handleNewPasswordChange}
        />
      </View>

      <View style={styles.inputContainer}>
        <CustomTextNunito style={styles.label}>
          {I18n.t(TextKey.confirmPasswordLabel)}
        </CustomTextNunito>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder={I18n.t(TextKey.confirmPasswordPlaceholder)}
          placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <CustomButton
        title={I18n.t(TextKey.confirmButton)}
        onPress={handlePasswordChange}
        style={styles.confirmButton}
      />
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: theme.colors.text,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: theme.colors.text,
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: theme.colors.text,
  },
  confirmButton: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: theme.colors.primary,
  },
});

export default ChangePasswordScreen;

