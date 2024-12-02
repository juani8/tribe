import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

export const authenticateWithBiometrics = async () => {
  try {
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();

    if (available && (biometryType === ReactNativeBiometrics.TouchID || biometryType === ReactNativeBiometrics.FaceID || biometryType === ReactNativeBiometrics.Biometrics)) {
      const { success } = await rnBiometrics.simplePrompt({ promptMessage: 'Confirm fingerprint' });

      if (success) {
        console.log('successful biometrics provided');
        return true;
      } else {
        console.log('user cancelled biometric prompt');
        return false;
      }
    } else {
      console.log('Biometrics not supported');
      return false;
    }
  } catch (error) {
    console.error('biometrics failed:', error);
    return false;
  }
};


