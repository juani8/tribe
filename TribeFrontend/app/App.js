import React, { useEffect } from 'react';
import { Image } from 'react-native';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from 'react-native-splash-screen';

import CoreHeader from 'ui/components/generalPurposeComponents/CoreHeader';
import ComplementaryHeader from 'ui/components/generalPurposeComponents/ComplementaryHeader';

import WelcomeScreen from 'ui/screens/WelcomeScreen';
import TimelineScreen from 'ui/screens/core/TimelineScreen';
import UploadScreen from 'ui/screens/core/UploadScreen';
import SearchScreen from 'ui/screens/core/SearchScreen';
import LoginScreen from 'ui/screens/auth/LoginScreen';
import SignupScreen from 'ui/screens/auth/SignupScreen';
import RecoverPasswordScreen from 'ui/screens/auth/RecoverPasswordScreen';
import VerifyIdentityScreen from 'ui/screens/auth/VerifyIdentityScreen';
import InitialConfigurationScreen from 'ui/screens/auth/InitialConfigurationScreen';
import NotificationsScreen from 'ui/screens/core/NotificationsScreen';
import UserProfileScreen from 'ui/screens/user/UserProfileScreen';
import PostDetail from 'ui/screens/core/PostDetail';

import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

import { ThemeProvider, useTheme } from 'context/ThemeContext';
import { UiProvider } from 'context/UiContext';
import CustomTextNutito from 'ui/components/generalPurposeComponents/CustomTextNunito';

import { AddSquareSelected, HomeSelected, SearchAltSelected, AddSquare, Home, SearchAlt } from 'assets/images';
import { AddSquareSelectedNight, HomeSelectedNight, SearchAltSelectedNight, AddSquareNight, HomeNight, SearchAltNight } from 'assets/images';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabBar() {
    const { theme, isDarkMode } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarStyle: {
                    backgroundColor: theme.colors.primary,
                },
                tabBarLabel: ({ focused }) => {
                    let label;
                    switch (route.name) {
                        case 'Home':
                            label = I18n.t(TextKey.homeNavegation);
                            break;
                        case 'Upload':
                            label = I18n.t(TextKey.uploadNavegation);
                            break;
                        case 'Search':
                            label = I18n.t(TextKey.searchNavegation);
                            break;
                    }
                    return <CustomTextNutito weight='Bold' style={{color: (isDarkMode ? focused ? theme.colors.secondary : theme.colors.background : !focused ? theme.colors.secondary : theme.colors.background)}}>{label}</CustomTextNutito>;
                },
                tabBarIcon: ({ focused }) => {
                    let icon;
                    switch (route.name) {
                        case 'Home':
                            icon = focused ? (isDarkMode ? HomeSelectedNight : HomeSelected) : (isDarkMode ? HomeNight : Home);
                            break;
                        case 'Upload':
                            icon = focused ? (isDarkMode ? AddSquareSelectedNight : AddSquareSelected) : (isDarkMode ? AddSquareNight : AddSquare); 
                            break;
                        case 'Search':
                            icon = focused ? (isDarkMode ? SearchAltSelectedNight : SearchAltSelected) : (isDarkMode ? SearchAltNight : SearchAlt);
                            break;
                    }
                    return <Image source={icon} style={{  width: 24, height: 24, marginTop:8 }} />;
                },
                tabBarActiveTintColor: theme.colors.background,
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen
                name="Home"
                component={TimelineScreen}
                options={{
                    headerShown: true,
                    header: () => <CoreHeader />,
                }}
            />
            <Tab.Screen
                name="Upload"
                component={UploadScreen}
                options={{
                    headerShown: true,
                    header: () => <ComplementaryHeader title={I18n.t(TextKey.uploadNavegation)} />,
                }}
            />
            <Tab.Screen
                name="Search"
                component={SearchScreen}
                options={{
                    headerShown: true,
                    header: () => <ComplementaryHeader title={I18n.t(TextKey.searchNavegation)} />,
                }}
            />
        </Tab.Navigator>
    );
}


function MainStack() {
    const { theme } = useTheme();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: theme.colors.background },
            }}
        >
            <Stack.Screen
                name="Welcome"
                component={WelcomeScreen}
            />
            <Stack.Screen
                name="Login"
                component={LoginScreen}
            />
            <Stack.Screen
                name="Signup"
                component={SignupScreen}
            />
            <Stack.Screen
                name="RecoverPassword"
                component={RecoverPasswordScreen}
            />
            <Stack.Screen
                name="VerifyIdentity"
                component={VerifyIdentityScreen}
            />
            <Stack.Screen
                name="InitialConfiguration"
                component={InitialConfigurationScreen}
            />
            <Stack.Screen
                name="Main"
                component={TabBar}
            />
            <Stack.Screen 
                name="PostDetail" 
                component={PostDetail} 
                options={{
                    headerShown: true,
                    header: () => <ComplementaryHeader title={I18n.t(TextKey.postDetailNavegation)} />,
                }}
            />
            <Stack.Screen
                name="Notifications"
                component={NotificationsScreen}
                options={{
                    headerShown: true,
                    header: () => <ComplementaryHeader title={I18n.t(TextKey.notificationsNavegation)} />,
                }}
            />
            <Stack.Screen
                name="UserProfile"
                component={UserProfileScreen}
                options={{
                    headerShown: true,
                    header: () => <ComplementaryHeader title={I18n.t(TextKey.userProfileNavegation)} />,
                }}
            />
        </Stack.Navigator>
    );
}

export default function App() {
    useEffect(() => {
        SplashScreen.hide();
    }, []);

    return (
        <ThemeProvider>
            <UiProvider>
                <AppContent />
            </UiProvider>
        </ThemeProvider>
    );
}

function AppContent() {
    // Define your linking configuration
    const linking = {
        prefixes: ['https://tribe.com'], // Your app's deep link prefix
        config: {
            screens: {
                RecoverPassword: 'reset-password?token=:token', // Define the deep link path
                Login: 'login?token=:token',
            },
        },
    };

    return (
        <NavigationContainer linking={linking}>
            <MainStack />
        </NavigationContainer>
    );
}
