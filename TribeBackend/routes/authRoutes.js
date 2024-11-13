const express = require('express');
const { register, login, requestPasswordReset, verifyPasswordResetMagicLink,
    verifyMagicLink, resetPasswordWithToken, validateToken
} = require('../controllers/authController');
const router = express.Router();

router.post('/registrations', register);
router.post('/sessions', login);
router.post('/sessions/passwords', requestPasswordReset);
router.patch('/sessions/passwords', resetPasswordWithToken);
router.post('/validate-token', validateToken);

module.exports = router;