import React, { useEffect, useState, useRef } from 'react';
import { Image, Pressable, View, ActivityIndicator } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
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
import FollowersScreen from 'ui/screens/user/FollowersScreen';
import FollowingScreen from 'ui/screens/user/FollowingScreen';
import GamificationProgressScreen from 'ui/screens/user/GamificationProgressScreen';
import GamificationActivityScreen from 'ui/screens/user/GamificationActivityScreen';
import PostDetail from 'ui/screens/core/PostDetail';
import LanguageSelectionScreen from 'ui/screens/configuration/LanguageSelectionScreen';
import MetricsScreen from 'ui/screens/configuration/MetricsScreen';
import ThemeSelectionScreen from 'ui/screens/configuration/ThemeSelectionScreen';
import AccountSettingsScreen from 'ui/screens/configuration/AccountSettingsScreen';
import ChangePasswordScreen from 'ui/screens/accountSettings/ChangePasswordScreen';
import DeleteAccountScreen from 'ui/screens/accountSettings/DeleteAccountScreen';
import EditPersonalDataScreen from 'ui/screens/accountSettings/EditPersonalDataScreen';
import EnableBiometricsScreen from 'ui/screens/accountSettings/EnableBiometricsScreen';

import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';
import { ThemeProvider, useTheme } from 'context/ThemeContext';
import { PostProvider } from 'context/PostContext';
import { UserProvider, useUserContext } from 'context/UserContext';
import CustomTextNunito from 'ui/components/generalPurposeComponents/CustomTextNunito';
import { checkToken, checkRefreshToken } from 'networking/api/authsApi';
import { AddSquareSelected, HomeSelected, SearchAltSelected, AddSquare, Home, SearchAlt } from 'assets/images';
import { AddSquareSelectedNight, HomeSelectedNight, SearchAltSelectedNight, AddSquareNight, HomeNight, SearchAltNight } from 'assets/images';
import useMagicLinkListener from 'hooks/useMagicLinkListener';
import { navigateToHome } from 'helper/navigationHandlers/CoreNavigationHandlers';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabBar({ navigation }) {
    const { theme, isDarkMode } = useTheme();
    const flatListRef = useRef(null); // Add a ref to the FlatList

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarStyle: { backgroundColor: theme.colors.primary },
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
                    return <CustomTextNunito weight='Bold' style={{color: (isDarkMode ? focused ? theme.colors.secondary : theme.colors.background : !focused ? theme.colors.secondary : theme.colors.background)}}>{label}</CustomTextNunito>;
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
                options={{
                headerShown: true,
                header: () => <CoreHeader />,
                tabBarButton: (props) => (
                    <Pressable
                    {...props}
                    onPress={() => navigateToHome(navigation, flatListRef)}
                    />
                ),
                }}
            >
                {() => <TimelineScreen flatListRef={flatListRef} />}
            </Tab.Screen>
            <Tab.Screen name="Upload" component={UploadScreen} options={{ headerShown: true, header: () => <ComplementaryHeader title={I18n.t(TextKey.uploadNavegation)} /> }} />
            <Tab.Screen name="Search" component={SearchScreen} options={{ headerShown: true, header: () => <ComplementaryHeader title={I18n.t(TextKey.searchNavegation)} /> }} />
        </Tab.Navigator>
    );
}

