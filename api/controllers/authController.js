const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// -----------------------------------------------------------------------------
// @desc    Generar un token JWT con el ID del usuario (válido por 30 días)
// -----------------------------------------------------------------------------
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
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar || "",
      },
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
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar || "",
        },
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
