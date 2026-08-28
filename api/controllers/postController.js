const Post = require("../models/Post");
const Tavern = require("../models/Tavern");

// -----------------------------------------------------------------------------
// @desc    Obtener todas las publicaciones (Feed general)
// @route   GET /api/posts
// @access  Público
// -----------------------------------------------------------------------------
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username avatar name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------------------------------------
// @desc    Obtener publicaciones de una taberna concreta
// @route   GET /api/posts/tavern/:tavernId
// @access  Público
// -----------------------------------------------------------------------------
const getPostsByTavern = async (req, res) => {
  try {
    const posts = await Post.find({ tavern: req.params.tavernId })
      .populate("author", "username avatar name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------------------------------------
// @desc    Crear una publicación
// @route   POST /api/posts
// @access  Privado
// -----------------------------------------------------------------------------
const createPost = async (req, res) => {
  try {
    const { title, content, tavern } = req.body;

    const newPost = await Post.create({
      title,
      content,
      author: req.user._id,
      tavern: tavern || null,
    });

    const populatedPost = await Post.findById(newPost._id).populate(
      "author",
      "username name",
    );

    res.status(201).json(populatedPost);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear la publicación", error: error.message });
  }
};

// -----------------------------------------------------------------------------
// @desc    Dar o quitar "Me Gusta" de una publicación
// @route   PUT /api/posts/:id/like
// @access  Privado
// -----------------------------------------------------------------------------
const toggleLikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res.status(404).json({ message: "Publicación no encontrada" });

    // Asegurar que el array likes exista en el documento
    if (!post.upvotes) {
      post.upvotes = [];
    }

    const userIdStr = req.user._id.toString();
    const index = post.upvotes.findIndex((id) => id.toString() === userIdStr);

    if (index === -1) {
      post.upvotes.push(req.user._id);
    } else {
      post.upvotes.splice(index, 1);
    }

    await post.save();

    const updatedPost = await Post.findById(post._id).populate(
      "author",
      "username avatar name",
    );
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------------------------------------
// @desc    Eliminar una publicación
// @route   DELETE /api/posts/:id
// @access  Privado
// -----------------------------------------------------------------------------
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res.status(404).json({ message: "Publicación no encontrada" });

    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para borrar este post" });
    }

    await post.deleteOne();
    res.json({
      message: "Publicación eliminada correctamente",
      id: req.params.id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------------------------------------
// @desc    Obtener publicaciones de las tabernas a las que se ha unido el usuario
// @route   GET /api/posts/feed
// @access  Privado
// -----------------------------------------------------------------------------
const getJoinedFeed = async (req, res) => {
  try {
    // 1. Obtener las IDs de las tabernas donde el usuario es miembro
    const userTaverns = await Tavern.find({ members: req.user._id }).select(
      "_id",
    );
    const tavernIds = userTaverns.map((t) => t._id);

    // 2. Buscar publicaciones asociadas a esas tabernas
    const posts = await Post.find({ tavern: { $in: tavernIds } })
      .populate("author", "username name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el feed personalizado",
      error: error.message,
    });
  }
};

module.exports = {
  getPosts,
  getPostsByTavern,
  createPost,
  toggleLikePost,
  deletePost,
  getJoinedFeed,
};
