import axios from 'axios';
import { storeToken, getToken } from 'helper/JWTHelper';

const BASE_URL = 'http://10.0.2.2:8080';

// Crear una nueva publicación
export const createPost = async (postData) => {
    try {
        const response = await axios.post(`${BASE_URL}/posts`, postData);
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
export const getTimelinePosts = async () => {
    try {
        const token = await getToken();
        const response = await axios.get(`${BASE_URL}/timeline`, {
            headers: {
                'Authorization': `Bearer ${token}`
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
export const getCommentsForPost = async (postId) => {
    try {
        const response = await axios.get(`${BASE_URL}/posts/${postId}/comments`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener los comentarios de la publicación con ID ${postId}:`, error);
        throw error;
    }
};

// Crear un comentario en una publicación específica
export const createComment = async (postId, commentData) => {
    try {
        const response = await axios.post(`${BASE_URL}/posts/${postId}/comments`, commentData);
        return response.data;
    } catch (error) {
        console.error(`Error al crear un comentario para la publicación con ID ${postId}:`, error);
        throw error;
    }
};

// Dar me gusta a una publicación
export const likePost = async (postId) => {
    try {
        const response = await axios.post(`${BASE_URL}/posts/${postId}/likes`);
        return response.data;
    } catch (error) {
        console.error(`Error al dar me gusta a la publicación con ID ${postId}:`, error);
        throw error;
    }
};

// Quitar me gusta de una publicación
export const unlikePost = async (postId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/posts/${postId}/likes`);
        return response.data;
    } catch (error) {
        console.error(`Error al quitar me gusta de la publicación con ID ${postId}:`, error);
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

export const bypassLogin = async () => {
    try {
        const response = await axios.post(`${BASE_URL}/auths/sessions/bypass`);
        const token = response.data.token;
        console.log('Token:', token);
    
        // Store the token using Keychain
        await storeToken(token);
    
        // Retrieve the token for use
        const storedToken = await getToken();
        console.log('Retrieved token:', storedToken);
    } catch (error) {
        console.error('Error in bypassLogin:', error);
    }
};
  

export const createTestUser = async () => {
    try {
        const response = await axios.post(`${BASE_URL}/auths/sessions/test-user`);
        return response.data;
    } catch (error) {
        console.error('Error creating test user:', error);
        throw error;
    }
};

