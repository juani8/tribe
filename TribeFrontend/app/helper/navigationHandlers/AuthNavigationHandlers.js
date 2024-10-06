import I18n from 'assets/localization/i18n';
import TextKey from 'assets/localization/TextKey';

export const NavigateToLogin = ({navigation}) => {
  navigation.navigate(I18n.t(TextKey.loginNavigation));
}

export const NavigateToSignup = ({navigation}) => {
  navigation.navigate(I18n.t(TextKey.signupNavigation));
}

export const NavigateToPasswordRecovery = ({navigation}) => {
  navigation.navigate(I18n.t(TextKey.recoverPasswordNavigation));
}

export const NavigateToVerifyIdentity = ({navigation}) => {
  navigation.navigate(I18n.t(TextKey.verifyIdentityNavigation));
}

export const NavigateToInitialConfiguration = ({navigation}) => {
  navigation.navigate(I18n.t(TextKey.initialConfigurationNavigation));
}