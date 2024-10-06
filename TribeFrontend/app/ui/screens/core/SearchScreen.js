import React from 'react';
import { View, Text } from 'react-native';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

export default function SearchScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>{I18n.t(TextKey.searchTitle)}</Text>
            <Text>{I18n.t(TextKey.searchMessage)}</Text>
        </View>
    );
}