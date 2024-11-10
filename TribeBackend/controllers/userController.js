const User = require('../models/User');
const bcrypt = require('bcrypt');
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');

/**
 * Obtiene el perfil del usuario autenticado.
 * @param {Object} req - Objeto de solicitud HTTP, que debe contener el usuario autenticado en `req.user`.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {JSON} - Devuelve el perfil del usuario o un mensaje de error.
 */
exports.getProfile = async (req, res) => {
    try {
        // Check if req.user is populated
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated.' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
};

/**
 * Actualiza el perfil del usuario autenticado.
 * @param {Object} req - Objeto de solicitud HTTP con los datos a actualizar en `req.body`.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {JSON} - Devuelve el perfil actualizado o un mensaje de error.
 */
exports.updateProfile = async (req, res) => {
    try {
        const { name, lastName, profileImage, coverImage, description } = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, { name, lastName, profileImage, coverImage, description }, { new: true });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
};

/**
 * Elimina el perfil del usuario autenticado.
 * @param {Object} req - Objeto de solicitud HTTP, que debe contener el usuario autenticado.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {JSON} - Devuelve un estado 204 si se elimina correctamente o un mensaje de error.
 */
exports.deleteProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(204).send(); // No content
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
};

/**
 * Obtiene una lista de usuarios con búsqueda y paginación.
 * @param {Object} req - Objeto de solicitud HTTP con los parámetros de consulta `input`, `offset`, y `limit`.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {JSON} - Devuelve una lista de usuarios o un mensaje de error.
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
            return res.status(404).json({ message: 'No users found.' });
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
};

/**
 * Seguir a un usuario.
 * @param {Object} req - Objeto de solicitud HTTP con el ID del usuario a seguir en `req.params.userId`.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {JSON} - Devuelve el ID del usuario seguido o un mensaje de error.
 */
exports.followUser = async (req, res) => {
    console.log('Requesting to follow user ID:', req.params.userId);
    console.log('Authenticated user:', req.user);
    try {
        const userToFollow = await User.findById(req.params.userId);
        if (!userToFollow) {
            console.log('User not found in database');
            return res.status(404).json({ message: 'User not found.' });
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
        res.status(500).json({ message: 'Internal server error.' });
    }
};

/**
 * Dejar de seguir a un usuario.
 * @param {Object} req - Objeto de solicitud HTTP con el ID del usuario a dejar de seguir en `req.params.userId`.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {JSON} - Devuelve un estado 204 si se deja de seguir correctamente o un mensaje de error.
 */
exports.unfollowUser = async (req, res) => {
    try {
        const userToUnfollow = await User.findById(req.params.userId);
        if (!userToUnfollow) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Remove user from following list
        req.user.following = req.user.following.filter(id => id.toString() !== req.params.userId);
        await req.user.save();

        // Remove follower from the unfollowed user
        userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== req.user._id.toString());
        await userToUnfollow.save();

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
};

/**
 * Obtiene la lista de seguidores del usuario autenticado.
 * @param {Object} req - Objeto de solicitud HTTP que debe contener el usuario autenticado.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {JSON} - Devuelve la lista de seguidores o un mensaje de error.
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
 * @param {Object} req - Objeto de solicitud HTTP que debe contener el usuario autenticado.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {JSON} - Devuelve la lista de usuarios seguidos o un mensaje de error.
 */
exports.getFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('following', 'name lastName nickName profileImage');
        res.status(200).json(user.following);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
};

/**
 * Obtiene la lista de publicaciones favoritas del usuario autenticado.
 * @param {Object} req - Objeto de solicitud HTTP que debe contener el usuario autenticado.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {JSON} - Devuelve la lista de publicaciones favoritas o un mensaje de error.
 */
exports.getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('favorites', 'description multimedia location likes');
        res.status(200).json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
};

/**
 * Guarda una publicación como favorita.
 * @param {Object} req - Objeto de solicitud HTTP con el ID de la publicación a marcar como favorita en `req.params.favoriteId`.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {JSON} - Devuelve un mensaje de confirmación o un mensaje de error.
 */
exports.saveFavorite = async (req, res) => {
    try {
        const post = await Post.findById(req.params.favoriteId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        if (!req.user.favorites.includes(post._id)) {
            req.user.favorites.push(post._id);
            await req.user.save();
        }

        res.status(200).json({ message: 'Post added to favorites.' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
};

/**
 * Elimina una publicación de la lista de favoritos del usuario autenticado.
 * @param {Object} req - Objeto de solicitud HTTP que contiene la información del usuario y el ID de la publicación favorita a eliminar.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con un código de estado 204 si se elimina la publicación correctamente.
 */
exports.removeFavorite = async (req, res) => {
    try {
        req.user.favorites = req.user.favorites.filter(id => id.toString() !== req.params.favoriteId);
        await req.user.save();

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
};

/**
 * Cambia la contraseña del usuario autenticado.
 * @param {Object} req - Objeto de solicitud HTTP que contiene la contraseña actual y la nueva.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con un mensaje de éxito si la contraseña se cambia correctamente.
 */
exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(403).json({ message: 'Incorrect current password.' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: 'Password changed successfully.' });
};

// Logout
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