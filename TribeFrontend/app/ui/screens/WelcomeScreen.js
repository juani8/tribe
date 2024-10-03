import React from 'react';
import { View, Text, Button } from 'react-native';

export default function WelcomeScreen({ navigation }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Welcome to the App!</Text>
            <Button
                title="Go to Login"
                onPress={() => navigation.navigate('Autenticacion')}
            />
        </View>
    );
}