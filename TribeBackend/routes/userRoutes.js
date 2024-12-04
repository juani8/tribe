const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.patch('/me', userController.updateProfile);
router.delete('/me', userController.deleteProfile);
router.get('/', userController.getUsers);
router.post('/me/following/:userId', userController.followUser);
router.delete('/me/following/:userId', userController.unfollowUser);
router.get('/me/followers', userController.getFollowers);
router.get('/me/following', userController.getFollowings);
router.patch('/me/passwords', userController.changePassword);
router.get('/me/metrics', userController.getUserMetrics);
router.post('/me/logout', userController.logout);

module.exports = router;