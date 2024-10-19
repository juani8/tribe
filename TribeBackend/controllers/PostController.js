const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { validationResult } = require('express-validator');

/**
 * Crea un nuevo post.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>}
 */
const createPost = async (req, res) => {
    console.log("Iniciando el proceso de creación de un nuevo post...");
    const { description, multimedia, location } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newPost = new Post({
            userId: req.user.id,
            description,
            multimedia,
            location
        });

        const savedPost = await newPost.save();
        console.log("Post creado:", savedPost);

        res.status(201).send({ data: savedPost, message: 'Post creado exitosamente' });
    } catch (error) {
        console.error("Error en createPost:", error);
        res.status(500).send({ message: 'Error interno del servidor', error: error.message });
    }
};

/**
 * Obtiene los detalles de un post específico.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>}
 */
const getPostById = async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await Post.findById(postId).populate('comments');
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
 * Obtiene todos los comentarios de un post específico.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>}
 */
const getCommentsByPostId = async (req, res) => {
    const { postId } = req.params;
    const { offset = 0, limit = 10 } = req.query;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post no encontrado' });
        }

        const comments = await Comment.find({ postId })
            .skip(parseInt(offset))
            .limit(parseInt(limit))
            .populate('userId', 'nickName profileImage');

        res.status(200).json(comments);
    } catch (error) {
        console.error("Error en getCommentsByPostId:", error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

/**
 * Crea un comentario en un post específico.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>}
 */
const createComment = async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
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

        const savedComment = await newComment.save();
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
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>}
 */
const likePost = async (req, res) => {
    const { postId } = req.params;

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
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>}
 */
const unlikePost = async (req, res) => {
    const { postId } = req.params;

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
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>}
 */
const getTimelinePosts = async (req, res) => {
    const { offset = 0, limit = 10, sort = 'timestamp', order = 'desc' } = req.query;

    try {
        // Obtener los IDs de los usuarios seguidos por el usuario autenticado
        const followedUsers = await User.findById(req.user.id).select('following');
        
        // Buscar los posts de los usuarios seguidos
        const posts = await Post.find({ userId: { $in: followedUsers.following } })
            .skip(parseInt(offset))
            .limit(parseInt(limit))
            .sort({ [sort]: order === 'desc' ? -1 : 1 });

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error en getTimelinePosts:", error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

// Exportar las funciones del controlador
module.exports = {
    createPost,
    getPostById,
    getCommentsByPostId,
    createComment,
    likePost,
    unlikePost,
    getTimelinePosts
};