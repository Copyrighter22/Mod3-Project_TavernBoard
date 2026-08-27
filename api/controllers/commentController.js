const Comment = require("../models/Comment");
const Post = require("../models/Post");

// Crear un comentario en un post
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

    const populatedComment = await newComment.populate(
      "author",
      "username name",
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el comentario", error: error.message });
  }
};

// Obtener comentarios de una publicación
const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId })
      .populate("author", "username name")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener comentarios", error: error.message });
  }
};

// Eliminar un comentario
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
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
