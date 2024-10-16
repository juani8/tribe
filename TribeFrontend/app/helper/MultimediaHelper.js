import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { requestLocationPermission } from 'helper/permissionHandlers/LocationPermission';
import { requestCameraPermission } from 'helper/permissionHandlers/CameraPermission';
import { requestExternalStoragePermission } from 'helper/permissionHandlers/StoragePermission';
import { requestMicrophonePermission } from 'helper/permissionHandlers/MicrophonePermission';

// Select media (images or videos) from gallery
const selectFromGallery = async (selectedMedia, setSelectedMedia, mediaType = 'mixed') => {
    const hasPermission = await requestExternalStoragePermission();

    if (hasPermission) {
        launchImageLibrary(
            { mediaType, selectionLimit: 5 },
            (response) => {
                if (response.didCancel) {
                    console.log('User cancelled media selection');
                } else if (response.errorCode) {
                    Alert.alert('Error', response.errorMessage);
                } else {
                    const assets = response.assets || [];
                    setSelectedMedia([...selectedMedia, ...assets.map(asset => ({ uri: asset.uri, type: asset.type }))]);
                }
            }
        );
    } else {
        Alert.alert('Permission denied', 'App needs storage permission to access media.');
    }
};

// Open camera for media capture (photo or video)
const openCamera = async (selectedMedia, setSelectedMedia) => {
    const hasCameraPermission = await requestCameraPermission() 
    const hasMicrophonePermission = await requestMicrophonePermission();

    if (hasCameraPermission && hasMicrophonePermission) {
        // Ask the user to choose between photo or video
        Alert.alert(
            'Choose Media Type',
            'Would you like to take a photo or record a video?',
            [
                { text: 'Take Photo', onPress: () => captureMedia('photo', selectedMedia, setSelectedMedia) },
                { text: 'Record Video', onPress: () => captureMedia('video', selectedMedia, setSelectedMedia) },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    } else {
        Alert.alert('Permission denied', 'App needs camera permission to take photos or videos.');
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
            Alert.alert('Error', response.errorMessage);
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
            'Permission denied', 
            'App needs location permission to add location.',
            [
                { text: 'Close', style: 'cancel' }
            ]
        );
    }
};


export { selectFromGallery, openCamera, handleLocationToggle };
