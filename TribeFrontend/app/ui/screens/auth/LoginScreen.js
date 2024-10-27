import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import TextKey from 'assets/localization/TextKey';
import I18n from 'assets/localization/i18n';

const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      setErrorMessage(I18n.t(TextKey.loginMessage)); // Usamos I18n.t para traducir los mensajes
    } else {
      setErrorMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={theme.logo}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.welcomeText}>
        {I18n.t(TextKey.loginTitle)}
      </Text>

      <Text style={styles.loginMessage}>{I18n.t(TextKey.loginMessage)}</Text>

      <View style={styles.inputContainer}>
        <Text style={[styles.labelText, { color: theme.colors.text }]}>
          {I18n.t('emailLabel')}
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.backgroundSecondary, color: theme.colors.text }]}
          placeholder={I18n.t('emailPlaceholder')}
          placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.labelText, { color: theme.colors.text }]}>
          {I18n.t('passwordLabel')}
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.backgroundSecondary, color: theme.colors.text }]}
          placeholder={I18n.t('passwordPlaceholder')}
          placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity style={[styles.loginButton, { backgroundColor: theme.colors.primary }]} onPress={handleLogin}>
        <Text style={[styles.loginButtonText, { color: '#FFF' }]}>{I18n.t(TextKey.loginButton)}</Text>
      </TouchableOpacity>

      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('RecoverPassword')}>
          <Text style={[styles.linkText, { color: theme.colors.primary }]}>
            {I18n.t(TextKey.goToRecoverPassword)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
          <Text style={[styles.linkText, { color: theme.colors.primary, marginTop: 5 }]}>
            {I18n.t(TextKey.goToSignup)}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.orText, { color: theme.colors.text }]}>{I18n.t(TextKey.gmailLogin)}</Text>

      <TouchableOpacity style={styles.googleButton}>
        <Text style={styles.googleButtonText}>Inicia sesión con Google</Text>
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
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  loginMessage: {
    fontSize: 16,
    marginBottom: 15,
    color: theme.colors.text,
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
  },
  input: {
    width: '100%',
    height: 55,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  loginButton: {
    width: '85%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  linksContainer: {
    alignItems: 'flex-start',
    width: '85%',
    marginBottom: 10,
  },
  linkText: {
    fontSize: 14,
  },
  orText: {
    marginBottom: 15,
    color: theme.colors.text,
  },
  googleButton: {
    width: '85%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderColor: '#d3d3d3',
    borderWidth: 1,
    marginTop: 15,
    backgroundColor: '#FFFFFF',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default LoginScreen;





