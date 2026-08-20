// Importamos el modelo de Taberna
const Tavern = require("../models/Tavern");

// -----------------------------------------------------------------------------
// @desc    Obtener todas las tabernas
// @route   GET /api/taverns
// @access  Público
// -----------------------------------------------------------------------------
const getTaverns = async (req, res) => {
  try {
    const taverns = await Tavern.find().populate("creator", "username email");
    res.json(taverns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------------------------------------
// @desc    Crear una nueva taberna
// @route   POST /api/taverns
// @access  Privado (requiere token JWT)
// -----------------------------------------------------------------------------
const createTavern = async (req, res) => {
  const { name, description } = req.body;

  try {
    const tavern = await Tavern.create({
      name,
      description,
      creator: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json(tavern);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTaverns, createTavern };
