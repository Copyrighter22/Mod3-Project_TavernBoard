const Tavern = require("../models/Tavern");
const Post = require("../models/Post");
const config = require("../config/config");
const createError = require("http-errors");

// -----------------------------------------------------------------------------
// @desc    Obtener todas las tabernas
// @route   GET /api/taverns
// @access  Público
// -----------------------------------------------------------------------------
const getTaverns = async (req, res, next) => {
  try {
    const taverns = await Tavern.find()
      .populate("owner", "username avatar name")
      .sort({ createdAt: -1 });

    res.status(200).json(taverns);
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------------------------------------------
// @desc    Obtener detalle de una taberna por ID y sus publicaciones
// @route   GET /api/taverns/:id
// @access  Público
// -----------------------------------------------------------------------------
const getTavernById = async (req, res, next) => {
  try {
    const tavern = await Tavern.findById(req.params.id)
      .populate("owner", "username avatar name")
      .populate("members", "username avatar name");

    if (!tavern) {
      return next(createError(404, "Taberna no encontrada"));
    }

    const posts = await Post.find({ tavern: req.params.id })
      .populate("author", "username avatar name")
      .sort({ createdAt: -1 });

    res.status(200).json({ tavern, posts });
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------------------------------------------
// @desc    Crear una nueva taberna (con opción de subir image y banner)
// @route   POST /api/taverns
// @access  Privado
// -----------------------------------------------------------------------------
const createTavern = async (req, res, next) => {
  const { name, description } = req.body;

  try {
    if (!name || !description) {
      return next(createError(400, "Nombre y descripción son obligatorios"));
    }

    const existingTavern = await Tavern.findOne({ name });
    if (existingTavern) {
      return next(createError(400, "Ya existe una taberna con ese nombre"));
    }

    // Usar la URL de Cloudinary, la URL del body o el fallback desde Convict
    const image = req.files?.image
      ? req.files.image[0].path
      : req.body.image || config.get("defaults.tavernIcon");

    const banner = req.files?.banner
      ? req.files.banner[0].path
      : req.body.banner || config.get("defaults.tavernBanner");

    const tavern = await Tavern.create({
      name,
      description,
      image,
      banner,
      owner: req.user.id,
      members: [req.user.id],
    });

    const populatedTavern = await tavern.populate(
      "owner",
      "username avatar name",
    );
    res.status(201).json(populatedTavern);
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------------------------------------------
// @desc    Unirse o salir de una taberna (Toggle pertenencia)
// @route   PUT /api/taverns/:id/join
// @access  Privado
// -----------------------------------------------------------------------------
const toggleJoinTavern = async (req, res, next) => {
  try {
    const tavern = await Tavern.findById(req.params.id);
    if (!tavern) {
      return next(createError(404, "Taberna no encontrada"));
    }

    const userIdStr = req.user.id.toString();
    const isMember = tavern.members.some((id) => id.toString() === userIdStr);

    if (isMember) {
      tavern.members = tavern.members.filter(
        (id) => id.toString() !== userIdStr,
      );
    } else {
      tavern.members.push(req.user.id);
    }

    await tavern.save();

    const updatedTavern = await Tavern.findById(tavern.id)
      .populate("owner", "username avatar name")
      .populate("members", "username avatar name");

    res.status(200).json(updatedTavern);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTaverns,
  getTavernById,
  createTavern,
  toggleJoinTavern,
};
