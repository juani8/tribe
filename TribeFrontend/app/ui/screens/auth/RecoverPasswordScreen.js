import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import Back from 'assets/images/icons/Back.png';
import BackNight from 'assets/images/iconsNight/Back_night.png';
import { useTheme } from 'context/ThemeContext';
import TextKey from 'assets/localization/TextKey';
import I18n from 'assets/localization/i18n';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito'; 
//import { requestPasswordReset } from 'networking/api/authsApi'; // DESCOMENTEN ESTO PARA Q FUNCIONE CON EL BACK

const RecoverPasswordScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();  
  const styles = createStyles(theme);

  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleVerify = async () => {
    if (!email) {
      setErrorMessage(I18n.t(TextKey.completeFields)); 
      return;
    }

    try {
      // DESCOMENTEN ESTO PARA Q FUNCIONE CON EL BACK
      /*
      const response = await requestPasswordReset(email);
      console.log('Solicitud de restablecimiento enviada:', response);
      */

      // Simulación 
      Alert.alert('Solicitud enviada', 'Se ha enviado un enlace de verificación a tu correo.');
      
      // Redirige a la pantalla de verificación
      navigation.navigate('VerifyIdentity');
    } catch (error) {
      console.error('Error solicitando el restablecimiento de contraseña:', error);
      setErrorMessage('Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={isDarkMode ? BackNight : Back} style={{ width: 40, height: 40 }} />
      </TouchableOpacity>

      <Image 
        source={theme.logo}
        style={styles.logo}
        resizeMode="contain"
      />

      <CustomTextNunito style={styles.title} weight="Bold">
        {I18n.t(TextKey.recoverPasswordTitle)}
      </CustomTextNunito>

      <CustomTextNunito style={styles.subtitleBold} weight="Regular">
        {I18n.t(TextKey.recoverPasswordDescription)}
      </CustomTextNunito>

      <View style={styles.inputContainer}>
        <CustomTextNunito style={styles.labelText} weight="Regular">
          {I18n.t(TextKey.emailLabel)}
        </CustomTextNunito>
        <TextInput
          style={[styles.input]}
          placeholder={I18n.t(TextKey.emailPlaceholder)}
          placeholderTextColor={theme.colors.placeholder || '#a9a9a9'}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {errorMessage ? <CustomTextNunito style={styles.errorText} weight="Regular">{errorMessage}</CustomTextNunito> : null}

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <CustomTextNunito style={styles.buttonText} weight="Bold" color="#FFF">
          {I18n.t(TextKey.verifyButton)}
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
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 26,
    color: theme.colors.text,
    textAlign: 'left',
    width: '100%',
    marginBottom: 15, 
  },
  subtitleBold: {
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF', 
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'left',
    width: '100%',
  },
});

export default RecoverPasswordScreen;
