import axios from 'axios';

// Establezca su URL base aquí
const BASE_URL = 'https://tribe-redmedia.vercel.app:8080';

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
