import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CoreHeader from 'ui/components/generalPurposeComponents/CoreHeader';

import WelcomeScreen from 'ui/screens/WelcomeScreen';
import TimelineScreen from 'ui/screens/core/TimelineScreen';
import UploadScreen from 'ui/screens/core/UploadScreen';
import SearchScreen from 'ui/screens/core/SearchScreen';

import LoginScreen from 'ui/screens/auth/LoginScreen';
import SignupScreen from 'ui/screens/auth/SignupScreen';
import RecoverPasswordScreen from 'ui/screens/auth/RecoverPasswordScreen';
import VerifyIdentityScreen from 'ui/screens/auth/VerifyIdentityScreen';
import InitialConfigurationScreen from './ui/screens/auth/InitialConfigurationScreen';

import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

import { ThemeProvider } from 'context/ThemeContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabBar() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Home"
                component={TimelineScreen}
                options={{ headerShown: false, title: I18n.t(TextKey.homeNavegation) }}
            />
            <Tab.Screen
                name="Upload"
                component={UploadScreen}
                options={{ headerShown: false, title: I18n.t(TextKey.uploadNavegation) }}
            />
            <Tab.Screen
                name="Search"
                component={SearchScreen}
                options={{ headerShown: false, title: I18n.t(TextKey.searchNavegation) }}
            />
        </Tab.Navigator>
    );
}

function MainStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Welcome"
                component={WelcomeScreen}
                options={{ headerShown: false, title: I18n.t(TextKey.welcomeNavegation) }}
            />

            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false, title: I18n.t(TextKey.loginNavegation) }}
            />

            <Stack.Screen
                name="Signup"
                component={SignupScreen}
                options={{ headerShown: false, title: I18n.t(TextKey.signupNavegation) }}
            />

            <Stack.Screen
                name="RecoverPassword"
                component={RecoverPasswordScreen}
                options={{ headerShown: false, title: I18n.t(TextKey.recoverPasswordNavigation) }}
            />

            <Stack.Screen
                name="VerifyIdentity"
                component={VerifyIdentityScreen}
                options={{ headerShown: false, title: I18n.t(TextKey.verifyIdentityNavigation) }}
            />

            <Stack.Screen
                name="InitialConfiguration"
                component={InitialConfigurationScreen}
                options={{ headerShown: false, title: I18n.t(TextKey.initialConfigurationNavigation) }}
            />

            <Stack.Screen
                name="Main"
                component={TabBar}
                options={{
                    header: () => <CoreHeader title={I18n.t(TextKey.mainNavegation)} />,
                    title: I18n.t(TextKey.mainNavegation)
                }}
            />
        </Stack.Navigator>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <NavigationContainer>
                <MainStack />
            </NavigationContainer>
        </ThemeProvider>
    );
}