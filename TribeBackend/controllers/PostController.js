const mongoose = require('mongoose');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { check, validationResult } = require('express-validator');
const { getCityFromCoordinates } = require('../utils/osmGeocoder');

/**
 * Crea un nuevo post.
 * @param {Object} req - Objeto de solicitud HTTP que contiene los detalles del nuevo post.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con el nuevo post creado y un mensaje de éxito.
 */
exports.createPost = [
    // Validación de los campos
    check('multimedia').notEmpty().withMessage('El contenido multimedia es obligatorio.'),
    check('description').optional(),
    check('latitude').optional(),
    check('longitude').optional(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 400, message: 'La solicitud contiene datos inválidos o incompletos.', errors: errors.array() });
        }

        const { description, multimedia, latitude, longitude } = req.body;

        try {
            let city;
            if (latitude !== undefined && longitude !== undefined) {
                // Obtener el nombre de la ciudad usando las coordenadas
                city = await getCityFromCoordinates(latitude, longitude);
            }

            const newPost = new Post({
                userId: req.user.id,
                description,
                multimedia,
                location: {
                    latitude, 
                    longitude, 
                    city
                }
            });

            const savedPost = await newPost.save();

            res.status(201).send({ data: savedPost, message: 'Post creado exitosamente' });
        } catch (error) {
            console.error("Error en createPost:", error);
            
            if (error.message.includes('Coordenadas inválidas')) {
                return res.status(400).json({ error: 400, message: 'La solicitud contiene datos inválidos o incompletos.' });
            }
            
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
    }
]; 

/**
 * Obtiene los detalles de un post específico.
 * @param {Object} req - Objeto de solicitud HTTP que contiene el ID del post.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con los detalles del post si se encuentra, o un mensaje de error.
 */
