import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

export const NavigateToHome = ({navigation}) => {
  navigation.navigate(I18n.t(TextKey.homeNavegation));
}

export const NavigateToSearch = ({navigation}) => {
  navigation.navigate(I18n.t(TextKey.searchNavegation));
}

export const NavigateToUpload = ({navigation}) => {
  navigation.navigate(I18n.t(TextKey.uploadNavegation));
}