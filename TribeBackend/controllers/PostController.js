const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { validationResult } = require('express-validator');

/**
 * Crea un nuevo post.
 * @param {Object} req - Objeto de solicitud HTTP que contiene los detalles del nuevo post.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con el nuevo post creado y un mensaje de éxito.
 */
exports.createPost = async (req, res) => {
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
 * @param {Object} req - Objeto de solicitud HTTP que contiene el ID del post.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con los detalles del post si se encuentra, o un mensaje de error.
 */
exports.getPostById = async (req, res) => {
    const { postId } = req.params;

    try {
        // REVISAR POPULATE: ESTO TIENE QUE DEVOLVER SOLAMENTE EL ULTIMO COMENTARIO.
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
 * @param {Object} req - Objeto de solicitud HTTP que contiene el ID del post.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con la lista de comentarios del post.
 */
exports.getCommentsByPostId = async (req, res) => {
    const { postId } = req.params;
    // REVISAR ESTA DEFINICIÓN PORQUE EL OFFSET Y LIMIT DEBERIAN DE PODER MODIFICARSE
    // AGREGAR UNA VALIDACION DE QUE SI EL OFFSET ES MAYOR QUE LA CANTIDAD DE COMENTARIOS, DEVUELVA ALGO QUE INDIQUE ESO
    const { offset = 0, limit = 10 } = req.query;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post no encontrado' });
        }

        const comments = await Comment.find({ postId })
            .skip(parseInt(offset))
            .limit(parseInt(limit))
            // CHEQUEAR ESTE POPULATE
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
 * @param {Object} req - Objeto de solicitud HTTP que contiene el ID del post.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con el post actualizado si se hace el 'like' correctamente.
 */
exports.likePost = async (req, res) => {
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
 * @param {Object} req - Objeto de solicitud HTTP que contiene el ID del post.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con un código de estado 204 si se elimina el 'like' correctamente.
 */
exports.unlikePost = async (req, res) => {
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
 * @param {Object} req - Objeto de solicitud HTTP que contiene parámetros de paginación y ordenación.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Responde con los posts del timeline.
 */
exports.getTimelinePosts = async (req, res) => {
    // MODIFICAR ESTO POR QUE PARA LA PRIMERA ENTREGA NO VAMOS A TENER FOLLOWINGS, DEBERIA TOMAR TODOS LOS POSTS DE LA COLECCION DE POSTS Y LISTO
    const { offset = 0, limit = 10, sort = 'timestamp', order = 'desc' } = req.query;

    try {
        // Obtener los IDs de los usuarios seguidos por el usuario autenticado
        const followedUsers = await User.findById(req.user.id).select('following');
        
        // Buscar los posts de los usuarios seguidos
        // MODIFICARLO PARA NO DEVOLVER TODO, OJO CON LO DE LOS COMENTARIOS
        // JUANI NECESITA PARA EL TIMELINE TODO MENOS LOS COMENTARIOS (SOLAMENTE EL NUMERO DE COMENTARIOS)
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

// HACER DOS METODOS INTERNOS, UNO PARA TRAER LOS NUMEROS DE COMENTARIOS Y OTRO PARA TRAER EL ULTIMO COMENTARIO