function MainStack() {
    const { theme } = useTheme();
    const { setUser } = useUserContext();
    const [initialRoute, setInitialRoute] = useState('Welcome');
    const [isSessionChecked, setIsSessionChecked] = useState(false);
    const [showBioPrompt, setShowBioPrompt] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const { valid, user } = await checkToken();
                if (false) {
                    setInitialRoute('Main');
                    setUser(user);
                } else {
                    const refreshToken = await AsyncStorage.getItem('refreshToken');
                    if (refreshToken) {
                        try {
                            const { valid, user } = await checkRefreshToken();
                            setInitialRoute('Login');
                            setUser(user);
                            setShowBioPrompt(true);
                        } catch (error) {
                            console.error('Error checking refresh token:', error);
                            setInitialRoute('Welcome');
                        }
                    }
                }
            } catch (error) {
                console.error('Error checking session:', error);
                setInitialRoute('Welcome');
            } finally {
                SplashScreen.hide();
                setIsSessionChecked(true);
            }
        };
        checkSession();
    }, []);

    useMagicLinkListener();

    if (!isSessionChecked) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }


    return (
        <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: theme.colors.background } }} initialRouteName={initialRoute}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} showBioPrompt={showBioPrompt} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="RecoverPassword" component={RecoverPasswordScreen} />
            <Stack.Screen name="VerifyIdentity" component={VerifyIdentityScreen} />
            <Stack.Screen name="InitialConfiguration" component={InitialConfigurationScreen} />
            <Stack.Screen name="Main" component={TabBar} />
            <Stack.Screen name="PostDetail" component={PostDetail} options={{ headerShown: true, header: () => <ComplementaryHeader title={I18n.t(TextKey.postDetailNavegation)} /> }} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: true, header: () => <ComplementaryHeader title={I18n.t(TextKey.notificationsNavegation)} /> }} />
            <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ headerShown: true, header: () => <ComplementaryHeader title={I18n.t(TextKey.userProfileNavegation)} /> }} />
            <Stack.Screen name="Followers" component={FollowersScreen} options={{ headerShown: true, header: () => <ComplementaryHeader title={I18n.t(TextKey.followersNavegation)} /> }} />
            <Stack.Screen name="Following" component={FollowingScreen} options={{ headerShown: true, header: () => <ComplementaryHeader title={I18n.t(TextKey.followingNavegation)} /> }} />
            <Stack.Screen name="GamificationProgress" component={GamificationProgressScreen} options={{ headerShown: true, header: () => <ComplementaryHeader title={I18n.t(TextKey.gamificationProgressNavegation)} /> }} />
            <Stack.Screen name="GamificationActivity" component={GamificationActivityScreen} options={{ headerShown: true, header: () => <ComplementaryHeader title={I18n.t(TextKey.gamificationActivityNavegation)} /> }} />
            <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} options={{ headerShown: true, header: () => <ComplementaryHeader title={I18n.t(TextKey.languageSelectionNavegation)} /> }} />
            <Stack.Screen name="ThemeSelection" component={ThemeSelectionScreen} options={{ headerShown: true, header: () => <ComplementaryHeader title={I18n.t(TextKey.themeSelectionNavegation)} /> }} />
            <Stack.Screen name="Metrics" component={MetricsScreen} options={{ headerShown: true, header: () => <ComplementaryHeader title={I18n.t(TextKey.metricsNavegation)} /> }} />  
            <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} options={{ headerShown: true, header: () => <ComplementaryHeader title={I18n.t(TextKey.accountSettingsNavegation)} /> }} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: true, header: () => <ComplementaryHeader title={I18n.t(TextKey.changePasswordNavegation)} /> }} />
            <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} options={{ headerShown: true, header: () => <ComplementaryHeader title={I18n.t(TextKey.deleteAccountNavegation)} /> }} />
            <Stack.Screen name="EditPersonalData" component={EditPersonalDataScreen} options={{ headerShown: true, header: () => <ComplementaryHeader title={I18n.t(TextKey.editPersonalDataNavegation)} /> }} />
            <Stack.Screen name="EnableBiometrics" component={EnableBiometricsScreen} options={{ headerShown: true, header: () => <ComplementaryHeader title={I18n.t(TextKey.enableBiometricsNavegation)} /> }} />
        </Stack.Navigator>
    );
}

function AppContent() {
    const linking = {
        prefixes: ['tribeapp://'], // Deep link prefix
        config: {
            screens: {
                RecoverPassword: {
                    path: 'reset-password',
                    parse: {
                        token: (token) => `${token}`,
                    },
                },
                InitialConfiguration: 'register?token=:token',
            }
        }
    }

    return (
        <NavigationContainer linking={linking}>
            <MainStack />
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <UserProvider>
                <PostProvider>
                    <AppContent />
                </PostProvider>
            </UserProvider>
        </ThemeProvider>
    );
}