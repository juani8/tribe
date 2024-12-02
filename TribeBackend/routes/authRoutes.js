const express = require('express');
const { sendTotp, verifyTotp, register, login, googleLogin, requestPasswordReset, resetPasswordWithToken, validateToken } = require('../controllers/authController');
const router = express.Router();

router.post('/send-totp', sendTotp);
router.post('/verify-totp', verifyTotp);
router.post('/registrations', register);
router.post('/sessions', login);
router.post('/sessions/google-login', googleLogin);
router.post('/sessions/passwords', requestPasswordReset);
router.patch('/sessions/passwords', resetPasswordWithToken);
router.post('/validate-token', validateToken);

module.exports = router;