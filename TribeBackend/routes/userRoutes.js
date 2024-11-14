const express = require('express');

const { getProfile, updateProfile, deleteProfile, getUsers, followUser, unfollowUser, getFollowers, getFollowing, changePassword, logout } = require('../controllers/userController');
const router = express.Router();

router.get('/me', getProfile);
router.patch('/me', updateProfile);
router.delete('/me', deleteProfile);
router.get('/', getUsers);
router.post('/me/following/:userId', followUser);
router.delete('/me/following/:userId', unfollowUser);
router.get('/me/followers', getFollowers);
router.get('/me/following', getFollowing);
router.patch('/me/passwords', changePassword);
router.post('/me/logout', logout);


module.exports = router;