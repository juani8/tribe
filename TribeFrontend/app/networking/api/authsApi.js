import axios from 'axios';
import { storeToken, getToken } from 'helper/JWTHelper';

const BASE_URL = 'https://tribe-plp5.onrender.com';

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