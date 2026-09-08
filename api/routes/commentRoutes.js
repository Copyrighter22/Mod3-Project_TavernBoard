const express = require("express");
const router = express.Router();
const {
  createComment,
  getCommentsByPost,
  deleteComment,
} = require("../controllers/commentController");
const { protect } = require("../middlewares/authMiddleware");

// -----------------------------------------------------------------------------
// @desc    Obtener todos los comentarios de una publicación
// @route   GET /api/comments/post/:postId
// @access  Público
// -----------------------------------------------------------------------------
router.get("/post/:postId", getCommentsByPost);

// -----------------------------------------------------------------------------
// @desc    Crear un nuevo comentario en una publicación
// @route   POST /api/comments/post/:postId
// @access  Privado
// -----------------------------------------------------------------------------
router.post("/post/:postId", protect, createComment);

// -----------------------------------------------------------------------------
// @desc    Eliminar un comentario existente (solo el autor)
// @route   DELETE /api/comments/:commentId
// @access  Privado
// -----------------------------------------------------------------------------
router.delete("/:commentId", protect, deleteComment);

module.exports = router;
