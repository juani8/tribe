const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Bookmark = require('../models/Bookmark');
const Like = require('../models/Like');

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
        if (!req.user.name && !req.user.lastName && !req.user.gender) {
            // Verificar si es la primera vez que se completa el perfil
            if (!name || !lastName || !gender) {
                return res.status(400).json({
                    message: 'Por favor, complete los campos obligatorios: nombre, apellido y género.',
                });
            }
        }

        // Crear un objeto con los campos a actualizar
        const updateFields = {};
        if (name) updateFields.name = name;
        if (lastName) updateFields.lastName = lastName;
        if (profileImage) updateFields.profileImage = profileImage;
        if (coverImage) updateFields.coverImage = coverImage;
        if (description) updateFields.description = description;
        if (gender) updateFields.gender = gender;

        // Actualizar el usuario en la base de datos
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateFields },
            { new: true }
        ).select('-password -following -followers -gamificationLevel');

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
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Modifica el correo electrónico y el nickname del usuario eliminado para que sean únicos
        const newEmail = `${user.email}_deleted_${Date.now()}`;
        const newNickName = `${user.nickName}_deleted_${Date.now()}`;

        // Actualiza el usuario para marcarlo como eliminado y cambiar su correo electrónico y nickname
        user.isDeleted = true;
        user.email = newEmail;
        user.nickName = newNickName;
        await user.save();

        res.status(204).send();
    } catch (error) {
        console.error('Error interno del servidor:', error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}
/**
 * Obtiene una lista de usuarios con búsqueda y paginación.
 * @param {Object} req - Objeto de solicitud HTTP que contiene parámetros de búsqueda y paginación.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con la lista de usuarios encontrados.
 */
exports.getUsers = async (req, res) => {
    const { input = '', offset = 0, limit = 10 } = req.query;

    try {
        const currentUser = await User.findById(req.user.id).select('following');

        const users = await User.find({
            _id: { $ne: req.user.id },
            isDeleted: false,
            $or: [
                { name: new RegExp(input, 'i') }, 
                { lastName: new RegExp(input, 'i') },
                { nickName: new RegExp(input, 'i') }
            ]
        })
            .skip(parseInt(offset))
            .limit(parseInt(limit))
            .select('profileImage name lastName nickName email');

        if (!users.length) {
            return res.status(404).json({ message: 'No se encontraron usuarios.' });
        }

        const usersWithFollowFlag = users.map(user => ({
            ...user.toObject(),
            isFollowed: currentUser.following.includes(user._id)
        }));

        res.status(200).json({ users: usersWithFollowFlag });
    } catch (error) {
        console.error('Error en getUsers:', error);
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
        if (!req.user) {
            return res.status(401).json({ message: 'Usuario no autenticado.' });
        }
        const user = await User.findById(req.user._id);

        const userToFollow = await User.findById(req.params.userId);
        console.log(userToFollow);


        if (!userToFollow) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        if (user._id.toString() === userToFollow._id.toString()) {
            return res.status(400).json({ message: 'No puedes seguirte a ti mismo.' });
        }

        const isAlreadyFollowing = user.following.includes(userToFollow._id);
        const isAlreadyFollowedBy = userToFollow.followers.includes(user._id);

        if (isAlreadyFollowing && isAlreadyFollowedBy) {
            return res.status(400).json({ message: 'Ya sigues a este usuario.' });
        }

        if (!isAlreadyFollowing) {
            user.following.push(userToFollow._id);
            user.numberOfFollowing = user.following.length;
            await user.save();
        }

        if (!isAlreadyFollowedBy) {
            userToFollow.followers.push(user._id);
            userToFollow.numberOfFollowers = userToFollow.followers.length;
            await userToFollow.save();
        }

        res.status(200).json({ followedUserId: userToFollow._id });
    } catch (error) {
        console.error("Error saving user or userToFollow:", error);
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
        if (!req.user) {
            return res.status(401).json({ message: 'Usuario no autenticado.' });
        }

        const user = await User.findById(req.user._id);

        const userToUnfollow = await User.findById(req.params.userId);
        console.log(userToUnfollow);

        if (!userToUnfollow) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        if (user._id.toString() === userToUnfollow._id.toString()) {
            return res.status(400).json({ message: 'No puedes dejar de seguirte a ti mismo.' });
        }

        const isFollowing = user.following.includes(userToUnfollow._id);
        const isFollowedBy = userToUnfollow.followers.includes(user._id);

        if (!isFollowing || !isFollowedBy) {
            return res.status(400).json({ message: 'No sigues a este usuario.' });
        }

        user.following = user.following.filter(id => id.toString() !== userToUnfollow._id.toString());
        user.numberOfFollowing = user.following.length;
        await user.save();

        userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== user._id.toString());
        userToUnfollow.numberOfFollowers = userToUnfollow.followers.length;
        await userToUnfollow.save();

        res.status(200).json({ message: 'Usuario dejado de seguir con éxito.', unfollowedUserId: userToUnfollow._id });
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
        const user = await User.findById(req.user.id).populate({
            path: 'followers',
            match: { isDeleted: false },
            select: 'name lastName nickName profileImage'
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const filteredFollowers = user.followers.filter(follower => !follower.isDeleted);
        const numberOfFollowers = filteredFollowers.length;
        res.status(200).json({ followers: filteredFollowers, numberOfFollowers });
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * Obtiene la lista de usuarios seguidos por el usuario autenticado.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con la lista de usuarios seguidos.
 */
exports.getFollowings = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'following',
            match: { isDeleted: false },
            select: 'name lastName nickName profileImage'
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const filteredFollowings = user.following.filter(followingUser => !followingUser.isDeleted);
        const numberOfFollowings = filteredFollowings.length;
        res.status(200).json({ following: filteredFollowings, numberOfFollowings });
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

    if (user.isGoogleUser) {
        return res.status(400).json({ message: 'No puedes cambiar tu contraseña, ya que tu cuenta está asociada a Google.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(403).json({ message: 'Contraseña actual incorrecta.' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: 'Contraseña cambiada exitosamente.' });
};

/**
 * Obtiene las métricas del usuario autenticado.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con las métricas del usuario.
 */
exports.getUserMetrics = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Usuario no autenticado.' });
        }

        const userId = req.user.id;

        const numberOfFollowers = await User.countDocuments({ following: userId, isDeleted: false });
        const numberOfFollowing = await User.countDocuments({ followers: userId, isDeleted: false });
        const numberOfPosts = await Post.countDocuments({ userId });
        const bookmarks = await Bookmark.find({ userId }).populate({
            path: 'postId',
            populate: {
                path: 'userId',
                select: 'isDeleted',
                match: { isDeleted: false }
            }
        });
        const numberOfFavorites = bookmarks.filter(bookmark => bookmark.postId && bookmark.postId.userId).length;
        const numberOfComments = await Comment.countDocuments({ userId });
        const likes = await Like.find({ userId }).populate({
            path: 'postId',
            populate: {
                path: 'userId',
                select: 'isDeleted',
                match: { isDeleted: false }
            }
        });
        const numberOfLikes = likes.filter(like => like.postId && like.postId.userId).length;

        // Obtener el nivel de gamificación del usuario
        const user = await User.findById(userId).select('gamificationLevel');
        const gamificationLevel = user.gamificationLevel;

        // Definir los niveles de gamificación
        const levels = [
            { level: 1, description: 'usuario nuevo', minPosts: 0 },
            { level: 2, description: 'usuario activo', minPosts: 5 },
            { level: 3, description: 'usuario avanzado', minPosts: 10 },
            { level: 4, description: 'usuario experto', minPosts: 15 },
        ];

        // Obtener el minPosts para el siguiente nivel
        const currentLevel = gamificationLevel.level;
        const nextLevel = levels.find(level => level.level === currentLevel + 1);
        const minPosts = nextLevel ? nextLevel.minPosts : null;

        const metrics = {
            numberOfFollowers,
            numberOfFollowing,
            numberOfPosts,
            numberOfFavorites,
            numberOfComments,
            numberOfLikes,
            gamificationLevel,
            minPosts
        };

        res.status(200).json(metrics);
    } catch (error) {
        console.error('Error en getUserMetrics:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * Actualiza el nivel de gamificación del usuario.
 * @param {Object} user - Objeto del usuario.
 * @returns {Promise<void>} - Actualiza el nivel de gamificación del usuario si corresponde.
 */
exports.updateGamificationLevel = async (user) => {
    const levels = [
        { level: 1, description: 'usuario nuevo', minPosts: 0 },
        { level: 2, description: 'usuario activo', minPosts: 5 },
        { level: 3, description: 'usuario avanzado', minPosts: 10 },
        { level: 4, description: 'usuario experto', minPosts: 15 },
    ];

    const currentLevel = user.gamificationLevel.level;
    const nextLevel = levels.find(level => level.level === currentLevel + 1);

    if (nextLevel && user.numberOfPosts >= nextLevel.minPosts) {
        user.gamificationLevel = { level: nextLevel.level, description: nextLevel.description };
        await user.save();
    }
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