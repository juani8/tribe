import React from 'react';
import { View, Text, Button } from 'react-native';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

export default function WelcomeScreen({ navigation }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>{I18n.t(TextKey.welcomeMessage)}</Text>
            <Button
                title={I18n.t(TextKey.welcomeGoToLoginButton)}
                onPress={() => navigation.navigate(I18n.t(TextKey.authNavegation))}
            />
        </View>
    );
}