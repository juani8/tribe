import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, TextInput, Alert } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import LottieView from 'lottie-react-native';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import Back from 'assets/images/icons/Back.png';
import BackNight from 'assets/images/iconsNight/Back_night.png';


const VerifyIdentityRegisterScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const styles = createStyles(theme);

  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const hiddenInputRef = useRef(null);

  const handleCodeChange = async (text) => {
    if (text.length <= 6) {
      setCode(text);
  
      if (text.length === 6) {
        try {
          const email = navigation.getParam('email'); // Obtén el email pasado desde el registro
          const verificationData = { email, totpCode: text };
  
          const response = await verifyTotp(verificationData);
  
          Alert.alert(I18n.t(TextKey.verificationSuccessTitle), response.message);
  
          navigation.navigate('InitialConfiguration');
        } catch (error) {
          if (error.response && error.response.status === 400) {
            setErrorMessage(I18n.t(TextKey.invalidTokenMessage));
          } else {
            setErrorMessage(I18n.t(TextKey.genericVerificationError));
          }
        }
      }
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

      {/* Contenedor para los dígitos */}
      <TouchableOpacity onPress={() => hiddenInputRef.current.focus()} style={styles.codeInputContainer}>
        {Array(6).fill('').map((_, index) => (
          <View key={index} style={styles.digitBox}>
            <CustomTextNunito style={styles.digitText} weight="Bold">
              {code[index] || ''}
            </CustomTextNunito>
          </View>
        ))}
      </TouchableOpacity>

      {/* Input oculto para capturar el código completo */}
      <TextInput
        ref={hiddenInputRef}
        style={styles.hiddenInput}
        keyboardType="numeric"
        maxLength={6}
        value={code}
        onChangeText={handleCodeChange}
        autoFocus
      />

      {errorMessage ? <CustomTextNunito style={styles.errorText} weight="Regular">{errorMessage}</CustomTextNunito> : null}

      <TouchableOpacity
        style={styles.verifyButton}
        onPress={() => {
          if (code.length !== 6) {
            Alert.alert(I18n.t(TextKey.errorTitle), I18n.t(TextKey.incompleteCodeMessage));
          }
        }}
      >
        <CustomTextNunito style={styles.verifyButtonText} weight="Bold">
          {I18n.t(TextKey.continueButton)}
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
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  digitBox: {
    width: 40,
    height: 50,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitText: {
    fontSize: 18,
    color: theme.colors.text,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
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
});

export default VerifyIdentityRegisterScreen;




