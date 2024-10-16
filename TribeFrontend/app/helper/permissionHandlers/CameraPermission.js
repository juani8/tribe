import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';

const requestCameraPermission = async () => {
    try {
        const accessCamera = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: 'App Camera Permission',
                message: 'App needs access to your camera to take photos and videos.',
                buttonPositive: 'OK',
            }
        );
        
        if (accessCamera === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
        } else if (accessCamera === PermissionsAndroid.RESULTS.DENIED) {
            return false; 
        } else if (accessCamera === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            Alert.alert(
                'Camera Permission',
                'Camera permission has been denied permanently. Please enable it in the app settings.',
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

export { requestCameraPermission };