import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';

import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

const requestCameraPermission = async () => {
    try {
        const accessCamera = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: I18n.t(TextKey.cameraPermissionAlertTitle),
                message: I18n.t(TextKey.cameraPermissionAlertMessage),
                buttonPositive: I18n.t(TextKey.permissionAlertButtonPositive),
            }
        );
        
        if (accessCamera === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
        } else if (accessCamera === PermissionsAndroid.RESULTS.DENIED) {
            return false; 
        } else if (accessCamera === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            Alert.alert(
                I18n.t(TextKey.cameraPermissionAlertTitle),
                I18n.t(TextKey.cameraPermissionAlertDeniedMessage),
                [
                    { text: I18n.t(TextKey.cameraPermissionAlertOpenSettings), onPress: () => Linking.openSettings() },
                    { text: I18n.t(TextKey.cameraPermissionAlertCloseDialog), style: 'cancel' }
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