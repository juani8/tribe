import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';


const requestExternalStoragePermission = async () => {
  if (Platform.OS === 'android') {
      try {
          if (Platform.Version < 29) {
              // For Android 9 and below (API < 29)
              const readStorage = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                  {
                      title: 'App Storage Permission',
                      message: 'App needs access to your storage to read media.',
                      buttonPositive: 'OK',
                  }
              );
              const writeStorage = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                  {
                      title: 'App Storage Permission',
                      message: 'App needs access to your storage to write media.',
                      buttonPositive: 'OK',
                  }
              );
              
              if (readStorage === PermissionsAndroid.RESULTS.GRANTED && writeStorage === PermissionsAndroid.RESULTS.GRANTED) {
                  return true;
              } else if (readStorage === PermissionsAndroid.RESULTS.DENIED || writeStorage === PermissionsAndroid.RESULTS.DENIED) {
                  return false; 
              } else if (readStorage === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN || writeStorage === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                  Alert.alert(
                      'Storage Permission',
                      'Storage permission has been denied. Please enable it in the app settings.',
                      [
                          { text: 'Open Settings', onPress: () => Linking.openSettings() },
                          { text: 'Close', style: 'cancel' }
                      ]
                  );
                  return false;
              }
          } else if (Platform.Version >= 33) {
              // For Android 13+ (API 33+)
              const accessImage = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                  {
                      title: 'App Storage Permission',
                      message: 'App needs access to your storage to read media images.',
                      buttonPositive: 'OK',
                  }
              );
              const accessVideo = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
                  {
                      title: 'App Storage Permission',
                      message: 'App needs access to your storage to read media videos.',
                      buttonPositive: 'OK',
                  }
              );
              
              if (accessImage === PermissionsAndroid.RESULTS.GRANTED && accessVideo === PermissionsAndroid.RESULTS.GRANTED) {
                  return true;
              } else if (accessImage === PermissionsAndroid.RESULTS.DENIED || accessVideo === PermissionsAndroid.RESULTS.DENIED) {
                  return false; 
              } else if (accessImage === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN || accessVideo === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                  Alert.alert(
                      'Read or Write Storage Permission',
                      'Read or Write Storage permission has been denied. Please enable it in the app settings.',
                      [
                          { text: 'Open Settings', onPress: () => Linking.openSettings() },
                          { text: 'Close', style: 'cancel' }
                      ]
                  );
                  return false;
              }
          } else {
              // For Android 10+ (API 29-32)
              const readStorage = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                  {
                      title: 'App Storage Permission',
                      message: 'App needs access to your storage to read media.',
                      buttonPositive: 'OK',
                  }
              );
              
              if (readStorage === PermissionsAndroid.RESULTS.GRANTED) {
                  return true;
              } else if (readStorage === PermissionsAndroid.RESULTS.DENIED) {
                  return false; 
              } else if (readStorage === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                  Alert.alert(
                      'Read Storage Permission',
                      'Read Storage permission has been denied. Please enable it in the app settings.',
                      [
                          { text: 'Open Settings', onPress: () => Linking.openSettings() },
                          { text: 'Close', style: 'cancel' }
                      ]
                  );
                  return false;
              }
          }
      } catch (err) {
          console.warn(err);
          return false;
      }
  }
  return false; // Default for iOS
};


export { requestExternalStoragePermission };