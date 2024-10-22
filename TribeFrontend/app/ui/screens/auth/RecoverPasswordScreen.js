import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import TextKey from 'assets/localization/TextKey';
import I18n from 'assets/localization/i18n';

const RecoverPasswordScreen = ({ navigation }) => {
  const { theme } = useTheme(); 
  const styles = createStyles(theme);

  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleVerify = () => {
    if (!email) {
      setErrorMessage(I18n.t(TextKey.completeFields)); // Traducción del mensaje de error
    } else {
      setErrorMessage('');
      navigation.navigate('VerifyIdentity');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image
          source={theme.backIcon}
          style={styles.backIcon}
        />
      </TouchableOpacity>

      <Image 
        source={theme.logo}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>{I18n.t(TextKey.recoverPasswordTitle)}</Text>

      <Text style={styles.subtitleBold}>
        {I18n.t(TextKey.recoverPasswordDescription)} {/* Cambié `recoverPasswordSubtitle` por `recoverPasswordDescription` */}
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.labelText}>{I18n.t(TextKey.emailLabel)}</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.backgroundSecondary || theme.colors.background }]} // Fondo según el tema
          placeholder={I18n.t(TextKey.emailPlaceholder)}
          placeholderTextColor={theme.colors.placeholder || '#a9a9a9'}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={[styles.buttonText, {  color: theme.colors.buttonText }]}>{I18n.t(TextKey.verifyButton)}</Text>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background, 
    paddingHorizontal: 24,
    justifyContent: 'flex-start',
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 20,
    borderColor: theme.colors.primary,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: theme.colors.primary,
  },
  logo: {
    width: 120, 
    height: 120,
    marginBottom: 10,  
    alignSelf: 'flex-start',
  },
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'left',
    width: '100%',
    marginBottom: 15, 
  },
  subtitleBold: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'left',
    width: '100%',
    marginBottom: 30,
    lineHeight: 22,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  labelText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: theme.colors.text,
    fontFamily: 'Nunito-Regular',
  },
  button: {
    width: '100%',
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: 30,  
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontFamily: 'Nunito-Bold',
    color: theme.colors.textInverse,  
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'left',
    width: '100%',
  },
});

export default RecoverPasswordScreen;

