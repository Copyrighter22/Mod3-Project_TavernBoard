const Post = require("../models/Post");
const Tavern = require("../models/Tavern");
const createError = require("http-errors");

// -----------------------------------------------------------------------------
// @desc    Obtener todas las publicaciones globales
// @route   GET /api/posts
// @access  Público
// -----------------------------------------------------------------------------
const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("author", "username avatar name")
      .populate("tavern", "name image")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------------------------------------------
// @desc    Obtener publicaciones de las tabernas a las que pertenece el usuario
// @route   GET /api/posts/my-taverns
// @access  Privado
// -----------------------------------------------------------------------------
const getMyTavernsPosts = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;

    const userTaverns = await Tavern.find({ members: userId }).select("_id");
    const tavernIds = userTaverns.map((t) => t._id);

    const posts = await Post.find({ tavern: { $in: tavernIds } })
      .populate("author", "username avatar name")
      .populate("tavern", "name image")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------------------------------------------
// @desc    Crear una nueva publicación (imágenes, ubicación y taberna opcionales)
// @route   POST /api/posts
// @access  Privado
// -----------------------------------------------------------------------------
const createPost = async (req, res, next) => {
  const { title, content, tavernId, location } = req.body;

  try {
    if (!title || !content) {
      return next(
        createError(400, "El título y el contenido son obligatorios"),
      );
    }

    // Validar taberna si existe
    let validTavernId = null;
    if (
      tavernId &&
      tavernId !== "null" &&
      tavernId !== "undefined" &&
      String(tavernId).trim() !== ""
    ) {
      const tavernExists = await Tavern.findById(tavernId);
      if (!tavernExists) {
        return next(createError(404, "La taberna especificada no existe"));
      }
      validTavernId = tavernId;
    }

    // Parsear ubicación si existe
    let parsedLocation = null;
    if (location && location !== "null" && location !== "undefined") {
      try {
        parsedLocation =
          typeof location === "string" ? JSON.parse(location) : location;
      } catch (e) {
        parsedLocation = null;
      }
    }

    // Extracción segura de URLs de imágenes proporcionadas por Multer/Cloudinary
    let imageUrls = [];
    try {
      if (req.files && Array.isArray(req.files)) {
        imageUrls = req.files.map((file) => file.path);
      } else if (req.file) {
        imageUrls = [req.file.path];
      }
    } catch (uploadErr) {
      console.error(
        "Aviso procesando imágenes de Cloudinary:",
        uploadErr.message,
      );
    }

    const userId = req.user.id || req.user._id;

    const newPost = await Post.create({
      title,
      content,
      author: userId,
      tavern: validTavernId,
      location: parsedLocation,
      images: imageUrls,
    });

    const populatedPost = await Post.findById(newPost._id)
      .populate("author", "username avatar name")
      .populate("tavern", "name image");

    res.status(201).json(populatedPost);
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------------------------------------------
// @desc    Dar o quitar 'upvote' a una publicación (Toggle)
// @route   PUT /api/posts/:id/upvote
// @access  Privado
// -----------------------------------------------------------------------------
const toggleUpvotePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(createError(404, "Publicación no encontrada"));
    }

    const userIdStr = (req.user.id || req.user._id).toString();
    const hasUpvoted = post.upvotes.some((id) => id.toString() === userIdStr);

    if (hasUpvoted) {
      post.upvotes = post.upvotes.filter((id) => id.toString() !== userIdStr);
    } else {
      post.upvotes.push(req.user.id || req.user._id);
    }

    await post.save();

    const updatedPost = await Post.findById(post.id)
      .populate("author", "username avatar name")
      .populate("tavern", "name image");

    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------------------------------------------
// @desc    Obtener detalle de una publicación por ID
// @route   GET /api/posts/:id
// @access  Público
// -----------------------------------------------------------------------------
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username avatar name")
      .populate("tavern", "name image");

    if (!post) {
      return next(createError(404, "Publicación no encontrada"));
    }

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------------------------------------------
// @desc    Eliminar una publicación (solo el autor)
// @route   DELETE /api/posts/:id
// @access  Privado
// -----------------------------------------------------------------------------
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = (req.user.id || req.user._id).toString();

    const post = await Post.findById(id);

    if (!post) {
      return next(createError(404, "Publicación no encontrada"));
    }

    // Comprobar que el usuario logueado sea el autor de la publicación
    if (post.author.toString() !== userId) {
      return next(
        createError(403, "No tienes permiso para eliminar esta publicación"),
      );
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({ message: "Publicación eliminada correctamente" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getMyTavernsPosts,
  getPostById,
  createPost,
  toggleUpvotePost,
  deletePost,
};
