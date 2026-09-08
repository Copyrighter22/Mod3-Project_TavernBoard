const createError = require("http-errors");
const config = require("../config/config");
const logger = require("../utils/logger");

// -----------------------------------------------------------------------------
// @desc    Middleware global para captura y formateo unificado de errores
// -----------------------------------------------------------------------------
const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || err.status || 500;

  // Manejo de errores específicos de Mongoose
  if (err.name === "CastError") {
    error = createError(400, `Formato de ID inválido: ${err.value}`);
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = createError(400, `El valor para '${field}' ya está registrado.`);
  }
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = createError(400, `Error de validación: ${messages.join(". ")}`);
  }
  if (err.name === "JsonWebTokenError") {
    error = createError(401, "Token no válido o alterado.");
  }
  if (err.name === "TokenExpiredError") {
    error = createError(401, "La sesión ha expirado.");
  }

  // Registros estructurados con logger Pino
  if (error.statusCode >= 500) {
    logger.error(err, "Error no controlado en el servidor");
  } else {
    logger.warn(
      { status: error.statusCode, message: error.message },
      "Error de cliente/operativo",
    );
  }

  res.status(error.statusCode).json({
    status: `${error.statusCode}`.startsWith("4") ? "fail" : "error",
    message: error.message || "Error interno del servidor",
    ...(config.get("env") === "development" && { stack: err.stack }),
  });
};

module.exports = globalErrorHandler;
