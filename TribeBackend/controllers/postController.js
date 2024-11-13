const mongoose = require('mongoose');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const { check, validationResult } = require('express-validator');
const { getCityFromCoordinates } = require('../utils/osmGeocoder');
const Bookmark = require('../models/Bookmark');
const { getMonthlyAds } = require('../utils/adsService');

/**
 * Obtiene posts para el timeline o feed.
 * @param {Object} req - Objeto de solicitud HTTP que contiene parámetros de paginación y ordenación.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con los posts del timeline.
 */
exports.getTimeline = async (req, res) => {
    const { offset = 0, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;
    const userId = req.user.id; 

    try {
        const posts = await Post.find()
            .skip(parseInt(offset))
            .limit(parseInt(limit))
            .sort({ [sort]: order === 'desc' ? -1 : 1 })
            .populate('userId', 'nickName profileImage')
            .populate({
                path: 'lastComment',
                populate: {
                    path: 'userId',
                    select: 'nickName profileImage'
                }
            })
            .lean();

        const postSummary = await Promise.all(posts.map(async post => {
            const isLiked = await Like.exists({ userId, postId: post._id });
            const isBookmarked = await Bookmark.exists({ userId, postId: post._id });
 
            return {
              ...post,
              isLiked: !!isLiked,
              isBookmarked: !!isBookmarked
          };
        }));

        res.status(200).json(postSummary);
    } catch (error) {
        console.error("Error en getTimeline:", error);
        res.status(500).json({ message: 'Error interno del servidor. Por favor, inténtalo de nuevo más tarde.' });
    }
};

/**
 * Obtiene los anuncios desde la API externa y los devuelve en la respuesta.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} - Responde con los anuncios obtenidos si la solicitud es exitosa.
 */
exports.fetchAds = async (req, res) => {
    try {
      const ads = await getMonthlyAds();
      res.status(200).json(ads);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los anuncios', error: error.message });
    }
};

/**
 * Crea un nuevo post.
 * @param {Object} req - Objeto de solicitud HTTP que contiene los detalles del nuevo post.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con el nuevo post creado y un mensaje de éxito.
 */
exports.createPost = [
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
        const post = await Post.findById(postId)
            .populate('userId', 'nickName profileImage')
            .populate({
                path: 'lastComment',
                populate: {
                    path: 'userId',
                    select: 'nickName profileImage'
                }
            })
            .lean();
        
        if (!post) {
            return res.status(404).json({ message: 'Post no encontrado' });
        }

        res.status(200).json(post);
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
        const comments = await Comment.find({ postId })
            .skip(parseInt(offset))
            .limit(parseInt(limit))
            .sort({ createdAt: -1 })
            .populate('userId', 'nickName profileImage');

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

    console.log('postId', postId);
    console.log('content', content);
    console.log('req.body', req.body);

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
        post.lastComment = savedComment._id;
        post.totalComments += 1;
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
    const userId = req.user._id;

    console.log('userId', userId);
    console.log('postId', postId);
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: 'postId inválido' });
    }

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post no encontrado' });
        }

        const like = new Like({ postId, userId });
        await like.save();

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
    const userId = req.user._id; 

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: 'postId inválido' });
    }

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post no encontrado' });
        }

        const like = await Like.findOne({ postId, userId });
        await Like.deleteOne({ _id: like._id });

        post.likes = Math.max(0, post.likes - 1);
        await post.save();

        res.status(204).send();
    } catch (error) {
        console.error("Error en unlikePost:", error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

/**
 * Marca un post como favorito para el usuario actual.
 * @param {Object} req - Objeto de solicitud HTTP que contiene el ID del post.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>}
 */
exports.bookmarkPost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: 'postId inválido' });
    }

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post no encontrado' });
        }

        const bookmark = new Bookmark({ postId, userId });
        await bookmark.save();

        res.status(200).json({ message: 'Post marcado como favorito' });
    } catch (error) {
        console.error("Error en bookmarkPost:", error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

/**
 * Elimina el marcador de favorito de un post para el usuario actual.
 * @param {Object} req - Objeto de solicitud HTTP que contiene el ID del post.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con un código de estado 204 si se elimina el 'bookmark' correctamente.
 */
exports.unbookmarkPost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: 'postId inválido' });
    }

    try {
        const bookmark = await Bookmark.findOne({ postId, userId });
        if (!bookmark) {
            return res.status(404).json({ message: 'Bookmark no encontrado' });
        }

        await Bookmark.deleteOne({ _id: bookmark._id });

        res.status(204).send();
    } catch (error) {
        console.error("Error en unbookmarkPost:", error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};