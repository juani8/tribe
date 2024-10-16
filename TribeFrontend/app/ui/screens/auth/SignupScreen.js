import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useTheme } from 'context/ThemeContext'; 

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
      setErrorMessage('Por favor, completa todos los campos.');
    } else if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
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
      
      <Text style={[styles.title, { color: theme.colors.text }]}>Crea tu cuenta</Text>

      <Text style={[styles.labelText, { color: theme.colors.text }]}>Nombre de fantasía</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.backgroundSecondary, color: theme.colors.text }]}
        placeholder="Ingresa tu nombre de fantasía"
        placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
        value={fantasyName}
        onChangeText={setFantasyName}
      />

      <Text style={[styles.labelText, { color: theme.colors.text }]}>Correo</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.backgroundSecondary, color: theme.colors.text }]}
        placeholder="Ingresa tu correo"
        placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      
      <Text style={[styles.labelText, { color: theme.colors.text }]}>Contraseña</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.backgroundSecondary, color: theme.colors.text }]}
        placeholder="Ingresa tu contraseña"
        placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={[styles.labelText, { color: theme.colors.text }]}>Confirmar contraseña</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.backgroundSecondary, color: theme.colors.text }]}
        placeholder="Confirma tu contraseña"
        placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Renderizamos el mensaje de error dentro de un <Text> */}
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity 
        style={[styles.signupButton, { backgroundColor: theme.colors.primary }]} 
        onPress={handleSignup}
      >
        {/* El texto dentro del botón debe estar en blanco en modo claro */}
        <Text style={[styles.signupButtonText, { color: theme.isDarkMode ? theme.colors.textInverse : '#FFF' }]}>Crear usuario</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
        {/* Aquí nos aseguramos que el texto esté en un componente <Text> */}
        <Text style={[styles.loginText, { color: theme.colors.primary }]}>Inicia sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center', 
    paddingHorizontal: 40, 
    paddingTop: 40,  // Disminuir padding top
    backgroundColor: theme.colors.background,
  },
  logo: {
    width: 120,  
    height: 120,
    marginBottom: 10,  // Reducir el espacio debajo del logo
    alignSelf: 'flex-start', 
  },
  title: {
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20,  // Reducir espacio entre el título y el siguiente elemento
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
    marginBottom: 15,  // Reducir espacio entre los campos
    fontSize: 16,
    backgroundColor: theme.colors.backgroundSecondary,  // Color del input cambia con el tema
  },
  signupButton: {
    width: '100%',
    height: 50,
    borderRadius: 8, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,  // Reducir espacio debajo del botón
  },
  signupButtonText: {
    fontSize: 18, 
    fontWeight: 'bold',
  },
  loginText: {
    marginTop: 10,  // Reducir espacio superior para que sea visible
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
