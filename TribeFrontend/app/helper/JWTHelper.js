import * as Keychain from 'react-native-keychain';

const queue = [];

// Function to process the queue
const processQueue = async () => {
  if (queue.length === 0) return;

  const { resolve, reject, operation } = queue.shift();
  try {
    const result = await operation();
    resolve(result);
  } catch (error) {
    reject(error);
  } finally {
    processQueue();
  }
};

// Function to add an operation to the queue
const enqueueOperation = (operation) => {
  return new Promise((resolve, reject) => {
    queue.push({ resolve, reject, operation });
    if (queue.length === 1) {
      processQueue();
    }
  });
};

// Store the token using Keychain
const storeToken = async (token) => {
  await enqueueOperation(async () => {
    await Keychain.setGenericPassword('token', token);
  });
};

// Retrieve the token using Keychain
const getToken = async () => {
  return await enqueueOperation(async () => {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      return credentials.password;
    } else {
      console.log('No token stored');
      return null;
    }
  });
};

// Check if a token is stored
const checkToken = async () => {
  return await enqueueOperation(async () => {
    const credentials = await Keychain.getGenericPassword();
    return !!credentials;
  });
};

export { storeToken, getToken, checkToken };