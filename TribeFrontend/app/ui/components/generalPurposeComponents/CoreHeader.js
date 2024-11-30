import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Lamp, Aa, SettingFill, ChartPin, SignInSquare } from 'assets/images';
import { navigateToNotifications, navigateToUserProfile, navigateToWelcome } from 'helper/navigationHandlers/CoreNavigationHandlers';
import CustomTextNunito from './CustomTextNunito';
import { useTheme } from 'context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import PopupMenu from 'ui/components/generalPurposeComponents/PopupMenu';
import CoreMenuOptionsList from 'ui/components/generalPurposeComponents/CoreMenuOptionsList';
import Separator from 'ui/components/generalPurposeComponents/Separator';

import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

const CoreHeader = () => {
    const { theme, isDarkMode } = useTheme();
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
                            <Image source={theme.UserCircleLight} style={{ width: 50, height: 50 }} />
                        </TouchableOpacity>
                        <CustomTextNunito weight='Light' style={{fontSize: 16, color: theme.colors.primary, marginLeft: 4}}>{I18n.t(TextKey.headerTitle)}</CustomTextNunito>
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

        paddingHorizontal: 16,
        paddingVertical: 10,
 
        backgroundColor: theme.colors.background,
    },
    backButton: {
        fontSize: 18,
        color: '#007AFF',
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
