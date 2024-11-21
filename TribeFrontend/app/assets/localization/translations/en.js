import { ca } from "date-fns/locale";

export default {
    // Pages
    welcomeNavegation: 'Welcome',
    loginNavigation: 'Login',
    signupNavigation: 'Signup',
    recoverPasswordNavigation: 'Recover Password',
    verifyIdentityNavigation: 'Verify Identity',
    initialConfigurationNavigation: 'Initial Configuration',
    homeNavegation: 'Home',
    mainNavegation: 'Main',
    uploadNavegation: 'Upload',
    searchNavegation: 'Search',
    notificationsNavegation: 'Notifications',
    userProfileNavegation: 'User Profile',
    postDetailNavegation: 'Post Detail',
    gamificationProgressNavegation: 'Gamification Progress',
    followersNavegation: 'Followers',
    followingNavegation: 'Following',
    gamificationActivityNavegation: 'Gamification Activity',
    languageSelectionNavegation: 'Language Selection',
    themeSelectionNavegation: 'Theme Selection',
    metricsNavegation: 'Metrics',

    // PopUp
    settingsTitle: 'Settings',
    commentsViewTitle: 'Comments',

    // Options
    changeLanguage: 'Change Language',

    // Welcome Screen
    welcomeTitleFirstPage: { part1: 'Welcome to ', part2: 'Tribe', part3:'!' },
    welcomeDescriptionFirstPage: 'Meet people from all over the world, share your interests, and stay updated with what matters to you.',
    welcomeTitleSecondPage: { part1: 'Share Your ', part2: 'Unique Moments' },
    welcomeDescriptionSecondPage: 'Post photos and videos for your followers to see.',
    welcomeTitleThirdPage: { part1: 'Beyond ', part2: 'Connection' },
    welcomeDescriptionThirdPage: { part1: 'At ' , part2: 'Tribe' , part3: ', every interaction is an opportunity to learn and grow.' },
    welcomeTitleFourthPage: { part1: 'Tribe', part2: ' is waiting for you' },
    welcomeGotoSignup: 'Join Now',
    welcomeGotoLogin: 'Go to Sign In',

    // Login Screen
    loginTitle: 'Login Screen',
    loginMessage: 'Please enter your credentials',
    loginButton: 'Login',
    goToSignup: 'Go to Signup',
    goToRecoverPassword: 'Go to Recover Password',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    emailPlaceholder: 'Enter your email',
    passwordPlaceholder: 'Enter your password',
    completeFields: 'Please fill in all fields.',
    passwordsDontMatch: 'Passwords do not match.',
    completeFields: 'Please fill in all fields.',
    gmailLogin: 'Or',
    gmailButton: 'Sign up with Google',
    gmailButton: 'Sign up with Google',

    // Signup Screen
    signupTitle: 'Create your account',
    nameAccount: 'Fantasy Name',
    enterName: 'Enter your fantasy name',
    emailAccount: 'Email',
    enterEmail: 'Enter your email',
    passwordAccount: 'Password',
    enterPassword: 'Enter your password',
    confirmPassword: 'Confirm password',
    enterConfirmPassword: 'Confirm your password',
    createUserButton: 'Create account',
    logIn: 'Sign in',
    completeFields: 'Please fill in all fields.',
    passwordsDontMatch: 'Passwords do not match.',

    // Password recovery Screen
    recoverPasswordTitle: 'Recover Your Password',
    recoverPasswordDescription: 'Enter the email you registered with, and we will send you a link to reset your password.',
    emailLabel: 'Email',
    emailPlaceholder: 'Enter your email',
    completeFields: 'Please fill in all fields.',
    verifyButton: 'Send Verification',
    passwordResetSuccessTitle: 'Request Sent',
    passwordResetSuccessMessage: 'A verification link has been sent to your email.',
    passwordResetErrorMessage: 'There was an error processing the request. Please try again.',

    // Verify Identity Screen
    verifyIdentityTitle: 'Verify your identity',
    verifyIdentityInstruction: 'We have sent an email to confirm your identity.',
    verifyIdentityCheckInbox: 'Please check your inbox and click the link to continue.',
    verifyIdentityCheckSpam: 'If you don’t see the email, check your spam folder.',

    // Initial Configuration Screen
    initialConfigTitle: 'Welcome to Tribe',
    initialConfigSubtitle: 'Let’s start by completing your profile.',
    firstNameLabel: 'First Name',
    lastNameLabel: 'Last Name',
    genderLabel: 'Gender',
    continueButton: 'Continue',
    selectGender: 'Select',
    genderMale: 'Male',
    genderFemale: 'Female',
    genderNonBinary: 'Non-binary',
    genderOther: 'Other',
    genderPreferNotToSay: 'Prefer not to say',
    completeFieldsError: 'Please complete all fields.',
    profileUpdated: 'Profile updated',
    profileUpdateSuccess: 'Your profile has been successfully completed.',

    // Timeline Screen
    timelineTitle: 'Timeline Screen',
    timelineMessage: 'This is the Timeline Screen',
    timelineSeePostDetail: 'See more',
    timelineNoMorePosts: 'You reached the end of the timeline. No more posts to show.',

    // Timeline Screen (no connection)
    noConnectionTitle: 'Connection Lost!',
    noConnectionFirstMessage: 'It seems you are not connected to the Internet. To enjoy all the features of Tribe, make sure you have an active connection.',
    noConnectionFirstMessageFirstItem: 'Check your Wi-Fi or mobile data connection',
    noConnectionFirstMessageSecondItem: 'Try restarting the app.',
    noConnectionSecondMessage: 'We are here to help you reconnect!',

    // Upload Screen
    uploadTitle: 'Upload Screen',
    uploadMessage: 'Please select a file to upload',
    uploadSelectedContent: 'Selected content',
    uploadMoreMessage: 'Add more content',
    uploadSelectFromGallery: 'Select from gallery',
    uploadSelectOpenCamera: 'Open camera',
    uploadDescriptionTitle: 'Description',
    uploadDescriptionPlaceholder: 'Enter a description...',
    uploadAddLocation: 'Add actual location',
    uploadConfirmation: 'Confirm',

    // Search Screen
    searchTitle: 'Search Screen',
    searchMessage: 'Please enter your search query',

    // Post Detail Screen
    commentsTitle: 'Comments',
    commentsViewMore: 'View all comments',
    commentsWriteCommentPlaceholder: 'Write a comment...',
    commentsMaxCharactersReached: 'Maximum character limit reached!',
    sponsored: 'Sponsored',
    copyAdvertisement: 'Copy advertisement\'s link',
    redirectAdvertisement: 'Tap the post to go to the advertiser\'s website.',
    
    // Header
    headerTitle: "Discover what's new",

    // Settings
    settingsTitle: 'Settings',
    settingsOptionTheme: 'Theme',
    settingsOptionLanguage: 'Language',
    settingsOptionAccountOptions: 'Account Options',
    settingsOptionMetrics: 'Metrics',
    settingsOptionLogout: 'Logout',

    // Permission Dialogs
    permissionAlertButtonPositive: 'OK',
    permissionAlertOpenSettings: 'Open Settings',
    permissionAlertCloseDialog: 'Close',

    // CameraPermission
    cameraPermissionAlertTitle: 'Camera Permission',
    cameraPermissionAlertMessage: 'Tribe needs access to your camera to take photos and videos.',
    cameraPermissionAlertDeniedMessage: 'Camera permission has been denied permanently. Please enable it in the app settings.',

    // LocationPermission
    locationPermissionAlertTitle: 'Location Permission',
    locationPermissionAlertMessage: 'Tribe needs access to your location.',
    locationPermissionAlertDeniedMessage: 'Location permission has been denied permanently. Please enable it in the app settings.',

    // NotificationsPermission
    notificationsPermissionAlertTitle: 'Notifications Permission',
    notificationsPermissionAlertMessage: 'Tribe needs access to your notifications.',
    notificationsPermissionAlertDeniedMessage: 'Notifications permission has been denied permanently. Please enable it in the app settings.',

    // StoragePermission
    storagePermissionAlertTitle: 'Storage Permission',
    storagePermissionAlertMessage: 'Tribe needs access to your storage to read media.',
    storagePermissionAlertDeniedMessage: 'Storage permission has been denied permanently. Please enable it in the app settings.',

    // MultimediaHelper
    multimediaHelperPermissionDenied: 'Permission denied',
    multimediaHelperStoragePermissionDeniedMessage: 'App needs storage permission to access media.',
    multimediaHelperCameraPermissionDeniedMessage: 'App needs camera and microphone permission to take photos or videos.',
    multimediaHelperLocationPermissionDeniedMessage: 'App needs location permission to add location.',
    multimediaHelperChooseMediaTypeTitle: 'Choose Media Type', 
    multimediaHelperChooseMediaTypeMessage: 'Would you like to take a photo or record a video?',
    multimediaHelperChooseMediaPhoto: 'Take Photo',
    multimediaHelperChooseMediaVideo: 'Record Video',
    multimediaHelperChooseMediaCancel: 'Cancel',
    multimediaHelperChooseMediaClose: 'Close',

    // ThemeSelectionScreen
    themeSelectionTitle: "Select Theme",
    lightTheme: "Light Theme",
    darkTheme: "Dark Theme",
    systemTheme: "System Default",

    // userProfileScreen
    followers: "Followers",
    following: "Following",
    posts: "Posts",
    favorites: "Favorites",

    // GamificationBar
    level: "Level",
    postsCompleted: "posts completed",

    // languageSelectionScreen
    deviceLanguage: "Device Language",

    // MetricsScreen
    userMetricsTitle: "User Metrics",
    numberOfFollowers: "Number of Followers",
    numberOfFollowing: "Number of Following",
    numberOfComments: "Number of Comments",
    numberOfLikes: "Number of Likes",
};
