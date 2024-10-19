import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';

import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

const requestExternalStoragePermission = async () => {
    if (Platform.OS === 'android') {
        try {
            if (Platform.Version < 29) {
                // For Android 9 and below (API < 29)
                const readStorage = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    {
                        title: I18n.t(TextKey.storagePermissionAlertTitle),
                        message: I18n.t(TextKey.storagePermissionAlertMessage),
                        buttonPositive: I18n.t(TextKey.permissionAlertButtonPositive),
                    }
                );
                const writeStorage = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: I18n.t(TextKey.storagePermissionAlertTitle),
                        message: I18n.t(TextKey.storagePermissionAlertMessage),
                        buttonPositive: I18n.t(TextKey.permissionAlertButtonPositive),
                    }
                );

                if (readStorage === PermissionsAndroid.RESULTS.GRANTED && writeStorage === PermissionsAndroid.RESULTS.GRANTED) {
                    return true;
                } else if (readStorage === PermissionsAndroid.RESULTS.DENIED || writeStorage === PermissionsAndroid.RESULTS.DENIED) {
                    return false;
                } else if (readStorage === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN || writeStorage === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                    Alert.alert(
                        I18n.t(TextKey.storagePermissionAlertTitle),
                        I18n.t(TextKey.storagePermissionAlertDeniedMessage),
                        [
                            { text: I18n.t(TextKey.permissionAlertOpenSettings), onPress: () => Linking.openSettings() },
                            { text: I18n.t(TextKey.permissionAlertCloseDialog), style: 'cancel' }
                        ]
                    );
                    return false;
                }
            } else if (Platform.Version >= 33) {
                // For Android 13+ (API 33+)
                const accessImage = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                    {
                        title: I18n.t(TextKey.storagePermissionAlertTitle),
                        message: I18n.t(TextKey.storagePermissionAlertMessage),
                        buttonPositive: I18n.t(TextKey.permissionAlertButtonPositive),
                    }
                );
                const accessVideo = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
                    {
                        title: I18n.t(TextKey.storagePermissionAlertTitle),
                        message: I18n.t(TextKey.storagePermissionAlertMessage),
                        buttonPositive: I18n.t(TextKey.permissionAlertButtonPositive),
                    }
                );

                if (accessImage === PermissionsAndroid.RESULTS.GRANTED && accessVideo === PermissionsAndroid.RESULTS.GRANTED) {
                    return true;
                } else if (accessImage === PermissionsAndroid.RESULTS.DENIED || accessVideo === PermissionsAndroid.RESULTS.DENIED) {
                    return false;
                } else if (accessImage === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN || accessVideo === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                    Alert.alert(
                        I18n.t(TextKey.storagePermissionAlertTitle),
                        I18n.t(TextKey.storagePermissionAlertDeniedMessage),
                        [
                            { text: I18n.t(TextKey.permissionAlertOpenSettings), onPress: () => Linking.openSettings() },
                            { text: I18n.t(TextKey.permissionAlertCloseDialog), style: 'cancel' }
                        ]
                    );
                    return false;
                }
            } else {
                // For Android 10+ (API 29-32)
                const readStorage = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    {
                        title: I18n.t(TextKey.storagePermissionAlertTitle),
                        message: I18n.t(TextKey.storagePermissionAlertMessage),
                        buttonPositive: I18n.t(TextKey.permissionAlertButtonPositive),
                    }
                );

                if (readStorage === PermissionsAndroid.RESULTS.GRANTED) {
                    return true;
                } else if (readStorage === PermissionsAndroid.RESULTS.DENIED) {
                    return false;
                } else if (readStorage === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                    Alert.alert(
                        I18n.t(TextKey.storagePermissionAlertTitle),
                        I18n.t(TextKey.storagePermissionAlertDeniedMessage),
                        [
                            { text: I18n.t(TextKey.permissionAlertOpenSettings), onPress: () => Linking.openSettings() },
                            { text: I18n.t(TextKey.permissionAlertCloseDialog), style: 'cancel' }
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
