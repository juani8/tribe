export const navigateToLogin = (navigation) => {
  navigation.navigate('Login');
}

export const navigateToSignup = (navigation) => {
  navigation.navigate('Signup');
}

export const navigateToSignupSecondPart = (navigation, fantasyName, email) => {
  navigation.navigate('SignupSecondPart', { fantasyName, email });
}

export const navigateToPasswordRecovery = (navigation) => {
  navigation.navigate('RecoverPassword');
}

export const navigateToVerifyIdentity = (navigation) => {
  navigation.navigate('VerifyIdentity');
}

export const navigateToVerifyIdentityRegister = (navigation, fantasyName, email) => {
  navigation.navigate('VerifyIdentityRegister', { fantasyName, email });
}

export const navigateToInitialConfiguration = (navigation) => {
  navigation.navigate('InitialConfiguration');
}
