import React, { useEffect } from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

const BiometricPrompt = ({ onAuthenticated }) => {
  useEffect(() => {
    rnBiometrics.isSensorAvailable()
      .then((resultObject) => {
        const { available, biometryType } = resultObject;

        if (available && biometryType === ReactNativeBiometrics.TouchID) {
          console.log('TouchID is supported');
        } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
          console.log('FaceID is supported');
        } else if (available && biometryType === ReactNativeBiometrics.Biometrics) {
          console.log('Biometrics is supported');
        } else {
          console.log('Biometrics not supported');
        }
      });
  }, []);

  const handleBiometricAuth = () => {
    rnBiometrics.simplePrompt({ promptMessage: 'Confirm fingerprint' })
      .then((resultObject) => {
        const { success } = resultObject;

        if (success) {
          console.log('successful biometrics provided');
          onAuthenticated();
        } else {
          console.log('user cancelled biometric prompt');
        }
      })
      .catch(() => {
        console.log('biometrics failed');
      });
  };

  return (
    <View style={styles.container}>
      <Button title="Authenticate with Biometrics" onPress={handleBiometricAuth} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BiometricPrompt;