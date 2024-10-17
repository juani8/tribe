import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

// Request microphone permission
const requestMicrophonePermission = async () => {
    try {
        const accessMicrophone = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
                title: I18n.t(TextKey.notificationsPermissionAlertTitle),
                message: I18n.t(TextKey.notificationsPermissionAlertMessage),
                buttonPositive: I18n.t(TextKey.permissionAlertButtonPositive),
            }
        );

        if (accessMicrophone === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
        } else if (accessMicrophone === PermissionsAndroid.RESULTS.DENIED) {
            return false;
        } else if (accessMicrophone === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            Alert.alert(
                I18n.t(TextKey.notificationsPermissionAlertTitle),
                I18n.t(TextKey.notificationsPermissionAlertDeniedMessage),
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

export { requestMicrophonePermission };