const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/timeline', postController.getTimeline);
router.get('/ads', postController.fetchAds);
router.post('/', postController.createPost);
router.get('/me', postController.getUserPosts);
router.get('/me/bookmarks', postController.getUserBookmarks);
router.get('/:postId', postController.getPostById);
router.get('/:postId/comments', postController.getCommentsByPostId);
router.post('/:postId/comments', postController.createComment);
router.post('/:postId/likes', postController.likePost);
router.delete('/:postId/likes', postController.unlikePost);
router.post('/:postId/bookmarks', postController.bookmarkPost);
router.delete('/:postId/bookmarks', postController.unbookmarkPost);

module.exports = router;