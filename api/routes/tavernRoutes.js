const express = require("express");
const router = express.Router();
const {
  getTaverns,
  getTavernById,
  createTavern,
  toggleJoinTavern,
} = require("../controllers/tavernController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploader");

const tavernUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "banner", maxCount: 1 },
]);

// -----------------------------------------------------------------------------
// @desc    Obtener todas las tabernas
// @route   GET /api/taverns
// @access  Público
// -----------------------------------------------------------------------------
router.get("/", getTaverns);

// -----------------------------------------------------------------------------
// @desc    Obtener detalle de una taberna por ID y sus publicaciones
// @route   GET /api/taverns/:id
// @access  Público
// -----------------------------------------------------------------------------
router.get("/:id", getTavernById);

// -----------------------------------------------------------------------------
// @desc    Crear una nueva taberna (con opción de subir image y banner)
// @route   POST /api/taverns
// @access  Privado
// -----------------------------------------------------------------------------
router.post("/", protect, tavernUpload, createTavern);

// -----------------------------------------------------------------------------
// @desc    Unirse o salir de una taberna (Toggle pertenencia)
// @route   PUT /api/taverns/:id/join
// @access  Privado
// -----------------------------------------------------------------------------
router.put("/:id/join", protect, toggleJoinTavern);

module.exports = router;
