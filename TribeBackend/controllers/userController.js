const User = require('../models/User');
const bcrypt = require('bcrypt');
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');

/**
 * Obtiene el perfil del usuario autenticado.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con el perfil del usuario si se encuentra, o un mensaje de error.
 */
exports.getProfile = async (req, res) => {
    const { offset = 0, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;

    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Usuario no autenticado.' });
        }

        const user = await User.findById(req.user.id)
            .select('name lastName nickName email gender profileImage coverImage description gamificationLevel following followers')
            .populate('following', 'name lastName nickName profileImage')
            .populate('followers', 'name lastName nickName profileImage');
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        const posts = await Post.find({ userId: req.user.id })
            .skip(parseInt(offset))
            .limit(parseInt(limit))
            .sort({ [sort]: order === 'desc' ? -1 : 1 })
            .select('description multimedia location likes totalComments createdAt');

        const response = {
            ...user.toObject(),
            posts,
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error en getProfile:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * Actualiza el perfil del usuario autenticado.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con el perfil actualizado del usuario.
 */
exports.updateProfile = async (req, res) => {
    try {
        const { name, lastName, profileImage, coverImage, description, gender } = req.body;

        // Validar los campos obligatorios para la finalización del perfil inicial
        if (!req.user.name || !req.user.lastName || !req.user.gender) {
            // Verificar si es la primera vez que se completa el perfil
            if (!name || !lastName || !gender) {
                return res.status(400).json({
                    message: 'Por favor, complete los campos obligatorios: nombre, apellido y género.',
                });
            }
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { name, lastName, profileImage, coverImage, description, gender },
            { new: true }
        );
        res.status(200).json({
                message: 'Perfil actualizado con éxito.',
                user: updatedUser,
        });
    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * Elimina el perfil del usuario autenticado.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con un código de estado 204 si el perfil se elimina correctamente.
 */
exports.deleteProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        res.status(204).send(); // No content
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * Obtiene una lista de usuarios con búsqueda y paginación.
 * @param {Object} req - Objeto de solicitud HTTP que contiene parámetros de búsqueda y paginación.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con la lista de usuarios encontrados.
 */
exports.getUsers = async (req, res) => {
    const { input = '', offset = 0, limit = 10 } = req.query;

    try {
        const users = await User.find({
            $or: [
                { name: new RegExp(input, 'i') }, // case-insensitive search
                { lastName: new RegExp(input, 'i') },
                { nickName: new RegExp(input, 'i') }
            ]
        })
            .skip(parseInt(offset))
            .limit(parseInt(limit));

        if (!users.length) {
            return res.status(404).json({ message: 'No se encontraron usuarios.' });
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * Sigue a un usuario.
 * @param {Object} req - Objeto de solicitud HTTP que contiene el ID del usuario a seguir.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con el ID del usuario seguido.
 */
exports.followUser = async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.userId);
        if (!userToFollow) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Add user to following list
        if (!req.user.following.includes(userToFollow._id)) {
            req.user.following.push(userToFollow._id);
            await req.user.save();
        }

        // Add follower to the followed user
        if (!userToFollow.followers.includes(req.user._id)) {
            userToFollow.followers.push(req.user._id);
            await userToFollow.save();
        }

        res.status(200).json({ followedUserId: userToFollow._id });
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * Deja de seguir a un usuario.
 * @param {Object} req - Objeto de solicitud HTTP que contiene el ID del usuario a dejar de seguir.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con un código de estado 204 si se deja de seguir al usuario correctamente.
 */
exports.unfollowUser = async (req, res) => {
    try {
        const userToUnfollow = await User.findById(req.params.userId);
        if (!userToUnfollow) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Remove user from following list
        req.user.following = req.user.following.filter(id => id.toString() !== req.params.userId);
        await req.user.save();

        // Remove follower from the unfollowed user
        userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== req.user._id.toString());
        await userToUnfollow.save();

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * Obtiene la lista de seguidores del usuario autenticado.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con la lista de seguidores.
 */
exports.getFollowers = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('followers', 'name lastName nickName profileImage');
        res.status(200).json(user.followers);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
};

/**
 * Obtiene la lista de usuarios seguidos por el usuario autenticado.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con la lista de usuarios seguidos.
 */
exports.getFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('following', 'name lastName nickName profileImage');
        res.status(200).json(user.following);
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * Cambia la contraseña del usuario autenticado.
 * @param {Object} req - Objeto de solicitud HTTP que contiene la contraseña actual y la nueva contraseña.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con un mensaje de éxito si la contraseña se cambia correctamente.
 */
exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(403).json({ message: 'Contraseña actual incorrecta.' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: 'Contraseña cambiada exitosamente.' });
};

/**
 * Cierra la sesión del usuario autenticado.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con un token JWT con una validez mínima.
 */
exports.logout = async (req, res) => {
    try {
        // Generar un token con una validez mínima (por ejemplo, 1 segundo)
        const token = jwt.sign(
            { userId: req.user.id }, // Asumiendo que el ID del usuario está disponible en req.user
            process.env.JWT_SECRET, // Se debe usar la misma clave secreta utilizada al crear el token
            { expiresIn: '1s' } // Duración mínima del token (1 segundo)
        );

        // Enviar el token en la respuesta
        res.status(200).json({ token });

    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ error: 'Hubo un error al procesar el logout' });
    }
};