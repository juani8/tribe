import axios from 'axios';
import { storeToken, getToken } from 'helper/JWTHelper';

// Para demo, usar localhost con ADB reverse
const BASE_URL = 'http://localhost:8080';

// Datos mock para fallback cuando el servidor no responde
const MOCK_POSTS = [
    {
        _id: 'mock1',
        userId: {
            _id: 'user1',
            nickName: 'maria_viajera',
            profileImage: 'https://picsum.photos/seed/profile1/200/200'
        },
        description: '¡Qué vista increíble desde aquí! 🏔️ #naturaleza #aventura',
        multimedia: [{ url: 'https://picsum.photos/seed/post1/600/400', type: 'image' }],
        location: { city: 'Barcelona', latitude: 41.3851, longitude: 2.1734 },
        likes: 42,
        isLiked: false,
        isBookmarked: false,
        numberOfComments: 5,
        createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
        _id: 'mock2',
        userId: {
            _id: 'user2',
            nickName: 'carlos_foto',
            profileImage: 'https://picsum.photos/seed/profile2/200/200'
        },
        description: 'Explorando nuevos lugares 🌍 La vida es una aventura',
        multimedia: [{ url: 'https://picsum.photos/seed/post2/600/400', type: 'image' }],
        location: { city: 'Madrid', latitude: 40.4168, longitude: -3.7038 },
        likes: 89,
        isLiked: true,
        isBookmarked: false,
        numberOfComments: 12,
        createdAt: new Date(Date.now() - 7200000).toISOString()
    },
    {
        _id: 'mock3',
        userId: {
            _id: 'user3',
            nickName: 'ana_foodie',
            profileImage: 'https://picsum.photos/seed/profile3/200/200'
        },
        description: 'La comida callejera siempre sorprende 🍜 #foodie',
        multimedia: [{ url: 'https://picsum.photos/seed/food1/600/400', type: 'image' }],
        location: { city: 'Valencia', latitude: 39.4699, longitude: -0.3763 },
        likes: 156,
        isLiked: false,
        isBookmarked: true,
        numberOfComments: 23,
        createdAt: new Date(Date.now() - 14400000).toISOString()
    },
    {
        _id: 'mock4',
        userId: {
            _id: 'user4',
            nickName: 'pedro_adventure',
            profileImage: 'https://picsum.photos/seed/profile4/200/200'
        },
        description: 'Atardecer perfecto 🌅 Momentos que valen la pena',
        multimedia: [{ url: 'https://picsum.photos/seed/sunset1/600/400', type: 'image' }],
        location: { city: 'Sevilla', latitude: 37.3891, longitude: -5.9845 },
        likes: 234,
        isLiked: true,
        isBookmarked: true,
        numberOfComments: 45,
        createdAt: new Date(Date.now() - 28800000).toISOString()
    },
    {
        _id: 'mock5',
        userId: {
            _id: 'user1',
            nickName: 'maria_viajera',
            profileImage: 'https://picsum.photos/seed/profile1/200/200'
        },
        description: 'Arte urbano que encontré hoy 🎨 #streetart',
        multimedia: [{ url: 'https://picsum.photos/seed/art1/600/400', type: 'image' }],
        location: { city: 'Bilbao', latitude: 43.2630, longitude: -2.9350 },
        likes: 67,
        isLiked: false,
        isBookmarked: false,
        numberOfComments: 8,
        createdAt: new Date(Date.now() - 43200000).toISOString()
    }
];

// Crear una nueva publicación
export const createPost = async (postData) => {
    try {
        const token = await getToken();
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
export const getUserPosts = async (offset = 0, limit = 10) => {
    try {
        const token = await getToken();
        const response = await axios.get(`${BASE_URL}/posts/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                offset,
                limit,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener las publicaciones del usuario:', error);
        throw error;
    }
};

// Obtener todas las publicaciones del usuario actual
export const getUserBookmarks = async (offset = 0, limit = 10) => {
    try {
        const token = await getToken();
        const response = await axios.get(`${BASE_URL}/posts/me/bookmarks`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                offset,
                limit,
            }
        });
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
            },
            timeout: 5000 // 5 segundos de timeout
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener las publicaciones de la línea de tiempo:', error);
        // Si falla la conexión, devolver datos mock para demo
        console.log('Usando datos mock para el feed...');
        return {
            posts: MOCK_POSTS.slice(offset, offset + limit),
            total: MOCK_POSTS.length,
            hasMore: offset + limit < MOCK_POSTS.length
        };
    }
};

// Obtener una publicación específica por su ID
export const getPostById = async (postId) => {
    try {
        const response = await axios.get(`${BASE_URL}/posts/${postId}`);
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
        if (error.response && error.response.status === 400) {
            // Si el error es 400, significa que el post ya está marcado como favorito
            console.log(`El post con ID ${postId} ya tiene like.`);
            return; // No hacer nada
        } else {
            console.error(`Error al dar me gusta a la publicación con ID ${postId}:`, error);
            throw error;
        }  
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
        if (error.response && error.response.status === 400) {
            // Si el error es 400, significa que el post ya está marcado como favorito
            console.log(`El post con ID ${postId} ya está marcado como favorito.`);
            return; // No hacer nada
        } else {
            console.error(`Error al marcar la publicación con ID ${postId} como favorita:`, error);
            throw error;
        }
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
