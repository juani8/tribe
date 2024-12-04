export const navigateToLogin = (navigation) => {
  navigation.navigate('Login');
}

export const navigateToSignup = (navigation) => {
  navigation.navigate('Signup');
}

export const navigateToSignupSecondPart = (navigation, email) => {
  navigation.navigate('SignupSecondPart', { email });
}

export const navigateToPasswordRecovery = (navigation) => {
  navigation.navigate('RecoverPassword');
}

export const navigateToVerifyIdentity = (navigation) => {
  navigation.navigate('VerifyIdentity');
}

export const navigateToVerifyIdentityRegister = (navigation, email) => {
  navigation.navigate('VerifyIdentityRegister', { email });
}

export const navigateToInitialConfiguration = (navigation) => {
  navigation.navigate('InitialConfiguration');
}