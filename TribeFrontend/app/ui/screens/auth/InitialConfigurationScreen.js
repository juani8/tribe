import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Text, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from 'context/ThemeContext';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
// import { editUserProfile } from 'networking/api/usersApi'; // DESCOMENTEN ESTO PARA Q FUNCIONE CON EL BACK
;

const InitialConfigurationScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [gender, setGender] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  const handleContinue = async () => {
    if (!name || !surname || !gender) {
      setErrorMessage('Por favor completa todos los campos');
      return;
    }
  
    try {
      // Limpiar el mensaje de error antes de hacer la llamada
      setErrorMessage('');
  
      // DESCOMENTEN ESTO PARA Q FUNCIONE CON EL BACK
      // const response = await editUserProfile({ name, lastName: surname, gender });
  
      // SIMULACION, DESPUES BORREN ESTO SI ACTIVAN LA DE ARRIBA
      Alert.alert('Perfil actualizado', 'Tu perfil ha sido completado exitosamente.');
      navigation.navigate('Main'); // Redirige a la pantalla principal
  
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      setErrorMessage('Hubo un problema al actualizar tu perfil. Inténtalo nuevamente.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={theme.logo} style={styles.logo} resizeMode="contain" />

      <CustomTextNunito style={styles.title} weight="Bold">
        Bienvenido a <CustomTextNunito style={styles.highlight} weight="Bold">Tribe</CustomTextNunito>
      </CustomTextNunito>
      <CustomTextNunito style={styles.subtitle} weight="Regular">
        Comencemos completando tu perfil.
      </CustomTextNunito>

      <CustomTextNunito style={styles.label} weight="Regular">Nombre</CustomTextNunito>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu nombre"
        placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
        value={name}
        onChangeText={setName}
      />

      <CustomTextNunito style={styles.label} weight="Regular">Apellido</CustomTextNunito>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu apellido"
        placeholderTextColor={theme.colors.placeholder || '#A9A9A9'}
        value={surname}
        onChangeText={setSurname}
      />

      <CustomTextNunito style={styles.label} weight="Regular">Género</CustomTextNunito>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={gender}
          style={styles.picker}
          onValueChange={(itemValue) => setGender(itemValue)}
        >
          <Picker.Item label="Seleccionar" value="" />
          <Picker.Item label="Masculino" value="masculino" />
          <Picker.Item label="Femenino" value="femenino" />
          <Picker.Item label="No binario" value="no_binario" />
          <Picker.Item label="Otro" value="otro" />
          <Picker.Item label="Prefiero no decir" value="prefiero_no_decir" />
        </Picker>
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <CustomTextNunito style={styles.continueButtonText} weight="Bold">Continuar</CustomTextNunito>
      </TouchableOpacity>
    </ScrollView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start', 
    paddingHorizontal: 40,
    paddingTop: 100, 
    backgroundColor: theme.colors.background,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 24,
    color: theme.colors.text,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  highlight: {
    color: theme.colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: theme.colors.backgroundSecondary,
    color: theme.colors.text,
    marginBottom: 15,
  },
  pickerContainer: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: theme.colors.backgroundSecondary,
    marginBottom: 15,
    borderColor: theme.colors.placeholder,
    borderWidth: 1,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: '100%',
    color: theme.colors.text,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  continueButton: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    marginBottom: 10,
  },
  continueButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontFamily: 'Nunito-Bold',
  },
});

export default InitialConfigurationScreen;



