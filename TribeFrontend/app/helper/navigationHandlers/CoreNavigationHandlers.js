import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

export const navigateToHome = (navigation) => {
  navigation.navigate('Main');
}

export const navigateToSearch = (navigation) => {
  navigation.navigate('Search');
}

export const navigateToUpload = (navigation) => {
  navigation.navigate('Upload');
} 

export const navigateToNotifications = (navigation) => {
  navigation.navigate('Notifications');
} 

export const navigateToUserProfile = (navigation) => {
  navigation.navigate('UserProfile');
} 

export const navigateToWelcome = (navigation) => {
  navigation.navigate('Welcome');
} 

export const navigateToSpecificPost = (navigation, post) => {
  navigation.navigate('PostDetail', { post });
};
