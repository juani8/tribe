const express = require('express');

const { getProfile, updateProfile, deleteProfile, getUsers, followUser, unfollowUser, getFollowers, getFollowing,
    getFavorites, saveFavorite, removeFavorite, changePassword, logout
} = require('../controllers/userController');
const router = express.Router();

router.get('/me', getProfile);
router.patch('/me', updateProfile);
router.delete('/me', deleteProfile);
router.get('/', getUsers);
router.post('/me/following/:userId', followUser);
router.delete('/me/following/:userId', unfollowUser);
router.get('/me/followers', getFollowers);
router.get('/me/following', getFollowing);
router.get('/me/favorites', getFavorites);
router.post('/me/favorites/:favoriteId', saveFavorite);
router.delete('/me/favorites/:favoriteId', removeFavorite);
router.patch('/me/passwords', changePassword);
router.post('/me/logout', logout);


module.exports = router;