import * as Keychain from 'react-native-keychain';

// Store the token using Keychain
const storeToken = async (token) => {
  try {
      await Keychain.setGenericPassword('token', token);
  } catch (error) {
      console.error('Error storing the token:', error);
  }
};

// Retrieve the token using Keychain
const getToken = async () => {
  try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
          return credentials.password;
      } else {
          console.log('No token stored');
      }
  } catch (error) {
      console.error('Error retrieving the token:', error);
  }
};

export { storeToken, getToken };