// -----------------------------------------------------------------------------
// @desc    Instancia y configuración del Logger centralizado con Pino
// -----------------------------------------------------------------------------
const pino = require("pino");
const config = require("../config/config");

const logger = pino({
  // Nivel de registro según el entorno (debug para desarrollo, info para producción)
  level: config.get("env") === "development" ? "debug" : "info",
  // Formateador visual con pino-pretty activo únicamente en entorno de desarrollo
  transport:
    config.get("env") === "development"
      ? {
          target: "pino-pretty",
          options: { colorize: true, translateTime: "SYS:standard" },
        }
      : undefined,
});

module.exports = logger;
