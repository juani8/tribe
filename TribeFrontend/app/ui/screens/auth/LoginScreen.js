import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTheme } from 'context/ThemeContext'; 

const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme(); 

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
        <Text style={styles.labelText}>Correo</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu correo"
          placeholderTextColor="#a9a9a9"
          keyboardType="email-address"
        />
      </View>

      
      <View style={styles.inputContainer}>
        <Text style={styles.labelText}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu contraseña"
          placeholderTextColor="#a9a9a9"
          secureTextEntry
        />
      </View>

     
      <TouchableOpacity 
        style={[styles.loginButton, { backgroundColor: theme.colors.primary }]} 
      >
        <Text style={styles.loginButtonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      
      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => {/* lógica para recuperar contraseña */}}>
          <Text style={[styles.linkText, { color: theme.colors.primary }]}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.signupContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
          <Text style={[styles.linkText, { color: theme.colors.primary }]}>Regístrate</Text>
        </TouchableOpacity>
      </View>

      
      <Text style={styles.orText}>O inicia sesión con</Text>

      
      <TouchableOpacity style={styles.googleButton}>
        <Image 
          source={theme.googleButton} 
          style={styles.googleImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F4F0',
    padding: 20,
  },
  logo: {
    width: 100, 
    height: 100,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    alignSelf: 'flex-start',
  },
  brandText: {
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '90%',
    marginBottom: 20,
  },
  labelText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#EFEFEF',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    width: '90%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linksContainer: {
    width: '90%',
    marginBottom: 5,
  },
  signupContainer: {
    width: '90%',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  linkText: {
    fontSize: 14,
  },
  orText: {
    color: '#333',
    marginBottom: 10,
  },
  googleButton: {
    width: '70%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  googleImage: {
    width: '100%',
    height: '100%',
  },
});

export default LoginScreen;
