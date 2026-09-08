const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const config = require("../config/config");
const User = require("../models/User");

// -----------------------------------------------------------------------------
// @desc    Middleware para proteger rutas privadas mediante JWT (Cookie o Header)
// -----------------------------------------------------------------------------
const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Intentar obtener el token desde la cookie HttpOnly
    if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    // 2. Fallback: Obtener el token desde el header Authorization (Bearer <token>)
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Si no existe token en ninguna de las dos vías
    if (!token) {
      return next(
        createError(401, "No estás autorizado. Falta el token de acceso"),
      );
    }

    // Verificar firma del token
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    // Buscar el usuario en la base de datos (excluyendo la contraseña)
    const currentUser = await User.findById(decoded.id).select("-password");
    if (!currentUser) {
      return next(
        createError(401, "El usuario perteneciente a este token ya no existe"),
      );
    }

    // Adjuntar el usuario autenticado a la petición
    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { protect };
