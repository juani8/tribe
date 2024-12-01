import React, { useState } from 'react';
import { View, TextInput, ScrollView, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
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

  const [fantasyName, setFantasyName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!fantasyName || !email) {
      setErrorMessage(I18n.t(TextKey.completeFields));
      return;
    }

    try {
      await sendTotp({ email });
      setIsLoading(true); 
      navigateToVerifyIdentityRegister(navigation, fantasyName, email);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage(I18n.t(TextKey.userAlreadyExists));
      } else {
        setErrorMessage(I18n.t(TextKey.genericSignupError));
      }
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={theme.logo} style={styles.logo} resizeMode="contain" />

      <CustomTextNunito style={[styles.title, { color: theme.colors.text }]} weight="Bold">
        {I18n.t(TextKey.signupTitle)}
      </CustomTextNunito>

      <TextInput
        style={[styles.input, { color: theme.colors.text }]}
        placeholder={I18n.t(TextKey.enterName)}
        placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
        value={fantasyName}
        onChangeText={setFantasyName}
      />

      <TextInput
        style={[styles.input, { color: theme.colors.text }]}
        placeholder={I18n.t(TextKey.enterEmail)}
        placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {isLoading && <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />}

      <CustomButton
        title={I18n.t(TextKey.createUserButton)}
        onPress={handleSignup}
        showLoading={isLoading}
        locked={isLoading}
      />

      <CustomTextNunito
        style={[styles.loginText, { color: theme.colors.primary }]}
        onPress={() => navigation.navigate('Login')}
      >
        {I18n.t(TextKey.logIn)}
      </CustomTextNunito>

      {errorMessage ? <CustomTextNunito style={styles.errorText}>{errorMessage}</CustomTextNunito> : null}
    </ScrollView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
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
    // borderWidth: 1,
    // borderColor: theme.colors.primary,
  },
  loader: {
    marginBottom: 15, 
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  loginText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SignupScreen;
