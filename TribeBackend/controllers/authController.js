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
        const { nickName, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(409).json({ message: 'User already registered.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ nickName, email, password: hashedPassword });
        // Esto, cuando haya verificación, debería ser user.isVerified = false;
        user.isVerified = true;
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, message: 'Registration successful.' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error.' });
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

        // Buscar al usuario usando el ID obtenido del token
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // Guardar la nueva contraseña en la base de datos
        await user.save();

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