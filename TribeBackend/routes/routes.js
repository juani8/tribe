const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');
const authToken = require('../middlewares/auth');

// Ruta para crear un nuevo post
router.post('/posts', authToken, PostController.createPost);

// Ruta para obtener un post específico
router.get('/posts/:postId', authToken, PostController.getPostById);

// Ruta para obtener todos los comentarios de un post
router.get('/posts/:postId/comments', authToken, PostController.getCommentsByPostId);

// Ruta para crear un comentario en un post
router.post('/posts/:postId/comments', authToken, PostController.createComment);

// Ruta para dar like a un post
router.post('/posts/:postId/likes', authToken, PostController.likePost);

// Ruta para eliminar un like de un post
router.delete('/posts/:postId/likes', authToken, PostController.unlikePost);

// Ruta para obtener posts para el timeline o feed
router.get('/timeline', authToken, PostController.getTimelinePosts);

module.exports = router;