import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

export default function AuthScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Implement login functionality
        navigation.navigate(I18n.t(TextKey.mainNavegation));
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>{I18n.t(TextKey.loginTitle)}</Text>
            <Text>{I18n.t(TextKey.loginMessage)}</Text>
            <Button title={I18n.t(TextKey.loginButton)} onPress={handleLogin} />
        </View>
    );
}