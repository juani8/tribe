const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middlewares/auth');

// Aplicar el middleware de autenticación a todas las rutas de post
router.use(auth);

router.post('/posts', postController.createPost);
router.get('/posts/:postId', postController.getPostById);
router.get('/posts/:postId/comments', postController.getCommentsByPostId);
router.post('/posts/:postId/comments', postController.createComment);
router.post('/posts/:postId/likes', postController.likePost);
router.delete('/posts/:postId/likes', postController.unlikePost);
router.get('/timeline', postController.getTimeline);

module.exports = router;