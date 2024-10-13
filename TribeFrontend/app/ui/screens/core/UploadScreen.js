import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, Alert, Keyboard, PermissionsAndroid, KeyboardAvoidingView, Platform, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import { Back } from 'assets/images';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import CustomInputNunito from 'ui/components/generalPurposeComponents/CustomInputNunito';
import CustomButton from 'ui/components/generalPurposeComponents/CustomButton';
import { useTheme } from 'context/ThemeContext';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import CheckBox from '@react-native-community/checkbox';

export default function UploadScreen() {
    const [commentText, setCommentText] = useState('');
    const [selectedMedia, setSelectedMedia] = useState([]);
    const { theme } = useTheme();
    const [isCheckboxSelected, setCheckboxSelection] = useState(false);

    const styles = createStyles(theme);

    // Request permissions for camera and external storage
    const requestPermission = async (permissionType, rationale) => {
        try {
            const granted = await PermissionsAndroid.request(permissionType, rationale);
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn(err);
            return false;
        }
    };

    // Function to request external storage permission
    const requestExternalStoragePermission = async () => {
        if (Platform.OS === 'android' && Platform.Version < 29) {
            // Request read and write permissions for Android below API 29
            const readGranted = await requestPermission(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
                title: 'App Storage Permission',
                message: 'App needs access to your storage to select media',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            });
            const writeGranted = await requestPermission(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
                title: 'App Storage Permission',
                message: 'App needs access to your storage to select media',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            });
            return readGranted && writeGranted;
        } else if (Platform.OS === 'android') {
            // For Android 10 and above, request only read permission
            return await requestPermission(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
                title: 'App Storage Permission',
                message: 'App needs access to your storage to select media',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            });
        }
        return true;
    };

    // Function to select media from gallery
    const selectFromGallery = async () => {
        if (Platform.OS === 'android') {
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
        }
    };

    // Function to open the camera for media capture
    const openCamera = async () => {
        const hasPermission = await requestPermission(PermissionsAndroid.PERMISSIONS.CAMERA, {
            title: 'App Camera Permission',
            message: 'App needs access to your camera',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
        });

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

    // Function to remove selected media
    const removeMedia = (uri) => {
        setSelectedMedia(selectedMedia.filter(item => item.uri !== uri));
    };

    // Function to dismiss keyboard when touching outside the input
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <ScrollView 
                style={[styles.container, { backgroundColor: theme.colors.background }]}
                contentContainerStyle={{ alignItems: 'flex-start', justifyContent: 'flex-start', gap: 30 }}
            >
                {/* Display selected content */}
                {selectedMedia.length > 0 && (
                    <View>
                        <CustomTextNunito style={{fontSize: 20}}>{I18n.t(TextKey.uploadSelectedContent)}</CustomTextNunito>
                        <View style={styles.mediaContainer}>
                            {selectedMedia.map((media, index) => (
                                <View key={index} style={styles.mediaItem}>
                                    <Image source={{ uri: media.uri }} style={styles.mediaThumbnail} />
                                    <TouchableOpacity style={styles.removeButton} onPress={() => removeMedia(media.uri)}>
                                        <CustomTextNunito weight={'Bold'} style={{color:theme.colors.background, marginTop: -4}}>x</CustomTextNunito>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
                <View>
                    <CustomTextNunito style={{fontSize: 20}}>{selectedMedia.length > 0 ? I18n.t(TextKey.uploadMoreMessage) : I18n.t(TextKey.uploadMessage)}</CustomTextNunito>
                    <View style={{ width: '100%', alignItems:'center', justifyContent: 'center', gap: 10, marginTop: 10}}>
                        {/* Buttons for selecting from gallery and opening camera */}
                        <CustomButton 
                            title={I18n.t(TextKey.uploadSelectFromGallery)} 
                            onPress={selectFromGallery} 
                            color={theme.colors.detailText} 
                            textWeight={'Bold'}
                            fullSize={true} 
                            style={styles.button} 
                        />
                        <CustomButton 
                            title={I18n.t(TextKey.uploadSelectOpenCamera)} 
                            onPress={openCamera} 
                            color={theme.colors.detailText} 
                            textWeight={'Bold'}
                            fullSize={true} 
                            style={styles.button} 
                        />
                    </View>
                </View>

                <View style={{gap:6}}>
                    {/* Description Input */}
                    <CustomTextNunito style={{fontSize: 20}}>Descripción</CustomTextNunito>
                    <View>
                        <CustomInputNunito
                            inputText={commentText}
                            setInputText={setCommentText}
                            placeholder={I18n.t(TextKey.uploadDescriptionPlaceholder)}
                        />
                    </View>
                </View>

                <View style={{flexDirection:'row', alignItems:'center'}}>
                    {/* Add Location Button */}
                    <CheckBox
                        value={isCheckboxSelected}
                        onValueChange={setCheckboxSelection}
                        tintColors={{ true: theme.colors.primary, false: theme.colors.primary }} // Green when checked, red when unchecked
                    />
                    <CustomTextNunito onPress={() => setCheckboxSelection(!isCheckboxSelected)}>{I18n.t(TextKey.uploadAddLocation)}</CustomTextNunito>
                </View>
                <View style={{ width: '100%', alignItems:'center', justifyContent: 'center', gap: 10, marginTop: 10}}>
                    <CustomButton title={I18n.t(TextKey.uploadConfirmation)} normalizedSize={true} style={[styles.button, { alignSelf: 'flex-start' }]} locked={selectedMedia.length > 0 ? false : true} />
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}

// Styles for the UploadScreen
const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 18,
        paddingVertical: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    mediaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    mediaItem: {
        position: 'relative',
        marginRight: 10,
        marginBottom: 10,
    },
    mediaThumbnail: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    removeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: theme.colors.primary,
        borderRadius: 100,
        paddingHorizontal: 5,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.colors.background,
    },
    removeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    button: {
        marginVertical: 10,
    },
});
