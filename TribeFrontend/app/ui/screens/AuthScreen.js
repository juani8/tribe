import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export default function AuthScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Implement login functionality
        navigation.navigate('Principal');
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Login Screen</Text>
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
}
