import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTheme } from 'context/ThemeContext'; 

const SignupScreen = ({ navigation }) => {
  const { theme } = useTheme(); 

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
    <View style={styles.container}>
      <Image 
        source={theme.logo} 
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Crea tu cuenta</Text>

      <Text style={styles.labelText}>Nombre de fantasía</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu nombre de fantasía"
        placeholderTextColor="#a9a9a9"
        value={fantasyName}
        onChangeText={setFantasyName}
      />

      <Text style={styles.labelText}>Correo</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu correo"
        placeholderTextColor="#a9a9a9"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      
      <Text style={styles.labelText}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu contraseña"
        placeholderTextColor="#a9a9a9"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.labelText}>Confirmar contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirma tu contraseña"
        placeholderTextColor="#a9a9a9"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity 
        style={[styles.signupButton, { backgroundColor: theme.colors.primary }]} 
        onPress={handleSignup}
      >
        <Text style={styles.signupButtonText}>Crear usuario</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={[styles.loginText, { color: theme.colors.primary }]}>Inicia sesión</Text> 
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', 
    paddingHorizontal: 40, 
    paddingTop: 60, 
    backgroundColor: '#F8F4F0',
  },
  logo: {
    width: 100, 
    height: 100,
    marginBottom: 20,
    alignSelf: 'flex-start', 
  },
  title: {
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#333',
    marginBottom: 30, 
    alignSelf: 'flex-start', 
  },
  labelText: {
    alignSelf: 'flex-start',
    fontSize: 16,
    color: '#333',
    marginBottom: 10, 
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#F2F2F2', 
    borderRadius: 8, 
    paddingHorizontal: 15, 
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
  },
  signupButton: {
    width: '100%',
    height: 50,
    borderRadius: 8, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  signupButtonText: {
    color: '#FFF',
    fontSize: 18, 
    fontWeight: 'bold', 
  },
  loginText: {
    marginTop: 20,
    fontSize: 16,
    color: '#7B3EFD',
    alignSelf: 'flex-start', 
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
