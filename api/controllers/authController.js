const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// FUNCIÓN AUXILIAR: Genera un token JWT incluyendo solo el ID del usuario como carga útil (payload).
// Se firma con la clave secreta del .env y expira en 30 días.
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// -----------------------------------------------------------------------------
// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
// @access  Público
// -----------------------------------------------------------------------------
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "El usuario ya existe" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------------------------------------
// @desc    Autenticar usuario y obtener token (Login)
// @route   POST /api/auth/login
// @access  Público
// -----------------------------------------------------------------------------
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Credenciales inválidas" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };
