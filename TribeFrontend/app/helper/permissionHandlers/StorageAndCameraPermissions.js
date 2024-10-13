import { PermissionsAndroid, Platform, Alert } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

// Unified permission request function
const requestPermission = async (permissionType, rationale) => {
    try {
        const granted = await PermissionsAndroid.request(permissionType, rationale);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
        console.warn(err);
        return false;
    }
};

// Request external storage permission
const requestExternalStoragePermission = async () => {
  if (Platform.OS === 'android') {
      // For Android 9 and below (API < 29)
      if (Platform.Version < 29) {
          const readGranted = await requestPermission(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
              title: 'App Storage Permission',
              message: 'App needs access to your storage to select media',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
          });

          const writeGranted = await requestPermission(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
              title: 'App Storage Permission',
              message: 'App needs access to your storage to select media',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
          });

          return readGranted && writeGranted;
      } else if (Platform.Version >= 33) {
          // For Android 13+ (API 33+) request granular permissions
          const imageGranted = await requestPermission(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES, {
              title: 'App Storage Permission',
              message: 'App needs access to your images to select media',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
          });

          const videoGranted = await requestPermission(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO, {
              title: 'App Storage Permission',
              message: 'App needs access to your videos to select media',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
          });

          // Return true if any of the permissions are granted
          return imageGranted || videoGranted;
      } else {
          // For Android 10+ (API 29-32)
          const readGranted = await requestPermission(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
              title: 'App Storage Permission',
              message: 'App needs access to your storage to select media',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
          });
          return readGranted;
      }
  }
  return true; // On iOS or other platforms, simply return true
};


// Select media from gallery
const selectFromGallery = async (selectedMedia, setSelectedMedia) => {
    if (Platform.OS === 'android') {
        const hasPermission = await requestExternalStoragePermission();
        if (hasPermission) {
            launchImageLibrary({ mediaType: 'mixed', selectionLimit: 5 }, (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.errorCode) {
                    Alert.alert('Error', response.errorMessage);
                } else {
                    const assets = response.assets || [];
                    setSelectedMedia([...selectedMedia, ...assets.map(asset => ({ uri: asset.uri, type: asset.type }))]);
                }
            });
        } else {
            Alert.alert('Permission denied', 'App needs storage permission to access media.');
        }
    }
};

// Open camera for media capture
const openCamera = async (selectedMedia, setSelectedMedia) => {
    const hasPermission = await requestPermission(PermissionsAndroid.PERMISSIONS.CAMERA, {
        title: 'App Camera Permission',
        message: 'App needs access to your camera',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
    });

    if (hasPermission) {
        launchCamera({ mediaType: 'mixed' }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.errorCode) {
                Alert.alert('Error', response.errorMessage);
            } else {
                const assets = response.assets || [];
                setSelectedMedia([...selectedMedia, ...assets.map(asset => ({ uri: asset.uri, type: asset.type }))]);
            }
        });
    } else {
        Alert.alert('Permission denied', 'App needs camera permission to take photos or videos.');
    }
};

export { selectFromGallery, openCamera };
