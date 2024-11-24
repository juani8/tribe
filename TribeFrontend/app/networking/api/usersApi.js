import axios from 'axios';
import { storeToken, getToken } from 'helper/JWTHelper';

const BASE_URL = NODE_ENV === 'Production' ? HOST : 'http://localhost:8080';

// Obtener el perfil del usuario autenticado
export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/users/me`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el perfil del usuario:', error);
    throw error;
  }
};

// Editar el perfil del usuario autenticado
export const editUserProfile = async (profileData) => {
  try {
    const response = await axios.patch(`${BASE_URL}/users/me`, profileData);
    return response.data;
  } catch (error) {
    console.error('Error al editar el perfil del usuario:', error);
    throw error;
  }
};

// Eliminar al usuario autenticado (desactivar cuenta)
export const deleteUser = async () => {
  try {
    const response = await axios.delete(`${BASE_URL}/users/me`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar al usuario:', error);
    throw error;
  }
};

// Buscar usuarios
export const searchUsers = async (searchQuery) => {
  try {
    const response = await axios.get(`${BASE_URL}/users`, { params: { q: searchQuery } });
    return response.data;
  } catch (error) {
    console.error('Error al buscar usuarios:', error);
    throw error;
  }
};

// Seguir a un usuario
export const followUser = async (userId) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/me/following/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al seguir al usuario ${userId}:`, error);
    throw error;
  }
};

// Dejar de seguir a un usuario
export const unfollowUser = async (userId) => {
  try {
    const token = await getToken();
    const response = await axios.delete(`${BASE_URL}/users/me/following/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error al dejar de seguir al usuario ${userId}:`, error);
    throw error;
  }
};

// Obtener la lista de seguidores del usuario autenticado
export const getFollowers = async () => {
  try {
    const token = await getToken();
    const response = await axios.get(`${BASE_URL}/users/me/followers`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener la lista de seguidores:', error);
    throw error;
  }
};

// Obtener la lista de usuarios seguidos por el usuario autenticado
export const getFollowing = async () => {
  try {
    const token = await getToken();
    const response = await axios.get(`${BASE_URL}/users/me/following`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener la lista de seguidos:', error);
    throw error;
  }
};

// Obtener la lista de publicaciones favoritas del usuario autenticado
export const getFavorites = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/users/me/favorites`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener la lista de favoritos:', error);
    throw error;
  }
};

// Agregar una publicación a favoritos
export const addFavorite = async (favoriteId) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/me/favorites/${favoriteId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al agregar la publicación ${favoriteId} a favoritos:`, error);
    throw error;
  }
};

// Eliminar una publicación de favoritos
export const removeFavorite = async (favoriteId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/users/me/favorites/${favoriteId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar la publicación ${favoriteId} de favoritos:`, error);
    throw error;
  }
};

// Cambiar la contraseña del usuario actual
export const changeUserPassword = async (passwordData) => {
  try {
    const response = await axios.patch(`${BASE_URL}/users/me/passwords`, passwordData);
    return response.data;
  } catch (error) {
    console.error('Error cambiando la contraseña del usuario:', error);
    throw error;
  }
};

// Cerrar sesión del usuario actual
export const logoutUser = async () => {
  try {
    const token = await getToken();
    const response = await axios.post(`${BASE_URL}/users/me/logout`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    await storeToken(response.data.token);
    return response.status;
  } catch (error) {
    console.error('Error cerrando sesión del usuario:', error);
    throw error;
  }
};
