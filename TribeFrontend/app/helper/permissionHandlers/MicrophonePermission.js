import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';

// Request microphone permission
const requestMicrophonePermission = async () => {
  try {
      const accessMicrophone = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
              title: 'App Microphone Permission',
              message: 'App needs access to your microphone to take photos and videos.',
              buttonPositive: 'OK',
          }
      );
      
      if (accessMicrophone === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
      } else if (accessMicrophone === PermissionsAndroid.RESULTS.DENIED) {
          return false; 
      } else if (accessMicrophone === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          Alert.alert(
              'Microphone Permission',
              'Microphone permission has been denied permanently. Please enable it in the app settings.',
              [
                  { text: 'Open Settings', onPress: () => Linking.openSettings() },
                  { text: 'Close', style: 'cancel' }
              ]
          );
          return false;
      }
  } catch (err) {
      console.warn(err);
      return false;
  }
};

export { requestMicrophonePermission };