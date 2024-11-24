import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { requestLocationPermission } from 'helper/permissionHandlers/LocationPermission';
import { requestCameraPermission } from 'helper/permissionHandlers/CameraPermission';
import { requestExternalStoragePermission } from 'helper/permissionHandlers/StoragePermission';
import { requestMicrophonePermission } from 'helper/permissionHandlers/MicrophonePermission';

import { getLocation } from 'helper/LocationHelper';
import { createPost } from 'networking/api/postsApi';

import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

// Select media (images or videos) from gallery
const selectFromGallery = async (selectedMedia, setSelectedMedia, mediaType = 'mixed') => {
    const hasPermission = await requestExternalStoragePermission();

    if (hasPermission) {
        launchImageLibrary(
            { mediaType, selectionLimit: 5 },
            (response) => {
                if (response.didCancel) {
                    console.log('User cancelled gallery picker');
                } else if (response.errorCode) {
                    Alert.alert(I18n.t(TextKey.Error), response.errorMessage);
                } else {
                    const assets = response.assets || [];
                    setSelectedMedia([...selectedMedia, ...assets.map(asset => ({ uri: asset.uri, type: asset.type }))]);
                }
            }
        );
    } else {
        Alert.alert(I18n.t(TextKey.multimediaHelperPermissionDenied), I18n.t(TextKey.multimediaHelperStoragePermissionDeniedMessage));
    }
};

// Open camera for media capture (photo or video)
const openCamera = async (selectedMedia, setSelectedMedia) => {
    const hasCameraPermission = await requestCameraPermission();
    const hasMicrophonePermission = await requestMicrophonePermission();

    if (hasCameraPermission && hasMicrophonePermission) {
        // Ask the user to choose between photo or video
        Alert.alert(
            I18n.t(TextKey.multimediaHelperChooseMediaTypeTitle),
            I18n.t(TextKey.multimediaHelperChooseMediaTypeMessage),
            [
                { text: I18n.t(TextKey.multimediaHelperChooseMediaPhoto), onPress: () => captureMedia('photo', selectedMedia, setSelectedMedia) },
                { text: I18n.t(TextKey.multimediaHelperChooseMediaVideo), onPress: () => captureMedia('video', selectedMedia, setSelectedMedia) },
                { text: I18n.t(TextKey.multimediaHelperChooseMediaCancel), style: 'cancel' }
            ]
        );
    } else {
        Alert.alert(I18n.t(TextKey.multimediaHelperPermissionDenied), I18n.t(TextKey.multimediaHelperCameraPermissionDeniedMessage));
    }
};

const captureMedia = (mediaType, selectedMedia, setSelectedMedia) => {
    const options = mediaType === 'photo'
        ? { mediaType: 'photo' }
        : { mediaType: 'video', videoQuality: 'low', durationLimit: 30 }; // Try lowering the quality and duration

    launchCamera(options, (response) => {
        console.log('Response:', response); // Log the response to inspect issues
        
        if (response.didCancel) {
            console.log('User cancelled camera');
        } else if (response.errorCode) {
            Alert.alert(I18n.t(TextKey.Error), response.errorMessage);
        } else {
            const assets = response.assets || [];
            if (assets.length > 0) {
                setSelectedMedia([...selectedMedia, ...assets.map(asset => ({ uri: asset.uri, type: asset.type }))]);
            } else {
                console.log('No assets returned from camera');
            }
        }
    });
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

const handleCreatePost = async ({ selectedMedia, setSelectedMedia, commentText, setCommentText, checkboxSelection, setCheckboxSelection }) => {
    // Check if there is any media selected
    if (selectedMedia.length === 0) {
        return;
    } else {
        // Create the post with the selected media
        try {
            const postMedia = selectedMedia;
            const postComment = (commentText.trim().length > 0) ? commentText : null;
            const { latitude, longitude } = checkboxSelection ? await getLocation() : { latitude: null, longitude: null };
            
            const postData = { 
                multimedia: postMedia, 
                description: postComment, 
                latitude: latitude, 
                longitude: longitude 
            };

            // Send the post data to the backend
            await createPost(postData);

            // Reset the states
            setSelectedMedia([]);
            setCommentText('');
            setCheckboxSelection(false);
        } catch (error) {
            console.error(error);
        }
    }
};

export { selectFromGallery, openCamera, handleLocationToggle, handleCreatePost };
