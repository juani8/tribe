import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTheme } from 'context/ThemeContext';

const RecoverPasswordScreen = ({ navigation }) => {
  const { theme } = useTheme(); 
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image
          source={theme.backIcon}
          style={styles.backIcon}
        />
      </TouchableOpacity>

      {/* Logo */}
      <Image 
        source={theme.logo}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Título principal */}
      <Text style={styles.title}>Recupera tu contraseña</Text>

      {/* Texto subtítulo en negritas */}
      <Text style={styles.subtitleBold}>
        Ingresa el email con el que te registraste, te enviaremos un código para cambiar tu contraseña.
      </Text>

      {/* Campo de correo electrónico */}
      <View style={styles.inputContainer}>
        <Text style={styles.labelText}>Correo</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu correo"
          placeholderTextColor="#a9a9a9"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Botón de verificar */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('VerifyIdentity')}>
        <Text style={styles.buttonText}>Verificar</Text>
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
    fontFamily: 'Nunito-Bold',  // Aplicamos la fuente en negritas
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
    backgroundColor: '#EFEFEF',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
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
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RecoverPasswordScreen;
