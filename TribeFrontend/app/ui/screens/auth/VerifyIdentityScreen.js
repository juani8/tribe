import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, TextInput, Alert } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import LottieView from 'lottie-react-native';
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
      setErrorMessage('Por favor, ingresa el token de verificación.');
      return;
    }
 
    try {
      // DESCOMENTEN ESTO PARA Q FUNCIONE CON EL BACK
      /*
      const response = await verifyRegistrationToken(token);
      if (response.message === 'User verified successfully. You can now log in.') {
        Alert.alert('Verificación exitosa', 'Tu cuenta ha sido verificada exitosamente.');
        navigation.navigate('InitialConfiguration');
      } else {
        throw new Error('Token inválido o expirado.');
      }
      */
 
      // Simulación 
      Alert.alert('Verificación simulada', 'Tu cuenta ha sido verificada exitosamente.');
      navigation.navigate('InitialConfiguration');
    } catch (error) {
      console.error('Error verificando el token:', error);
      setErrorMessage('Token inválido o expirado. Por favor, inténtalo de nuevo.');
    }
  };
 
  return (
<View style={styles.container}>
<TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={isDarkMode ? BackNight : Back} style={{ width: 40, height: 40 }} />
      </TouchableOpacity>
 
 
      <Image source={theme.logo} style={styles.logo} resizeMode="contain" />
 
      <CustomTextNunito style={styles.title} weight="Bold">
        Verifica tu identidad
</CustomTextNunito>
 
      <CustomTextNunito style={styles.paragraph} weight="Regular">
        Hemos enviado un correo electrónico para confirmar que realmente eres tú.
</CustomTextNunito>
<CustomTextNunito style={styles.paragraph} weight="Regular">
        Por favor, revisa tu bandeja de entrada y haz clic en el enlace para continuar.
</CustomTextNunito>
<CustomTextNunito style={styles.paragraph} weight="Regular">
        Si no visualizas el correo, verifica la carpeta de spam.
</CustomTextNunito>
 
      <LottieView
        source={require('assets/lottie/mailingLottie.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
 
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.backgroundSecondary }]}
        placeholder="Ingresa el token de verificación"
        placeholderTextColor={theme.dark ? theme.colors.placeholder : '#A9A9A9'}
        value={token}
        onChangeText={setToken}
      />
 
      {errorMessage ? <CustomTextNunito style={styles.errorText} weight="Regular">{errorMessage}</CustomTextNunito> : null}
 
      <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyToken}>
<CustomTextNunito style={styles.verifyButtonText} weight="Bold">
          Verificar Token
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
  backIcon: {
    width: 24,
    height: 24,
    tintColor: theme.colors.primary,
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
});
 
export default VerifyIdentityScreen;