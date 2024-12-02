import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import Search from 'assets/images/icons/Search.png'; 
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

export default function SearchScreen() {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        console.log('Buscar:', searchQuery);
    };

    return (
        <View style={styles.container}>
            {/* Barra de búsqueda */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={I18n.t(TextKey.searchPlaceholder)}
                    placeholderTextColor={theme.colors.detailText}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
               <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Image
                        source={Search}
                        style={{width: 24, height: 24}} 
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: 20,
        paddingTop: 20, 
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    input: {
        flex: 1,
        height: 40,
        color: theme.colors.text,
        fontSize: 16,
        fontFamily: 'Nunito-Regular',
    },
    searchButton: {
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.primary,
        overflow: 'hidden',
    },
    searchIcon: {
        width: 24,
        height: 24,
        tintColor: theme.colors.buttonText,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
});







