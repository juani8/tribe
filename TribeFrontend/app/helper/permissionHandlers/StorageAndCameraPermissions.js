import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

// Request camera permission
const requestCameraPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: 'App Camera Permission',
                message: 'App needs access to your camera to take photos and videos.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            }
        );

        if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            Alert.alert(
                'Camera Permission',
                'Camera permission has been denied permanently. Please enable it in the app settings.',
                [{ text: 'Open Settings', onPress: () => Linking.openSettings() }]
            );
        }

        return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
        console.warn(err);
        return false;
    }
};

// Request external storage permission
const requestExternalStoragePermission = async () => {
    const rationale = {
        title: 'App Storage Permission',
        message: 'App needs access to your storage to select media.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
    };

    if (Platform.OS === 'android') {
        try {
            if (Platform.Version < 29) {
                // For Android 9 and below (API < 29)
                const readGranted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    rationale
                );
                const writeGranted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    rationale
                );
                return readGranted === PermissionsAndroid.RESULTS.GRANTED && writeGranted === PermissionsAndroid.RESULTS.GRANTED;
            } else if (Platform.Version >= 33) {
                // For Android 13+ (API 33+) request granular permissions
                const imageGranted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                    rationale
                );
                const videoGranted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
                    rationale
                );
                return imageGranted === PermissionsAndroid.RESULTS.GRANTED && videoGranted === PermissionsAndroid.RESULTS.GRANTED;
            } else {
                // For Android 10+ (API 29-32)
                const readGranted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    rationale
                );
                return readGranted === PermissionsAndroid.RESULTS.GRANTED;
            }
        } catch (err) {
            console.warn(err);
            return false;
        }
    }
    return true; // Default for iOS
};

// Select media from gallery
const selectFromGallery = async (selectedMedia, setSelectedMedia) => {
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
};

// Open camera for media capture
const openCamera = async (selectedMedia, setSelectedMedia) => {
    const hasPermission = await requestCameraPermission();

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
