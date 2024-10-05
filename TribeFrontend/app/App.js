import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import WelcomeScreen from 'ui/screens/WelcomeScreen';
import AuthScreen from 'ui/screens/AuthScreen';
import TimelineScreen from 'ui/screens/TimelineScreen';
import UploadScreen from 'ui/screens/UploadScreen';
import SearchScreen from 'ui/screens/SearchScreen';

import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabBar() {
    return (
        <Tab.Navigator>
            <Tab.Screen name={I18n.t(TextKey.homeNavegation)} component={TimelineScreen} options={{ headerShown: false }} />
            <Tab.Screen name={I18n.t(TextKey.uploadNavegation)} component={UploadScreen} options={{ headerShown: false }} />
            <Tab.Screen name={I18n.t(TextKey.searchNavegation)} component={SearchScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
}

function MainStack() {
    return (
        <>
            <Stack.Navigator>
                <Stack.Screen name={I18n.t(TextKey.welcomeNavegation)} component={WelcomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name={I18n.t(TextKey.authNavegation)} component={AuthScreen} options={{ headerShown: false }} />
                <Stack.Screen name={I18n.t(TextKey.mainNavegation)} component={TabBar} options={{ headerShown: false }} />
            </Stack.Navigator>
        </>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <MainStack />
        </NavigationContainer>
    );
}
