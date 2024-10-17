import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';

import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

// Request external storage permission

const requestLocationPermission = async () => {
    try {
        const accessFineLocation = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: I18n.t(TextKey.locationPermissionAlertTitle),
                message: I18n.t(TextKey.locationPermissionAlertMessage),
                buttonPositive: I18n.t(TextKey.permissionAlertButtonPositive),
            }
        );
        
        if (accessFineLocation === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
        } else if (accessFineLocation === PermissionsAndroid.RESULTS.DENIED) {
            return false; 
        } else if (accessFineLocation === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            Alert.alert(
                I18n.t(TextKey.locationPermissionAlertTitle),
                I18n.t(TextKey.locationPermissionAlertDeniedMessage),
                [
                    { text: I18n.t(TextKey.permissionAlertOpenSettings), onPress: () => Linking.openSettings() },
                    { text: I18n.t(TextKey.permissionAlertCloseDialog), style: 'cancel' }
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