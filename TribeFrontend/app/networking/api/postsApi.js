import axios from 'axios';
import { storeToken, getToken } from 'helper/JWTHelper';
import { HOST, NODE_ENV } from 'react-native-dotenv';

const BASE_URL = NODE_ENV === 'Production' ? HOST : 'http://localhost:8080';

// Crear una nueva publicación
export const createPost = async (postData) => {
    try {
        const token = await getToken();
        console.log('createPost', postData);
        const response = await axios.post(`${BASE_URL}/posts`, postData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear la publicación:', error);
        throw error;
    }
};

// Obtener todas las publicaciones del usuario actual
export const getUserPosts = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/users/me/posts`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las publicaciones del usuario:', error);
        throw error;
    }
};

// Obtener publicaciones para la línea de tiempo (feed)
export const getTimelinePosts = async (offset = 0, limit = 10) => {
    try {
        const token = await getToken();
        const response = await axios.get(`${BASE_URL}/posts/timeline`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                offset,
                limit,
            }
        });
        console.log('getTimelinePosts', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las publicaciones de la línea de tiempo:', error);
        throw error;
    }
};

// Obtener una publicación específica por su ID
export const getPostById = async (postId) => {
    try {
        const response = await axios.get(`${BASE_URL}/posts/${postId}`);
        console.log('getPostById', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener la publicación con ID ${postId}:`, error);
        throw error;
    }
};

// Obtener todos los comentarios de una publicación específica
export const getCommentsForPost = async (postId, offset = 0, limit = 10) => {
    try {
        const token = await getToken();
        const response = await axios.get(`${BASE_URL}/posts/${postId}/comments`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                offset,
                limit,
                order: 'asc'
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al obtener los comentarios de la publicación con ID ${postId}:`, error);
        throw error;
    }
};

// Crear un comentario en una publicación específica
export const createComment = async (postId, commentData) => {
    try {
        const token = await getToken();
        console.log('createComment', commentData);
        console.log('createComment', postId);
        const response = await axios.post(`${BASE_URL}/posts/${postId}/comments`, commentData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al crear un comentario para la publicación con ID ${postId}:`, error);
        throw error;
    }
};

// Dar me gusta a una publicación
export const likePost = async (postId) => {
    try {
        const token = await getToken();
        if (!token) {
            throw new Error('Token is undefined');
        }
        const response = await axios.post(`${BASE_URL}/posts/${postId}/likes`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al dar me gusta a la publicación con ID ${postId}:`, error);
        throw error;
    }
};

// Quitar me gusta de una publicación
export const unlikePost = async (postId) => {
    try {
        const token = await getToken();
        if (!token) {
            throw new Error('Token is undefined');
        }
        const response = await axios.delete(`${BASE_URL}/posts/${postId}/likes`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al dar me gusta a la publicación con ID ${postId}:`, error);
        throw error;
    }
};

// Marcar una publicación como favorita
export const bookmarkPost = async (postId) => {
    try {
        const token = await getToken();
        if (!token) {
            throw new Error('Token is undefined');
        }
        const response = await axios.post(`${BASE_URL}/posts/${postId}/bookmarks`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al marcar la publicación con ID ${postId} como favorita:`, error);
        throw error;
    }
};

// Quitar una publicación de las favoritas
export const unbookmarkPost = async (postId) => {
    try {
        const token = await getToken();
        if (!token) {
            throw new Error('Token is undefined');
        }
        const response = await axios.delete(`${BASE_URL}/posts/${postId}/bookmarks`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al quitar la publicación con ID ${postId} de las favoritas:`, error);
        throw error;
    }
};

export const checkServerStatus = async () => {
    try {
      const response = await axios.get(BASE_URL);
      console.log(response)
      return response.status === 200;
    } catch (error) {
      console.error('Error checking server status:', error);
      return false;
    }
}; 

// Agregado por mrosariopresedo para la integración de los anuncios.
export const getAds = async () => {
    try {
        const token = await getToken();
        const response = await axios.get(`${BASE_URL}/posts/ads`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener los anuncios:', error);
        throw error;
    }
};
