import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTheme } from 'context/ThemeContext';

const VerifyIdentityScreen = ({ navigation }) => {
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

      
      <Image 
        source={theme.logo}
        style={styles.logo}
        resizeMode="contain"
      />

      
      <Text style={styles.title}>Verifica tu identidad</Text>

      
      <Text style={styles.paragraph}>
        Hemos enviado un correo electrónico para confirmar que realmente eres tú.
      </Text>
      <Text style={styles.paragraph}>
        Por favor, revisa tu bandeja de entrada y haz clic en el enlace para continuar.
      </Text>
      <Text style={styles.paragraph}>
        Si no visualizas el correo, verifica la carpeta de spam.
      </Text>

      
      <Image 
        //source={require('assets/images/emailSent.png')}  
        //style={styles.emailImage}
        //resizeMode="contain"
      />
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
    fontFamily: 'Nunito-Bold',
    fontSize: 26,
    fontWeight: 'bold', 
    color: theme.colors.text,  
    textAlign: 'left',
    marginBottom: 20,
  },
  paragraph: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    fontWeight: '600',  
    color: theme.colors.text,  
    lineHeight: 24,
    marginBottom: 10,
  },
  emailImage: {
    width: '100%',
    height: 150,
    marginTop: 30,
    alignSelf: 'center',
  },
});

export default VerifyIdentityScreen;
