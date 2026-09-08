const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

// -----------------------------------------------------------------------------
// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
// @access  Público
// -----------------------------------------------------------------------------
router.post("/register", registerUser);

// -----------------------------------------------------------------------------
// @desc    Autenticar usuario y obtener token (Login)
// @route   POST /api/auth/login
// @access  Público
// -----------------------------------------------------------------------------
router.post("/login", loginUser);

module.exports = router;
