const express = require('express');
const { register, verifyTotp, login, requestPasswordReset, resetPasswordWithToken, validateToken } = require('../controllers/authController');
const router = express.Router();

router.post('/registrations', register);
router.post('/verify-totp', verifyTotp);
router.post('/sessions', login);
router.post('/sessions/passwords', requestPasswordReset);
router.patch('/sessions/passwords', resetPasswordWithToken);
router.post('/validate-token', validateToken);

module.exports = router;