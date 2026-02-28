import { PermissionsAndroid, Platform, Alert, Linking, ActionSheetIOS } from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import { requestLocationPermission } from 'helper/permissionHandlers/LocationPermission';
import { requestExternalStoragePermission } from 'helper/permissionHandlers/StoragePermission';

import { getLocation } from 'helper/LocationHelper';
import { createPost } from 'networking/api/postsApi';

import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

// Select media (images or videos) from gallery using ImageCropPicker
const selectFromGallery = async (selectedMedia, setSelectedMedia, mediaType = 'any', selectionLimit = 5) => {
    const hasPermission = await requestExternalStoragePermission();

    if (hasPermission) {
        try {
            const response = await ImageCropPicker.openPicker({
                multiple: true,
                maxFiles: selectionLimit,
                mediaType: mediaType === 'mixed' ? 'any' : mediaType,
                compressImageQuality: 0.8,
                compressVideoPreset: 'MediumQuality',
            });

            if (response && response.length > 0) {
                const newAssets = response.map(asset => ({ 
                    uri: asset.path, 
                    type: asset.mime || 'image/jpeg',
                    fileName: asset.filename || asset.path.split('/').pop(),
                    width: asset.width,
                    height: asset.height,
                }));
                setSelectedMedia(prevMedia => [...prevMedia, ...newAssets]);
            }
        } catch (error) {
            if (error.code !== 'E_PICKER_CANCELLED') {
                console.error('Gallery error:', error);
                Alert.alert(I18n.t(TextKey.Error), error.message);
            }
        }
    } else {
        Alert.alert(I18n.t(TextKey.multimediaHelperPermissionDenied), I18n.t(TextKey.multimediaHelperStoragePermissionDeniedMessage));
    }
};

// Open camera - this function now returns true to signal that the camera screen should be opened
// The actual camera handling is done by the CameraScreen component using react-native-vision-camera
const openCamera = async (selectedMedia, setSelectedMedia, setCameraVisible) => {
    // Simply show the camera screen - permissions are handled by react-native-vision-camera
    if (setCameraVisible) {
        setCameraVisible(true);
    }
    return true;
};

// Handle media captured from CameraScreen
const handleCameraCapture = (capturedMedia, selectedMedia, setSelectedMedia) => {
    if (capturedMedia && capturedMedia.length > 0) {
        setSelectedMedia([...selectedMedia, ...capturedMedia]);
    }
};

const handleLocationToggle = async (checkboxSelection, setCheckboxSelection) => {
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
        setCheckboxSelection(!checkboxSelection); // Toggle the checkbox only if permission is granted
    } else {
        Alert.alert(
            I18n.t(TextKey.multimediaHelperPermissionDenied), 
            I18n.t(TextKey.multimediaHelperLocationPermissionDeniedMessage),
            [
                { text: I18n.t(TextKey.multimediaHelperChooseMediaClose), style: 'cancel' }
            ]
        );
    }
};

export { selectFromGallery, openCamera, handleLocationToggle, handleCameraCapture };
