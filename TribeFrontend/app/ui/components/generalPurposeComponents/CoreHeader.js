import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'context/ThemeContext';
import { useUserContext } from 'context/UserContext';
import { navigateToUserProfile, navigateToNotifications } from 'helper/navigationHandlers/CoreNavigationHandlers';
import CustomTextNunito from './CustomTextNunito';
import Separator from 'ui/components/generalPurposeComponents/Separator';
import PopupMenu from 'ui/components/generalPurposeComponents/PopupMenu';
import CoreMenuOptionsList from 'ui/components/generalPurposeComponents/CoreMenuOptionsList';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

const CoreHeader = () => {
    const { theme } = useTheme();
    const { user } = useUserContext();
    const [isMenuVisible, setMenuVisible] = useState(false);
    const navigation = useNavigation();

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    const styles = createStyles(theme);

    return (
        <View>
            <View style={styles.headerContainer}>
                <View style={styles.headerContent}>
                    <TouchableOpacity 
                        onPress={() => navigateToUserProfile(navigation)}
                        style={styles.profileSection}
                        activeOpacity={0.7}
                    >
                        <View style={styles.avatarWrapper}>
                            <Image 
                                source={{ uri: user?.profileImage || undefined }} 
                                defaultSource={theme.UserCircleLight}
                                style={styles.avatar} 
                            />
                            <View style={styles.onlineIndicator} />
                        </View>
                        <View style={styles.greetingContainer}>
                            <CustomTextNunito style={styles.greetingText}>
                                {I18n.t(TextKey.headerTitle)}
                            </CustomTextNunito>
                            <CustomTextNunito weight='SemiBold' style={styles.nicknameText}>
                                {user?.nickName || 'Usuario'}
                            </CustomTextNunito>
                        </View>
                    </TouchableOpacity>
                    
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity 
                            onPress={() => navigateToNotifications(navigation)}
                            style={styles.iconButton}
                            activeOpacity={0.7}
                        >
                            <Image source={theme.BellFill} style={styles.icon} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={openMenu}
                            style={styles.iconButton}
                            activeOpacity={0.7}
                        >
                            <Image source={theme.Menu} style={styles.icon} />
                        </TouchableOpacity> 
                    </View>
                </View>
            </View>

            <PopupMenu
                visible={isMenuVisible}
                onClose={closeMenu}
                title={I18n.t(TextKey.settingsTitle)}
            >
                <CoreMenuOptionsList onClose={closeMenu} />
            </PopupMenu>
        </View>
    );
};

const createStyles = (theme) => StyleSheet.create({
    headerContainer: {
        paddingHorizontal: 16,
        backgroundColor: theme.colors.background,
        paddingTop: 12,
        paddingBottom: 12,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatar: {
        width: 46,
        height: 46,
        borderRadius: 23,
        borderWidth: 2,
        borderColor: theme.colors.primary,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#22c55e',
        borderWidth: 2,
        borderColor: theme.colors.background,
    },
    greetingContainer: {
        marginLeft: 12,
    },
    greetingText: {
        fontSize: 13,
        color: theme.colors.detailText,
    },
    nicknameText: {
        fontSize: 16,
        color: theme.colors.text,
        marginTop: 1,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    iconButton: {
        padding: 10,
        borderRadius: 12,
        backgroundColor: theme.colors.card || theme.colors.surface || 'rgba(0,0,0,0.03)',
    },
    icon: {
        width: 22,
        height: 22,
    },
});

export default CoreHeader;