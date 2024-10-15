import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';

// Request external storage permission

const requestLocationPermission = async () => {
    try {
        const accessFineLocation = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'App Location Permission',
                message: 'App needs access to your location.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            }
        );
        
        if (accessFineLocation === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
        } else if (accessFineLocation === PermissionsAndroid.RESULTS.DENIED) {
            return false; 
        } else if (accessFineLocation === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            Alert.alert(
                'Location Permission',
                'Location permission has been denied permanently. Please enable it in the app settings.',
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

export { requestLocationPermission };