import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { BellFill, BellPinFill, Menu, UserCircleLight } from 'assets/images';
import { Lamp, Aa, SettingFill, ChartPin, SignInSquare } from 'assets/images';
import { NavigateToNotifications, NavigateToUserProfile } from 'helper/navigationHandlers/CoreNavigationHandlers';
import CustomTextNunito from './CustomTextNunito';
import { useTheme } from 'context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import PopupMenu from 'ui/components/generalPurposeComponents/PopupMenu';

import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

import { useUiContext } from 'context/UiContext';

const CoreHeader = () => {
    const { theme } = useTheme();
    const { showMenu, hideMenu, isMenuVisible, menuOptions } = useUiContext();
    const navigation = useNavigation();

    const openMenu = () => {
      showMenu([
        { icon: Lamp, label: I18n.t(TextKey.settingsOptionTheme), onPress: () => console.log('Option A Selected') },
        { icon: Aa, label: I18n.t(TextKey.settingsOptionLanguage), onPress: () => console.log('Option B Selected') },
        { icon: SettingFill, label: I18n.t(TextKey.settingsOptionAccountOptions), onPress: () => console.log('Option B Selected') },
        { icon: ChartPin, label: I18n.t(TextKey.settingsOptionMetrics), onPress: () => console.log('Option B Selected') },
        { icon: SignInSquare, label: I18n.t(TextKey.settingsOptionLogout), onPress: () => console.log('Option B Selected') },
      ], I18n.t(TextKey.settingsTitle));
    };

    const styles = createStyles(theme);

    return (
        <View>
            <View style={[styles.headerContainer]}>
                <View style={styles.itemsLeft}>
                    <TouchableOpacity onPress={() => NavigateToUserProfile(navigation)}>
                        <Image source={UserCircleLight} style={{ width: 50, height: 50 }} />
                    </TouchableOpacity>
                    <CustomTextNunito weight='Light' style={{fontSize: 16, color: theme.colors.primary, marginLeft: 4}}>{I18n.t(TextKey.headerTitle)}John</CustomTextNunito>
                </View>
                <View style={styles.itemsRight}>
                    <TouchableOpacity onPress={() => NavigateToNotifications(navigation)}>
                        <Image source={BellFill} style={{ width: 28, height: 28, marginRight: 12 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={openMenu}>
                        <Image source={Menu} style={{ width: 28, height: 28 }} />
                    </TouchableOpacity> 
                </View>
            </View>
            <View style={[styles.separator]}></View>
            {isMenuVisible && (
                    <PopupMenu
                    visible={isMenuVisible}
                    onClose={hideMenu}
                    options={menuOptions}
                    />
                )}
        </View>
    );
};

const createStyles = (theme) => StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
        height: 90,
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
    separator : {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.primary,
        marginHorizontal: 16,
    }
});

export default CoreHeader;
