import axios from 'axios';
import { storeToken, getToken } from 'helper/JWTHelper';

// Para demo, usar localhost directamente
const BASE_URL = 'http://localhost:8080';

// Registro de usuario
export const registerUser = async (registrationData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auths/registrations`, registrationData);
    return response.data;
  } catch (error) {
    console.error('Error registrando usuario:', error);
    throw error;
  }
};

// Verificar enlace mágico para registro
export const verifyRegistrationToken = async (token) => {
  try {
    const response = await axios.post(`${BASE_URL}/auths/registrations/tokens`, { token });
    return response.data;
  } catch (error) {
    console.error('Error verificando token de registro:', error);
    throw error;
  }
};

// Verificación del código TOTP
export const verifyTotp = async (verificationData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auths/verify-totp`, verificationData);
    return response.data; 
  } catch (error) {
    console.error('Error verificando TOTP:', error);
    throw error; 
  }
};

// Verificación del código TOTP
export const sendTotp = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL}/auths/send-totp`, email);
    return response.data; 
  } catch (error) {
    console.error('Error verificando TOTP:', error);
    throw error; 
  }
};

// Inicio de sesión de usuario
export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auths/sessions`, loginData);
    await storeToken(response.data.token);
    return response.data;
  } catch (error) {
    console.error('Error iniciando sesión de usuario:', error);
    throw error;
  } 
};

// Solicitar restablecimiento de contraseña
export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL}/auths/sessions/passwords`, { email });
    return response.data;
  } catch (error) {
    console.error('Error solicitando restablecimiento de contraseña:', error);
    throw error;
  }
};

// Cambiar contraseña (a través del restablecimiento de contraseña)
export const resetPassword = async (resetData) => {
  try {
    const response = await axios.patch(`${BASE_URL}/auths/sessions/passwords`, resetData);
    return response.data;
  } catch (error) {
    console.error('Error restableciendo contraseña:', error);
    throw error;
  }
};

// Verificar enlace mágico para restablecimiento de contraseña
export const verifyPasswordToken = async (token) => {
  try {
    const response = await axios.post(`${BASE_URL}/auths/sessions/passwords/tokens`, { token });
    return response.data;
  } catch (error) {
    console.error('Error verificando token de restablecimiento de contraseña:', error);
    throw error;
  }
};

// Validar token
export const checkToken = async () => {
  try {
      const token = await getToken();
      console.log(token);
      if (token) {
          const response = await axios.post(`${BASE_URL}/auths/validate-token`, { token });
          return response.data.valid;
      } else {
          return false;
      }
  } catch (error) {
      return false;
  }
};

// Validar token y obtener usuario
export const validateTokenAndGetUser = async () => {
  try {
      const token = await getToken();
      if (token) {
          const response = await axios.post(`${BASE_URL}/auths/validate-token`, { token });
          if (response.data.valid && response.data.user) {
              return { valid: true, user: response.data.user };
          }
          return { valid: false, user: null };
      } else {
          return { valid: false, user: null };
      }
  } catch (error) {
      console.error('Error validating token:', error);
      return { valid: false, user: null };
  }
};

// Inicio de sesión con Google
export const loginUserWithGoogle = async (googleData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auths/sessions/google-login`, googleData);
    // Guarda el token devuelto por el backend
    await storeToken(response.data.token);
    // Obtenemos el JWT 
    return response.data; 
  } catch (error) {
    console.error('Error iniciando sesión con Google:', error);
    throw error;
  }
};