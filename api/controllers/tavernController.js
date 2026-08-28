const Tavern = require("../models/Tavern");
const Post = require("../models/Post");

// -----------------------------------------------------------------------------
// @desc    Obtener todas las tabernas
// @route   GET /api/taverns
// @access  Público
// -----------------------------------------------------------------------------
const getTaverns = async (req, res) => {
  try {
    const taverns = await Tavern.find()
      .populate("owner", "username avatar name")
      .sort({ createdAt: -1 });

    res.json(taverns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------------------------------------
// @desc    Obtener detalle de una taberna por ID y sus publicaciones
// @route   GET /api/taverns/:id
// @access  Público
// -----------------------------------------------------------------------------
const getTavernById = async (req, res) => {
  try {
    const tavern = await Tavern.findById(req.params.id)
      .populate("owner", "username avatar name")
      .populate("members", "username avatar name");

    if (!tavern) {
      return res.status(404).json({ message: "Taberna no encontrada" });
    }

    // Buscar las publicaciones asociadas a esta taberna
    const posts = await Post.find({ tavern: req.params.id })
      .populate("author", "username avatar name")
      .sort({ createdAt: -1 });

    // Devolver objeto con la taberna y sus publicaciones
    res.json({ tavern, posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------------------------------------
// @desc    Crear una nueva taberna
// @route   POST /api/taverns
// @access  Privado
// -----------------------------------------------------------------------------
const createTavern = async (req, res) => {
  const { name, description, image } = req.body;

  try {
    // Comprobar si ya existe una taberna con el mismo nombre
    const existingTavern = await Tavern.findOne({ name });
    if (existingTavern) {
      return res
        .status(400)
        .json({ message: "Ya existe una taberna con ese nombre" });
    }

    const tavern = await Tavern.create({
      name,
      description,
      image: image || "",
      owner: req.user._id,
      members: [req.user._id], // El creador se añade automáticamente como miembro
    });

    const populatedTavern = await tavern.populate(
      "owner",
      "username avatar name",
    );
    res.status(201).json(populatedTavern);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------------------------------------
// @desc    Unirse o salir de una taberna (Toggle pertenencia)
// @route   PUT /api/taverns/:id/join
// @access  Privado
// -----------------------------------------------------------------------------
const toggleJoinTavern = async (req, res) => {
  try {
    const tavern = await Tavern.findById(req.params.id);
    if (!tavern) {
      return res.status(404).json({ message: "Taberna no encontrada" });
    }

    const userIdStr = req.user._id.toString();
    const isMember = tavern.members.some((id) => id.toString() === userIdStr);

    if (isMember) {
      // Salir de la taberna
      tavern.members = tavern.members.filter(
        (id) => id.toString() !== userIdStr,
      );
    } else {
      // Unirse a la taberna
      tavern.members.push(req.user._id);
    }

    await tavern.save();

    const updatedTavern = await Tavern.findById(tavern._id)
      .populate("owner", "username avatar name")
      .populate("members", "username avatar name");

    res.json(updatedTavern);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTaverns,
  getTavernById,
  createTavern,
  toggleJoinTavern,
};
