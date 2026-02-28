import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Back, BackNight } from 'assets/images';
import { NavigateBack } from 'helper/navigationHandlers/ExtraNavigationHandlers';
import CustomTextNunito from './CustomTextNunito';
import { useTheme } from 'context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

const ComplementaryHeader = ({title}) => {
    const { theme, isDarkMode } = useTheme();
    const navigation = useNavigation();


    const styles = createStyles(theme);

    return (
        <View style={styles.headerContainer}>
            <View style={styles.itemsLeft}>
                <TouchableOpacity onPress={() => NavigateBack(navigation)}>
                    <Image source={isDarkMode ? BackNight : Back} style={{ width: 40, height: 40 }} />
                </TouchableOpacity>
                <CustomTextNunito weight='Bold' style={{fontSize: 18, color: theme.colors.primary, marginLeft: 12}}>{title}</CustomTextNunito>
            </View>
        </View>
    );
};

const createStyles = (theme) => StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        height: 90,
        backgroundColor: theme.colors.background,
        borderBottomWidth: 0,
    },
    backButton: {
        fontSize: 18,
        color: '#007AFF',
    },
    itemsLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default ComplementaryHeader;
