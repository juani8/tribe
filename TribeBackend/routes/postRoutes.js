const express = require('express');
const router = express.Router();
const PostController = require('../controllers/postController');
const auth = require('../middlewares/auth');

// Aplicar el middleware de autenticación a todas las rutas de post
router.use(auth);

router.post('/posts', PostController.createPost);
router.get('/posts/:postId', PostController.getPostById);
router.get('/posts/:postId/comments', PostController.getCommentsByPostId);
router.post('/posts/:postId/comments', PostController.createComment);
router.post('/posts/:postId/likes', PostController.likePost);
router.delete('/posts/:postId/likes', PostController.unlikePost);
router.get('/timeline', PostController.getTimeline);

module.exports = router;