import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTheme } from 'context/ThemeContext'; 

const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme(); 

  return (
    <View style={styles.container}>
      {}
      <Image 
        source={theme.logo} 
        style={styles.logo}
        resizeMode="contain"
      />

      
      <Text style={styles.welcomeText}>
        Bienvenido a <Text style={styles.brandText}>Tribe</Text>
      </Text>

      
      <Text style={styles.labelText}>Correo</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu correo"
        placeholderTextColor="#a9a9a9"
        keyboardType="email-address"
      />

      
      <Text style={styles.labelText}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu contraseña"
        placeholderTextColor="#a9a9a9"
        secureTextEntry
      />

     
      <TouchableOpacity 
        style={[styles.loginButton, { backgroundColor: theme.colors.primary }]} 
      >
        <Text style={styles.loginButtonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      
      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => {/* recuperar contraseña */}}>
          <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
          <Text style={styles.linkText}>Regístrate</Text>
        </TouchableOpacity>
      </View>

      
      <Text style={styles.orText}>O inicia sesión con</Text>

      
      <TouchableOpacity style={styles.googleButton}>

        <Text style={styles.googleButtonText}>Google</Text>
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
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  brandText: {
    color: '#F8F4F0', 
  },
  labelText: {
    alignSelf: 'flex-start',
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
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    width: '100%',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  linkText: {
    color: '#F8F4F0',
    fontSize: 14,
  },
  orText: {
    color: '#333',
    marginBottom: 10,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    marginTop: 10,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
  },
});

export default LoginScreen;
