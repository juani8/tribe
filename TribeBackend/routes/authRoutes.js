const express = require('express');
const { register, login, requestPasswordReset, verifyPasswordResetMagicLink, changePasswordWithMagicLink,
    verifyMagicLink, bypassLogin, createTestUser, validateToken
} = require('../controllers/authController');
const router = express.Router();

router.post('/registrations', register);
router.post('/registrations/tokens', verifyMagicLink);
router.post('/sessions', login);
router.post('/sessions/passwords', requestPasswordReset);
router.post('/sessions/passwords/tokens', verifyPasswordResetMagicLink);
router.patch('/sessions/passwords', changePasswordWithMagicLink);
router.post('/sessions/bypass', bypassLogin);
router.post('/sessions/test-user', createTestUser);
router.post('/validate-token', validateToken);

module.exports = router; 