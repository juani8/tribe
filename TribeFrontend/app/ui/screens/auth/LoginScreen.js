import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTheme } from 'context/ThemeContext'; 

const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme(); 
  const styles = createStyles(theme);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      setErrorMessage('Por favor, completa todos los campos.');
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
        Bienvenido a <Text style={[styles.brandText, {color: theme.colors.primary}]}>Tribe</Text>
      </Text>

      <View style={styles.inputContainer}>
        <Text style={[styles.labelText, {color: theme.colors.text}]}>Correo</Text>
        <TextInput
          style={[styles.input, {backgroundColor: '#EFEFEF', color: theme.colors.text}]}
          placeholder="Ingresa tu correo"
          placeholderTextColor="#A9A9A9"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.labelText, {color: theme.colors.text}]}>Contraseña</Text>
        <TextInput
          style={[styles.input, {backgroundColor: '#EFEFEF', color: theme.colors.text}]}
          placeholder="Ingresa tu contraseña"
          placeholderTextColor="#A9A9A9"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity 
        style={[styles.loginButton, { backgroundColor: theme.colors.primary }]} 
        onPress={handleLogin}
      >
        <Text style={[styles.loginButtonText, { color: '#FFF' }]}>Iniciar sesión</Text>
      </TouchableOpacity>

      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('RecoverPassword')}>
          <Text style={[styles.linkText, {color: theme.colors.primary, alignSelf: 'flex-start'}]}>
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
          <Text style={[styles.linkText, { color: theme.colors.primary, alignSelf: 'flex-start', marginTop: 5 }]}>
            Regístrate
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.orText, {color: theme.colors.text}]}>O inicia sesión con</Text>

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
    alignSelf: 'flex-start',  // Desplazado a la izquierda
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 20,
    alignSelf: 'flex-start',  // Desplazado a la izquierda
  },
  brandText: {
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '85%',  // Márgenes más grandes para no llegar al borde
    marginBottom: 15,
  },
  labelText: {
    fontSize: 16,
    marginBottom: 5,
    color: theme.colors.text,
    alignSelf: 'flex-start',  // Texto alineado a la izquierda
  },
  input: {
    width: '100%',
    height: 55,
    borderRadius: 8,
    backgroundColor: '#EFEFEF',
    paddingHorizontal: 15,
    fontSize: 16,
    color: theme.colors.text,
  },
  loginButton: {
    width: '85%',  // Botón más angosto, alineado con los campos de entrada
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
    alignItems: 'flex-start',  // Desplazado a la izquierda
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
    width: '85%',  // Alineado con los otros campos y botón
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
