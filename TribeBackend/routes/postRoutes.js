const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/timeline', postController.getTimeline);
router.get('/ads', postController.fetchAds);
router.post('/', postController.createPost);
// router.get('/:postId', postController.getPostById);
router.get('/:postId/comments', postController.getCommentsByPostId);
router.post('/:postId/comments', postController.createComment);
router.post('/:postId/likes', postController.likePost);
router.delete('/:postId/likes', postController.unlikePost);
router.post('/:postId/bookmarks', postController.bookmarkPost);
router.delete('/:postId/bookmarks', postController.unbookmarkPost);
// router.get('/:postId/likes/:userId', postController.checkLike);
// router.get('/:postId/bookmark/:userId', postController.checkBookmark);

module.exports = router;