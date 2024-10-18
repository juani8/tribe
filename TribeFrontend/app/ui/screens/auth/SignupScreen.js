import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useTheme } from 'context/ThemeContext'; 
import TextKey from 'assets/localization/TextKey';
import I18n from 'assets/localization/i18n';

const SignupScreen = ({ navigation }) => {
  const { theme } = useTheme(); 
  const styles = createStyles(theme);  

  const [fantasyName, setFantasyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = () => {
    if (!fantasyName || !email || !password || !confirmPassword) {
      setErrorMessage(I18n.t(TextKey.completeFields)); // Usa el key correcto
    } else if (password !== confirmPassword) {
      setErrorMessage(I18n.t(TextKey.passwordsDontMatch)); // Usa el key correcto
    } else {
      setErrorMessage('');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}> 
      <Image 
        source={theme.logo} 
        style={styles.logo}
        resizeMode="contain"
      />
      
      <Text style={[styles.title, { color: theme.colors.text }]}>{I18n.t(TextKey.signupTitle)}</Text>

      <Text style={[styles.labelText, { color: theme.colors.text }]}>{I18n.t(TextKey.nameAccount)}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.backgroundSecondary, color: theme.colors.text }]}
        placeholder={I18n.t(TextKey.enterName)}
        placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
        value={fantasyName}
        onChangeText={setFantasyName}
      />

      <Text style={[styles.labelText, { color: theme.colors.text }]}>{I18n.t(TextKey.emailAccount)}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.backgroundSecondary, color: theme.colors.text }]}
        placeholder={I18n.t(TextKey.enterEmail)}
        placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      
      <Text style={[styles.labelText, { color: theme.colors.text }]}>{I18n.t(TextKey.passwordAccount)}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.backgroundSecondary, color: theme.colors.text }]}
        placeholder={I18n.t(TextKey.enterPassword)}
        placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={[styles.labelText, { color: theme.colors.text }]}>{I18n.t(TextKey.confirmPassword)}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.backgroundSecondary, color: theme.colors.text }]}
        placeholder={I18n.t(TextKey.enterConfirmPassword)}
        placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity 
        style={[styles.signupButton, { backgroundColor: theme.colors.primary }]} 
        onPress={handleSignup}
      >
        <Text style={[styles.signupButtonText, { color: theme.isDarkMode ? theme.colors.textInverse : '#FFF' }]}>{I18n.t(TextKey.createUserButton)}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={[styles.loginText, { color: theme.colors.primary }]}>{I18n.t(TextKey.logIn)}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center', 
    paddingHorizontal: 40, 
    paddingTop: 40,  
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
    fontWeight: 'bold', 
    marginBottom: 20,  
    alignSelf: 'flex-start',
  },
  labelText: {
    alignSelf: 'flex-start',
    fontSize: 16,
    marginBottom: 10, 
  },
  input: {
    width: '100%',
    height: 55, 
    borderRadius: 8, 
    paddingHorizontal: 15, 
    marginBottom: 15,  
    fontSize: 16,
    backgroundColor: theme.colors.backgroundSecondary,  
  },
  signupButton: {
    width: '100%',
    height: 50,
    borderRadius: 8, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, 
  },
  signupButtonText: {
    fontSize: 18, 
    fontWeight: 'bold',
  },
  loginText: {
    marginTop: 10,  
    fontSize: 16,
    alignSelf: 'flex-start',
    color: theme.colors.primary,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'left',
    width: '100%',
    marginTop: -10, 
  },
});

export default SignupScreen;

