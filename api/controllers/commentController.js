const Comment = require("../models/Comment");
const Post = require("../models/Post");

// -----------------------------------------------------------------------------
// @desc    Crear un nuevo comentario en una publicación
// @route   POST /api/comments/post/:postId
// @access  Privado
// -----------------------------------------------------------------------------
const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    if (!content || !content.trim()) {
      return res
        .status(400)
        .json({ message: "El contenido del comentario es obligatorio" });
    }

    const postExists = await Post.findById(postId);
    if (!postExists) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    const newComment = await Comment.create({
      content,
      author: req.user._id,
      post: postId,
    });

    const populatedComment = await Comment.findById(newComment._id).populate(
      "author",
      "username avatar name",
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el comentario", error: error.message });
  }
};

// -----------------------------------------------------------------------------
// @desc    Obtener todos los comentarios de una publicación
// @route   GET /api/comments/post/:postId
// @access  Público
// -----------------------------------------------------------------------------
const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId })
      .populate("author", "username avatar name")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener comentarios", error: error.message });
  }
};

// -----------------------------------------------------------------------------
// @desc    Eliminar un comentario existente (solo el autor)
// @route   DELETE /api/comments/:commentId
// @access  Privado
// -----------------------------------------------------------------------------
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    const userIdStr = req.user._id.toString();
    const authorIdStr = comment.author.toString();

    if (authorIdStr !== userIdStr) {
      return res.status(403).json({ message: "No autorizado" });
    }

    await comment.deleteOne();
    res.json({ message: "Comentario eliminado correctamente", commentId });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar comentario", error: error.message });
  }
};

module.exports = {
  createComment,
  getCommentsByPost,
  deleteComment,
};
