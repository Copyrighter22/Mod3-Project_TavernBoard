const User = require("../models/User");
const Post = require("../models/Post");
const Tavern = require("../models/Tavern");

// -----------------------------------------------------------------------------
// @desc    Obtener el perfil del usuario autenticado con su actividad
// @route   GET /api/users/profile
// @access  Privado
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// @desc    Actualizar avatar de usuario
// @route   PUT /api/users/avatar
// @access  Privado
// -----------------------------------------------------------------------------
const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No se seleccionó ninguna imagen." });
    }

    // URL pública generada por Cloudinary
    const avatarUrl = req.file.path;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true },
    ).select("-password");

    res.json({
      message: "Avatar actualizado con éxito",
      user: updatedUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar el avatar", error: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateAvatar,
};
