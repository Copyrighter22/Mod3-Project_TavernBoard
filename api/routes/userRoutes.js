const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateAvatar,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploader");

// -----------------------------------------------------------------------------
// Rutas de Perfil de Usuario
// -----------------------------------------------------------------------------
router.get("/profile", protect, getUserProfile);
router.put("/avatar", protect, upload.single("avatar"), updateAvatar);

module.exports = router;
