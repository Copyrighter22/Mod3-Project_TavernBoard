const User = require("../models/User");
const Post = require("../models/Post");
const Tavern = require("../models/Tavern");
const Comment = require("../models/Comment");

// -----------------------------------------------------------------------------
// @desc    Obtener el perfil de un usuario con su actividad (posts y tabernas)
// @route   GET /api/users/profile/:id o GET /api/users/profile
// @access  Privado / Público
// -----------------------------------------------------------------------------
const getUserProfile = async (req, res) => {
  try {
    // Si viene un ID en la URL lo usa; si no, toma el del usuario autenticado
    const targetUserId = req.params.id || req.user?._id || req.user?.id;

    if (!targetUserId) {
      return res
        .status(400)
        .json({ message: "ID de usuario no proporcionado" });
    }

    const user = await User.findById(targetUserId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // 1. Publicaciones creadas por el usuario objetivo (.lean() para poder mutar los objetos)
    const posts = await Post.find({ author: targetUserId })
      .populate("author", "username avatar name")
      .populate("tavern", "name image")
      .sort({ createdAt: -1 })
      .lean();

    // 2. Contamos los comentarios de cada publicación en la colección Comment
    const postsWithCommentCount = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await Comment.countDocuments({ post: post._id });
        return {
          ...post,
          commentsCount,
        };
      }),
    );

    // Tabernas a las que pertenece el usuario objetivo
    const taverns = await Tavern.find({ members: targetUserId }).select(
      "name image description members",
    );

    res.json({
      user,
      posts: postsWithCommentCount,
      taverns,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener perfil", error: error.message });
  }
};

// -----------------------------------------------------------------------------
// @desc    Actualizar información general del perfil (bio, username)
// @route   PUT /api/users/profile
// @access  Privado
// -----------------------------------------------------------------------------
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (req.body.username) user.username = req.body.username;
    if (req.body.bio !== undefined) user.bio = req.body.bio;

    const updatedUser = await user.save();

    res.json({
      message: "Perfil actualizado con éxito",
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar perfil", error: error.message });
  }
};

// -----------------------------------------------------------------------------
// @desc    Actualizar avatar de usuario mediante subida de archivo (Cloudinary)
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
  updateProfile,
  updateAvatar,
};
