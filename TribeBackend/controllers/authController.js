const User = require('../models/User');
const Totp = require('../models/Totp');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {sendRecoveryLink, sendTotpEmail, generateTotpCode, generateTotpSecret} = require('../utils/magicLink');
const speakeasy = require('speakeasy');

/**
 * Envía un código TOTP al correo electrónico del usuario.
 * @param {Object} req - Objeto de solicitud HTTP que contiene la dirección de correo electrónico del usuario.
 * @param {Object} res - Objeto de respuesta HTTP que enviará el mensaje de éxito o error.
 * @returns {Promise<void>} - Responde con un mensaje indicando que el código TOTP ha sido enviado o un error si ocurre algún problema.
 */
exports.sendTotp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Se requiere una dirección de correo electrónico.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Este correo electrónico ya está registrado. Por favor, inicia sesión.' });
        }

        const totpSecret = generateTotpSecret();

        await Totp.findOneAndUpdate(
            { email },
            { totpSecret, attempts: 0, createdAt: new Date() },
            { upsert: true, new: true }
        );

        const totpCode = generateTotpCode(totpSecret);
        await sendTotpEmail(email, totpCode);

        res.status(200).json({ message: 'Código TOTP enviado a tu correo electrónico.' });
    } catch (error) {
        console.error('Error al enviar TOTP:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * Verifica el código TOTP ingresado por el usuario.
 * @param {Object} req - Objeto de solicitud HTTP que contiene el correo electrónico y el código TOTP ingresado por el usuario.
 * @param {Object} res - Objeto de respuesta HTTP que enviará el mensaje de éxito o error.
 * @returns {Promise<void>} - Responde con un mensaje indicando si la verificación fue exitosa o si hubo un error.
 */
exports.verifyTotp = async (req, res) => {
    try {
        const { email, totpCode } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Este correo electrónico ya está registrado. Por favor, inicia sesión.' });
        }

        const totpRecord = await Totp.findOne({ email });
        if (!totpRecord) {
            return res.status(404).json({ message: 'Código de verificación no encontrado o expirado.' });
        }

        if (totpRecord.attempts >= 3) {
            return res.status(400).json({ message: 'Demasiados intentos fallidos. Por favor, intente más tarde.' });
        }

        const isValid = speakeasy.totp.verify({
            secret: totpRecord.totpSecret,
            encoding: 'base32',
            token: totpCode,
            window: 3
        });

        if (!isValid) {
            totpRecord.attempts += 1;
            await totpRecord.save();
            return res.status(400).json({ message: 'Código de verificación inválido o expirado.' });
        }

        await Totp.deleteOne({ email });

        res.status(200).json({ message: 'Verificación exitosa. Puedes continuar con el registro.' });
    } catch (error) {
        console.error('Error al verificar TOTP:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * Registra a un nuevo usuario.
 * @param {Object} req - Objeto de solicitud HTTP que contiene la dirección de correo electrónico, nombre de usuario (nickname) y contraseña.
 * @param {Object} res - Objeto de respuesta HTTP que enviará el token JWT y el mensaje de éxito si el registro es exitoso.
 * @returns {Promise<void>} - Responde con un token JWT y un mensaje de éxito si el registro es exitoso.
 */
exports.register = async (req, res) => {
    try {
        const { nickName, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Este correo electrónico ya está registrado. Por favor, inicia sesión.' });
        }

        const totpRecord = await Totp.findOne({ email });
        if (totpRecord) {
            return res.status(400).json({ message: 'Usuario no verificado. Verifica tu correo electrónico primero.' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            nickName,
            password: hashedPassword,
            isVerified: true,
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            token,
            refreshToken,
            message: 'Registro exitoso. Bienvenido a Tribe!'
        });
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
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
        if (!user || user.isDeleted) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Por favor, verifica tu correo electrónico antes de iniciar sesión.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Credenciales inválidas.' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ token, refreshToken, user });
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor.' });
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
        if (!user || user.isDeleted) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        await sendRecoveryLink(user.email, user._id); // Send password reset link
        res.status(200).json({ message: 'Magic link enviado.' });
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor.' });
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
        return res.status(400).json({ message: 'Se requieren el token y la nueva contraseña' });
    }

    try {
        // Verificar el token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar al usuario usando el ID obtenido del token
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // Guardar la nueva contraseña en la base de datos
        await user.save();

        res.status(200).json({ message: 'La contraseña ha sido restablecida exitosamente.' });

    } catch (err) {
        console.error('Error en resetPasswordWithToken:', err); // Registro de errores
        if (err.name === 'TokenExpiredError') {
            return res.status(400).json({ message: 'El token ha expirado.' });
        }
        res.status(400).json({ message: 'Token inválido o expirado.' });
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
      let decoded;
      let user;
  
      // Try to verify the token with the access token secret
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id).select('-password');
      } catch (error) {
        // If verification with access token secret fails, try with the refresh token secret
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id).select('-password');
      }
  
      if (!user) {
        return res.status(404).json({ valid: false, message: 'Usuario no encontrado.' });
      }
  
      res.status(200).json({ valid: true, user });
    } catch (error) {
      res.status(401).json({ valid: false, message: 'El token es inválido o ha expirado.' });
    }
  };