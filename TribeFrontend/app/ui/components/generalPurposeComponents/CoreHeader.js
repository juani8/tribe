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

    // Handlers for menu visibility
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    const styles = createStyles(theme);

    return (
        <View>
            <View style={[styles.headerContainer]}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: 90,
                }}>
                    <View style={styles.itemsLeft}>
                        <TouchableOpacity onPress={() => navigateToUserProfile(navigation)}>
                            <Image source={{ uri: user.profileImage ? user.profileImage : theme.UserCircleLight }} style={{ width: 50, height: 50, borderRadius: 100 }} />
                        </TouchableOpacity>
                        <CustomTextNunito weight='Light' style={{fontSize: 16, color: theme.colors.primary, marginLeft: 8}}>{`${I18n.t(TextKey.headerTitle)}, ${user.nickName}`}</CustomTextNunito>
                    </View>
                    <View style={styles.itemsRight}>
                        <TouchableOpacity onPress={() => navigateToNotifications(navigation)}>
                            <Image source={theme.BellFill} style={{ width: 28, height: 28, marginRight: 12 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={openMenu}>
                            <Image source={theme.Menu} style={{ width: 28, height: 28 }} />
                        </TouchableOpacity> 
                    </View>
                </View>

                <Separator style={{marginHorizontal: -2}} />
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
        paddingHorizontal: 20,
        backgroundColor: theme.colors.background,
        paddingTop: 10,
    },
    itemsLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemsRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default CoreHeader;