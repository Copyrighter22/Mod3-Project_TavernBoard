// -----------------------------------------------------------------------------
// @desc    Instancia y configuración del Logger centralizado con Pino (Blindado)
// -----------------------------------------------------------------------------
const pino = require("pino");
const config = require("../config/config");

let logger;

try {
  const isDevelopment = config.get("env") === "development";

  if (isDevelopment) {
    logger = pino({
      level: "debug",
      transport: {
        target: "pino-pretty",
        options: { colorize: true, translateTime: "SYS:standard" },
      },
    });
  } else {
    logger = pino({ level: "info" });
  }
} catch (error) {
  // Si falla cualquier cosa relacionada con transportes, usamos pino plano seguro
  logger = pino({ level: "info" });
}

module.exports = logger;
