import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, Alert, Keyboard, PermissionsAndroid, KeyboardAvoidingView, Platform, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import { Back } from 'assets/images';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import CustomInputNunito from 'ui/components/generalPurposeComponents/CustomInputNunito';
import CustomButton from 'ui/components/generalPurposeComponents/CustomButton';
import { useTheme } from 'context/ThemeContext';
import { selectFromGallery, openCamera, handleLocationToggle } from 'helper/MultimediaHelper';
import CheckBox from '@react-native-community/checkbox';
import Video from 'react-native-video';

export default function UploadScreen() {
    const [commentText, setCommentText] = useState('');
    const [selectedMedia, setSelectedMedia] = useState([]);
    const { theme } = useTheme();
    const [checkboxSelection, setCheckboxSelection] = useState(false);

    const styles = createStyles(theme);

    
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
                contentContainerStyle={{ alignItems: 'flex-start', justifyContent: 'flex-start', gap: 25 }}
            >
                {selectedMedia.length > 0 && (
                    <View>
                        <CustomTextNunito style={{fontSize: 20}}>{I18n.t(TextKey.uploadSelectedContent)}</CustomTextNunito>
                        <ScrollView 
                            horizontal 
                            style={[styles.mediaContainer, { flexGrow: 0 }]}
                        >
                            {selectedMedia.map((media, index) => (
                                <View key={index} style={styles.mediaItem}>
                                    {media.type.startsWith('image') ? (
                                        <Image source={{ uri: media.uri }} style={styles.mediaThumbnail} />
                                    ) : (
                                        <Video 
                                            source={{ uri: media.uri }}
                                            style={styles.mediaThumbnail}
                                            resizeMode="cover"
                                            paused={true} // To show a thumbnail preview without auto-playing
                                        />
                                    )}
                                    <TouchableOpacity 
                                        style={styles.removeButton} 
                                        onPress={() => removeMedia(media.uri)}
                                    >
                                        <CustomTextNunito 
                                            weight={'Bold'} 
                                            style={{ color: theme.colors.background, marginTop: -4 }}
                                        >
                                            x
                                        </CustomTextNunito>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )}
                <View>
                    <CustomTextNunito style={{fontSize: 20}}>{selectedMedia.length > 0 ? I18n.t(TextKey.uploadMoreMessage) : I18n.t(TextKey.uploadMessage)}</CustomTextNunito>
                    <View style={{ width: '100%', alignItems:'center', justifyContent: 'center', gap: 10, marginTop: 10}}>
                        {/* Buttons for selecting from gallery and opening camera */}
                        <CustomButton 
                            title={I18n.t(TextKey.uploadSelectFromGallery)} 
                            onPress={() => selectFromGallery(selectedMedia, setSelectedMedia)} 
                            color={theme.colors.tertiary} 
                            textWeight={'Bold'}
                            fullSize={true} 
                            style={styles.button} 
                        />
                        <CustomButton 
                            title={I18n.t(TextKey.uploadSelectOpenCamera)} 
                            onPress={() => openCamera(selectedMedia, setSelectedMedia)} 
                            color={theme.colors.tertiary} 
                            textWeight={'Bold'}
                            fullSize={true} 
                            style={styles.button} 
                        />
                    </View>
                </View>

                <View style={{gap:6}}>
                    {/* Description Input */}
                    <CustomTextNunito style={{fontSize: 20}}>{I18n.t(TextKey.uploadDescriptionTitle)}</CustomTextNunito>
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
                        value={checkboxSelection}
                        onValueChange={() => handleLocationToggle(checkboxSelection, setCheckboxSelection)}
                        tintColors={{ true: theme.colors.primary, false: theme.colors.primary }}
                    />
                    <CustomTextNunito onPress={() => handleLocationToggle(checkboxSelection, setCheckboxSelection)}>{I18n.t(TextKey.uploadAddLocation)}</CustomTextNunito>
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