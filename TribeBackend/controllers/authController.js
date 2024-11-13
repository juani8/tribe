const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sendMagicLink, sendRecoveryLink} = require('../utils/magicLink');

// Registration
exports.register = async (req, res) => {
    try {
        console.log('Register route hit')
        const { nickName, email, password } = req.body;
        console.log('Email provided for lookup:', email);
        const userExists = await User.findOne({ email });
        console.log('User exists:', userExists);
        if (userExists) return res.status(409).json({ message: 'User already registered.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ nickName, email, password: hashedPassword });
        // Esto, cuando haya verificación, debería ser user.isVerified = false;
        user.isVerified = true;
        await user.save();
        // await sendMagicLink(user.email, user._id); // Function that sends a verification magic link
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, message: 'Registration successful.' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

exports.verifyMagicLink = async (req, res) => {
    console.log('Verify Magic Link Route Hit');
    const { token } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        user.isVerified = true;  // Mark the user as verified
        console.log('User verified');
        await user.save();

        // If NODE_ENV is 'development' or there's no frontend URL, return JSON (for Postman testing)
        if (process.env.NODE_ENV === 'development' || !process.env.FRONTEND_URL) {
            return res.status(200).json({ message: 'User verified successfully. You can now log in.' });
        } else {
            // Otherwise, redirect to the frontend initial configuration page
            const deepLinkUrl = `tribeapp://initial-configuration?token=${token}`;
            return res.redirect(302, deepLinkUrl);
        }
    } catch (err) {
        return res.status(400).json({ message: 'Invalid or expired token.' });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email before logging in.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Request password reset (send magic link)
// This is the function that will handle requests made to /auths/sessions/passwords to request a password reset
// The user provides their email, and the magic link is sent.
exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found.' });

        await sendRecoveryLink(user.email, user._id); // Send password reset link
        res.status(200).json({ message: 'Magic link sent.' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Verify magic link for password reset
// This is the function that will handle requests made to POST /auths/sessions/passwords/tokens.
// It checks if the token is valid and then redirects the user to the password reset page.
exports.verifyPasswordResetMagicLink = (req, res) => {
    const { token } = req.body;

    try {
        jwt.verify(token, process.env.JWT_SECRET);

        // Check if the environment variable is set to development (for Postman) or if no frontend URL is set
        if (process.env.NODE_ENV === 'development' || !process.env.FRONTEND_URL) {
            // Return a JSON response for Postman
            return res.status(200).json({ message: 'Password reset link verified. You can now reset your password.', token });
        } else {
            // Otherwise, redirect to the frontend login page
            const deepLinkUrl = `https://tribe.com/login?token=${token}`;
            return res.redirect(302, deepLinkUrl);
        }
    } catch (err) {
        return res.status(400).json({ message: 'Invalid or expired token.' });
    }
};

// Change password (after magic link verification)
// This is the function that will handle requests made to PATCH /auths/sessions/passwords.
// It verifies the token sent with the request and updates the password.
exports.resetPasswordWithToken = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ message: 'Token and new password are required.' });
    }

    try {
        // Verificar el token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log('Decoded token:', decoded); // Registro del token decodificado

        // Buscar al usuario usando el ID obtenido del token
        const user = await User.findById(decoded.id);

        if (!user) {
            console.log(`User with ID ${decoded.id} not found.`); // Registro si no se encuentra el usuario
            return res.status(404).json({ message: 'User not found.' });
        }

        // Validar si la nueva contraseña cumple con los criterios
        if (newPassword.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters long.'
            });
        }

        // Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // Guardar la nueva contraseña en la base de datos
        await user.save();

        console.log(`Password successfully reset for user ID: ${decoded.id}`); // Registro de éxito
        res.status(200).json({ message: 'Password has been reset successfully.' });

    } catch (err) {
        console.error('Error in resetPasswordWithToken:', err); // Registro de errores
        if (err.name === 'TokenExpiredError') {
            return res.status(400).json({ message: 'Token has expired.' });
        }
        res.status(400).json({ message: 'Invalid or expired token.' });
    }
};

// Function to validate the token
exports.validateToken = async (req, res) => {
  const token = req.body.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ valid: true });
  } catch (error) {
    res.status(401).json({ valid: false, message: 'Token is invalid or expired' });
  }
};