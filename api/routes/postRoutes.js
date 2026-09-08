const express = require("express");
const router = express.Router();
const {
  getPosts,
  getMyTavernsPosts,
  getPostById,
  createPost,
  toggleUpvotePost,
  deletePost,
} = require("../controllers/postController");
const { protect } = require("../middlewares/authMiddleware");
const uploader = require("../middlewares/uploader");

// -----------------------------------------------------------------------------
// @desc    Obtener todas las publicaciones globales
// @route   GET /api/posts
// @access  Público
// -----------------------------------------------------------------------------
router.get("/", getPosts);

// -----------------------------------------------------------------------------
// @desc    Obtener publicaciones de las tabernas a las que pertenece el usuario
// @route   GET /api/posts/my-taverns
// @access  Privado
// -----------------------------------------------------------------------------
router.get("/my-taverns", protect, getMyTavernsPosts);

// -----------------------------------------------------------------------------
// @desc    Obtener detalle de una publicación por ID
// @route   GET /api/posts/:id
// @access  Público
// -----------------------------------------------------------------------------
router.get("/:id", getPostById);

// -----------------------------------------------------------------------------
// @desc    Crear una nueva publicación (imágenes, ubicación y taberna opcionales)
// @route   POST /api/posts
// @access  Privado
// -----------------------------------------------------------------------------
router.post("/", protect, uploader.array("images", 5), createPost);

// -----------------------------------------------------------------------------
// @desc    Dar o quitar 'upvote' a una publicación (Toggle)
// @route   PUT /api/posts/:id/upvote
// @access  Privado
// -----------------------------------------------------------------------------
router.put("/:id/upvote", protect, toggleUpvotePost);

// -----------------------------------------------------------------------------
// @desc    Eliminar una publicación (solo el autor)
// @route   DELETE /api/posts/:id
// @access  Privado
// -----------------------------------------------------------------------------
router.delete("/:id", protect, deletePost);

module.exports = router;
