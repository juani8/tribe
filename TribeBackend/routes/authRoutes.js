const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/registrations', authController.register);
router.post('/sessions', authController.login);
router.post('/sessions/passwords', authController.requestPasswordReset);
router.patch('/sessions/passwords', authController.resetPasswordWithToken);
router.post('/validate-token', authController.validateToken);

module.exports = router;