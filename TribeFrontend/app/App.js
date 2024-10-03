import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import WelcomeScreen from 'ui/screens/WelcomeScreen';
import AuthScreen from 'ui/screens/AuthScreen';
import TimelineScreen from 'ui/screens/TimelineScreen';
import UploadScreen from 'ui/screens/UploadScreen';
import SearchScreen from 'ui/screens/SearchScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabBar() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Inicio" component={TimelineScreen} />
            <Tab.Screen name="Subir" component={UploadScreen} />
            <Tab.Screen name="Buscar" component={SearchScreen} />
        </Tab.Navigator>
    );
}

function MainStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Bienvenido" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Autenticacion" component={AuthScreen} options={{ headerShown: false }} />
            {/* The TabBar will appear only after login (i.e. after Welcome and Auth screens) */}
            <Stack.Screen name="Principal" component={TabBar} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <MainStack />
        </NavigationContainer>
    );
}
