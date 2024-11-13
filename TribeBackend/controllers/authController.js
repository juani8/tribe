const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sendMagicLink, sendRecoveryLink} = require('../utils/magicLink');

/**
 * Registro de usuario.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con un token JWT y un mensaje de éxito si el registro es exitoso.
 */
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

/**
 * Verifica el magic link para el registro.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con un mensaje de éxito si la verificación es exitosa.
 */
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

/**
 * Inicio de sesión de usuario.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con un token JWT y el usuario si el inicio de sesión es exitoso.
 */
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

/**
 * Solicita el restablecimiento de contraseña (envía un magic link).
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con un mensaje de éxito si el magic link se envía correctamente.
 */
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

/**
 * Verifica el magic link para el restablecimiento de contraseña.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con un mensaje de éxito si el magic link es válido.
 */
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

/**
 * Cambia la contraseña (después de la verificación del magic link).
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con un mensaje de éxito si la contraseña se cambia correctamente.
 */
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

/**
 * Valida el token.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con un mensaje de éxito si el token es válido.
 */
exports.validateToken = async (req, res) => {
  const token = req.body.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ valid: true });
  } catch (error) {
    res.status(401).json({ valid: false, message: 'Token is invalid or expired' });
  }
};