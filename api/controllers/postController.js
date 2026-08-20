const Post = require("../models/Post");

// -----------------------------------------------------------------------------
// @desc    Obtener publicaciones de una taberna concreta
// @route   GET /api/posts/tavern/:tavernId
// @access  Público
// -----------------------------------------------------------------------------
const getPostsByTavern = async (req, res) => {
  try {
    const posts = await Post.find({ tavern: req.params.tavernId })
      .populate("author", "username avatar")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------------------------------------
// @desc    Crear una publicación en una taberna
// @route   POST /api/posts
// @access  Privado
// -----------------------------------------------------------------------------
const createPost = async (req, res) => {
  const { title, content, tavernId } = req.body;

  try {
    const post = await Post.create({
      title,
      content,
      tavern: tavernId,
      author: req.user._id,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPostsByTavern, createPost };
