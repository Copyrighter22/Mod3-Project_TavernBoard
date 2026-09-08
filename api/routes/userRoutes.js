const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateProfile,
  updateAvatar,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploader");

// -----------------------------------------------------------------------------
// @desc    Obtener perfil de usuario (propio o por ID)
// @route   GET /api/users/profile o GET /api/users/profile/:id
// @access  Privado
// -----------------------------------------------------------------------------
router.get("/profile", protect, getUserProfile);
router.get("/profile/:id", protect, getUserProfile);

// -----------------------------------------------------------------------------
// @desc    Actualizar información general del perfil (bio, username)
// @route   PUT /api/users/profile
// @access  Privado
// -----------------------------------------------------------------------------
router.put("/profile", protect, updateProfile);

// -----------------------------------------------------------------------------
// @desc    Actualizar avatar de usuario mediante subida de archivo a Cloudinary
// @route   PUT /api/users/avatar
// @access  Privado
// -----------------------------------------------------------------------------
router.put("/profile", protect, updateProfile);
router.put("/avatar", protect, upload.single("avatar"), updateAvatar);

module.exports = router;