exports.getPostById = async (req, res) => {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: 'postId inválido' });
    }

    try {
        const post = await Post.findById(postId).lean();
        
        if (!post) {
            return res.status(404).json({ message: 'Post no encontrado' });
        }

        const totalComments = await Comment.countDocuments({ postId });
        const lastComment = await Comment.findOne({ postId }).sort({ createdAt: -1 }).populate('userId');

        const response = {
            ...post,
            totalComments,
            lastComment: lastComment || 'Aún no hay comentarios'
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Error en getPostById:", error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};   

/**
 * Obtiene todos los comentarios de un post específico. Cada vez que el usuario navega a una nueva página, el frontend hace una nueva 
 * solicitud al backend con los parámetros de paginación actualizados (por ejemplo, offset y limit).
 * @param {Object} req - Objeto de solicitud HTTP que contiene el ID del post.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con la lista de comentarios del post.
 */
exports.getCommentsByPostId = async (req, res) => {
    const { postId } = req.params;
    /**
     * Los valores 0 y 10 son valores por defecto, en caso de que no sean proporcionados en la query. 
     * El frontend es responsable de calcular y enviar el offset correcto en cada solicitud para obtener la página deseada. 
     * El offset se incrementa en función del limit cada vez que se navega a una nueva página (offset + limit)
     */
    const { offset = 0, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: 'postId inválido' });
    }

    try {
        const post = await Post.findById(postId).populate({
            path: 'comments',
            options: {
                sort: { createdAt: -1 },
                skip: parseInt(offset),
                limit: parseInt(limit)
            },
            // Llena el campo userId en cada comentario con los datos del usuario, seleccionando solo nickName y profileImage.
            populate: { path: 'userId', select: 'nickName profileImage' }
        });

        if (!post) {
            return res.status(404).json({ message: 'Post no encontrado' });
        }

        const comments = post.comments;

        res.status(200).json(comments);
    } catch (error) {
        console.error("Error en getCommentsByPostId:", error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};


/**
 * Crea un comentario en un post específico.
 * @param {Object} req - Objeto de solicitud HTTP que contiene el ID del post y el contenido del comentario.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con el comentario creado o un mensaje de error.
 */
exports.createComment = async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: 'postId inválido' });
    }

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post no encontrado' });
        }

        const newComment = new Comment({
            userId: req.user.id,
            postId,
            comment: content
        });

        // Intenta guardar el comentario y maneja cualquier error que ocurra
        let savedComment;
        try {
            savedComment = await newComment.save();
        } catch (error) {
            console.error("Error al guardar el comentario:", error);
            return res.status(500).json({ message: 'No se pudo crear el comentario', error: error.message });
        }

        // Solo actualiza el post si el comentario se creó correctamente
        post.comments.push(savedComment._id);
        await post.save();

        res.status(201).json(savedComment);
    } catch (error) {
        console.error("Error en createComment:", error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

/**
 * Da un 'like' a un post.
 * @param {Object} req - Objeto de solicitud HTTP que contiene el ID del post.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con el post actualizado si se hace el 'like' correctamente.
 */
exports.likePost = async (req, res) => {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: 'postId inválido' });
    }

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post no encontrado' });
        }

        post.likes += 1;
        await post.save();

        res.status(200).json(post);
    } catch (error) {
        console.error("Error en likePost:", error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

/**
 * Elimina un 'like' de un post.
 * @param {Object} req - Objeto de solicitud HTTP que contiene el ID del post.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con un código de estado 204 si se elimina el 'like' correctamente.
 */
exports.unlikePost = async (req, res) => {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: 'postId inválido' });
    }

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post no encontrado' });
        }

        post.likes = Math.max(0, post.likes - 1);
        await post.save();

        res.status(204).send();
    } catch (error) {
        console.error("Error en unlikePost:", error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

/**
 * Obtiene posts para el timeline o feed.
 * @param {Object} req - Objeto de solicitud HTTP que contiene parámetros de paginación y ordenación.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con los posts del timeline.
 */
/**exports.getTimeline = async (req, res) => {
    const { offset = 0, limit = 10, sort = 'timestamp', order = 'desc' } = req.query;

    try {
        // Obtener los IDs de los usuarios seguidos por el usuario autenticado
        const followedUsers = await User.findById(req.user.id).select('following');
        if (!followedUsers) {
            return res.status(404).json({ message: 'Usuarios seguidos no encontrados.' });
        }
        
        // Buscar los posts de los usuarios seguidos
        const posts = await Post.find({ userId: { $in: user.following } })
            .skip(parseInt(offset))
            .limit(parseInt(limit))
            .select('-comments') 
            .sort({ [sort]: order === 'desc' ? -1 : 1 })
            .lean();

        const postSummary = await Promise.all(posts.map(async post => {
            const totalComments = await Comment.countDocuments({ postId: post._id });
            return {
                ...post,
                totalComments
            };
        }));

        res.status(200).json(postSummary);
    } catch (error) {
        console.error("Error en getTimeline:", error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};*/

exports.getTimeline = async (req, res) => {
    const { offset = 0, limit = 10, sort = 'timestamp', order = 'desc' } = req.query;

    try {
        // Buscar los posts en la colección Post
        const posts = await Post.find()
            .skip(parseInt(offset))
            .limit(parseInt(limit))
            .select('-comments') 
            .populate('userId', 'profileImage nickName')
            .sort({ [sort]: order === 'desc' ? -1 : 1 })
            .lean();

        // Calcular el número de comentarios para cada post
        const postSummary = await Promise.all(posts.map(async post => {
            const totalComments = await Comment.countDocuments({ postId: post._id });
            const lastComment = await Comment.findOne({ postId: post._id }).sort({ createdAt: -1 });

            return {
                ...post,
                totalComments,
                lastComment: lastComment || null
            };
        }));

        res.status(200).json(postSummary);
    } catch (error) {
        console.error("Error en getTimeline:", error);
        res.status(500).json({ message: 'Error interno del servidor. Por favor, inténtalo de nuevo más tarde.' });
    }
};