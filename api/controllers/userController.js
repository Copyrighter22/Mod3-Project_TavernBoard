const User = require("../models/User");
const Post = require("../models/Post");
const Tavern = require("../models/Tavern");

// Obtener el perfil del usuario autenticado con su actividad
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Publicaciones creadas por el usuario
    const posts = await Post.find({ author: req.user._id }).sort({
      createdAt: -1,
    });

    // Tabernas a las que pertenece el usuario
    const taverns = await Tavern.find({ members: req.user._id });

    res.json({
      user,
      posts,
      taverns,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener perfil", error: error.message });
  }
};

module.exports = {
  getUserProfile,
};
