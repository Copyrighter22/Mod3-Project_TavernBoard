const Tavern = require("../models/Tavern");
const User = require("../models/User");
const Post = require("../models/Post");

// -----------------------------------------------------------------------------
// @desc    Búsqueda global simultánea en tabernas, usuarios y publicaciones
// @route   GET /api/search?q=query
// @access  Público
// -----------------------------------------------------------------------------
const searchAll = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.json({ taverns: [], users: [], posts: [] });
    }

    const regex = new RegExp(q, "i");

    // Buscamos simultáneamente en las 3 colecciones
    const [taverns, users, posts] = await Promise.all([
      Tavern.find({ name: regex }).select("name image description").limit(4),
      User.find({ username: regex })
        .select("username avatar")
        .select("-password")
        .limit(4),
      Post.find({ title: regex })
        .select("title author")
        .populate("author", "username")
        .limit(4),
    ]);

    res.json({ taverns, users, posts });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en la búsqueda", error: error.message });
  }
};

module.exports = { searchAll };
