import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, TextInput, Alert } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import LottieView from 'lottie-react-native';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
// import { verifyRegistrationToken } from 'networking/api/authsApi'; // DESCOMENTEN ESTO PARA Q FUNCIONE CON EL BACK
import Back from 'assets/images/icons/Back.png';
import BackNight from 'assets/images/iconsNight/Back_night.png';

const VerifyIdentityScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const styles = createStyles(theme);

  const [token, setToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleVerifyToken = async () => {
    if (!token) {
      setErrorMessage(I18n.t(TextKey.completeFields));
      return;
    }

    try {
      // DESCOMENTEN ESTO PARA Q FUNCIONE CON EL BACK
      /*
      const response = await verifyRegistrationToken(token);
      if (response.message === 'User verified successfully. You can now log in.') {
        Alert.alert(I18n.t(TextKey.verificationSuccessTitle), I18n.t(TextKey.verificationSuccessMessage));
        navigation.navigate('InitialConfiguration');
      } else {
        throw new Error(I18n.t(TextKey.invalidTokenMessage));
      }
      */

      // Simulación 
      Alert.alert(I18n.t(TextKey.verificationSuccessTitle), I18n.t(TextKey.verificationSuccessMessage));
      navigation.navigate('InitialConfiguration');
    } catch (error) {
      console.error('Error verifying token:', error);
      setErrorMessage(I18n.t(TextKey.invalidTokenMessage));
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={isDarkMode ? BackNight : Back} style={{ width: 40, height: 40 }} />
      </TouchableOpacity>

      <Image source={theme.logo} style={styles.logo} resizeMode="contain" />

      <CustomTextNunito style={styles.title} weight="Bold">
        {I18n.t(TextKey.verifyIdentityTitle)}
      </CustomTextNunito>

      <CustomTextNunito style={styles.paragraph} weight="Regular">
        {I18n.t(TextKey.verifyIdentityInstruction)}
      </CustomTextNunito>
      <CustomTextNunito style={styles.paragraph} weight="Regular">
        {I18n.t(TextKey.verifyIdentityCheckInbox)}
      </CustomTextNunito>
      <CustomTextNunito style={styles.paragraph} weight="Regular">
        {I18n.t(TextKey.verifyIdentityCheckSpam)}
      </CustomTextNunito>

      <LottieView
        source={require('assets/lottie/mailingLottie.json')}
        autoPlay
        loop
        style={styles.lottie}
      />


      {errorMessage ? <CustomTextNunito style={styles.errorText} weight="Regular">{errorMessage}</CustomTextNunito> : null}

      {/* Botón "Iniciar Sesión" */}
      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
        <CustomTextNunito style={styles.loginButtonText} weight="Bold">
          {I18n.t(TextKey.loginButton)}
        </CustomTextNunito>
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
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 26,
    color: theme.colors.text,
    marginBottom: 10,
    textAlign: 'left',
  },
  paragraph: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
    marginBottom: 10,
  },
  lottie: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: theme.colors.text,
    marginTop: 20,
  },
  verifyButton: {
    width: '100%',
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  verifyButtonText: {
    fontSize: 16,
    color: '#FFF',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'left',
    width: '100%',
  },
  loginButton: {
    width: '100%',
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    fontSize: 16,
    color: '#FFF',
  },
});

export default VerifyIdentityScreen;

