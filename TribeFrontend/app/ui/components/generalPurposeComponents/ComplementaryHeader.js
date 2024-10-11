import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Back } from 'assets/images';
import { NavigateBack } from 'helper/navigationHandlers/ExtraNavigationHandlers';
import CustomTextNunito from './CustomTextNunito';
import { useTheme } from 'context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import PopupMenu from 'ui/components/generalPurposeComponents/PopupMenu';

import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

const ComplementaryHeader = ({title}) => {
    const { theme } = useTheme();
    const navigation = useNavigation();


    const styles = createStyles(theme);

    return (
        <View>
            <View style={[styles.headerContainer]}>
                <View style={styles.itemsLeft}>
                    <TouchableOpacity onPress={() => NavigateBack(navigation)}>
                        <Image source={Back} style={{ width: 40, height: 40 }} />
                    </TouchableOpacity>
                    <CustomTextNunito weight='Bold' style={{fontSize: 18, color: theme.colors.primary, marginLeft: 12}}>{title}</CustomTextNunito>
                </View>
            </View>
            <View style={[styles.separator]}></View>
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
    separator : {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.primary,
        marginHorizontal: 16,
    }
});

export default ComplementaryHeader;
